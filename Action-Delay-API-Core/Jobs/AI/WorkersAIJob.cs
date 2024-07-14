using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Unicode;
using System.Threading;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.AI;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs.AI
{
    public class WorkerResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("error")]
        public AiError? Error { get; set; }

        [JsonPropertyName("tokens")]
        public int? Tokens { get; set; }

    }

    public partial class AiError
    {
        [JsonPropertyName("code")]
        public string Code { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("logs")]
        public string Logs { get; set; }
    }
    public class WorkersAIJob : BaseJob
    {

        private readonly IAIJobConfigs _jobConfigs;
        public WorkersAIJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkersAIJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue, IAIJobConfigs aiJobConfigs) : base(apiBroker, config, logger, clickhouseService, context, queue)
        {
            _jobConfigs = aiJobConfigs;
        }

        public override string Name => "Workers AI";
        public override string InternalName => "ai";

        public override string JobType => "AI";

        public override string JobDescription => "AI Perf Job";
        public override int TargetExecutionSecond => 32;

        public override bool Enabled => _config.AI != null && (_config.AI.Enabled.HasValue == false || _config.AI is { Enabled: true });


        public override async Task BaseRun()
        {
            AIGetModelsResponse.AIGetModelsResponseDTO[] models = null;
            var tryFindData = await _dbContext.GenericJobData.FirstOrDefaultAsync(data => data.JobName == InternalName);

            var tryGetAIModels =
               await _apiBroker.GetAIModels(_config.AI.AccountId, _config.AI.API_Key, CancellationToken.None);
            if (tryGetAIModels.IsFailed)
            {
                _logger.LogCritical($"Failure getting Worker AI Models, logs: {tryGetAIModels.Errors?.FirstOrDefault()?.Message}");
            }
            if (tryGetAIModels.IsSuccess && tryGetAIModels.Value?.Result?.Any() == false)
            {
                _logger.LogCritical($"Failure getting Worker AI Models, empty result, logs: {tryGetAIModels.Errors?.FirstOrDefault()?.Message}");
            }

            if (tryGetAIModels.IsSuccess && (tryGetAIModels.Value?.Result?.Any() ?? false))
            {
                var getValue = tryGetAIModels.Value;
                models = getValue.Result;
                if (tryFindData == null)
                {
                    tryFindData = new GenericJobData()
                    {
                        JobName = InternalName
                    };
                    _dbContext.GenericJobData.Add(tryFindData);
                }
                tryFindData.LastUpdated = DateTime.UtcNow;
                tryFindData.Value = JsonSerializer.Serialize(models);
                tryFindData.Metadata = "Updated";
                await TrySave(true);
                _logger.LogInformation($"Got AI Models, updated DB, count: {getValue.Result.Length}");
            }
            else if (tryFindData != null)
            {
                _logger.LogInformation($"Using in-db AI Models since API is not available");
                var getModels =
                    JsonSerializer.Deserialize<AIGetModelsResponse.AIGetModelsResponseDTO[]>(
                        tryFindData.Value);
                models = getModels;
            }
            else
            {
                throw new Exception("Could not get model data, nothing in DB and API did not respond right.");
            }

            var locationsEnabled = new HashSet<string>(_config.AI.Locations, StringComparer.OrdinalIgnoreCase);
            var getUsableLocations = _config.Locations.Where(location =>
                location.Disabled == false && locationsEnabled.Contains(location.Name)).DistinctBy(loc => loc.Name).ToList();
            if (getUsableLocations.Any() == false)
            {
                throw new Exception("No Usable locations");
            }

            await PreWarmAction(getUsableLocations);
            List<Task> runningJobs = new List<Task>();
            List<string> modelswithNoConfigs = new List<string>();
            foreach (var model in models.DistinctBy(model => model.Name))
            {
                var tryGetModelConfig = _jobConfigs.GetConfig(model);
                if (tryGetModelConfig == null)
                {
                    _logger.LogInformation($"Could not get AI model config for {model.Name}");
                    modelswithNoConfigs.Add(model.Name);
                    continue;
                }
                runningJobs.Add(RunAIModel(model, tryGetModelConfig, getUsableLocations));
            }
            runningJobs.Add(Task.Delay(5000));
            await Task.WhenAll(runningJobs);
            _logger.LogInformation($"Models with no config: {string.Join(", ", modelswithNoConfigs)}");
            try
            {
                if (Runs.Any())
                {
                    await _clickHouseService.InsertRunAI(Runs, Locations, Errors);
                }
                Runs.Clear();
                Locations.Clear();
                Errors.Clear();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting into Clickhouse");
            }
            _logger.LogInformation($"AI Run over");
        }

        public class AILocationReturn
        {
            public AILocationReturn(bool success, ulong duration, DateTime responseUtc, int? coloId, int? tokens = null)
            {
                Success = success;
                Duration = duration;
                ResponseUtc = responseUtc;
                ColoId = coloId;
                Tokens = tokens;
            }

            public bool Success { get; set; }

            public ulong Duration { get; set; }

            public DateTime ResponseUtc { get; set; }

            public int? ColoId { get; set; }

            public int? Tokens { get; set; }
        }


        public async Task RunAIModel(AIGetModelsResponse.AIGetModelsResponseDTO model, AIJobConfig config, List<Location> locations)
        {
            var RunningLocations  = new Dictionary<Location, Task<Result<SerializableHttpResponse>>>();
            
            var FinishedLocationStatus  = new Dictionary<Location, AILocationReturn>();

            List<CustomAPIError>? errors = new List<CustomAPIError>();

            // Start monitoring on each Location
            foreach (var location in locations)
            {
                var task = SendRequest(config, location, CancellationToken.None);
                RunningLocations[location] = task;
            }

            SentrySdk.AddBreadcrumb($"Started Locations for {Name}");

            try
            {
                // Check the status of tasks continuously
                while (RunningLocations.Values.Count(task => task != null) > 0)
                {
                    try
                    {
                        // Get the task that finishes first

                        var completedTask = await Task.WhenAny(RunningLocations.Values);
                        var completedLocation = RunningLocations.First(x => x.Value == completedTask).Key;
                        Result<SerializableHttpResponse> taskResult = null;
                        try
                        {
                            taskResult = await completedTask;
                        }
                        catch (OperationCanceledException ex)
                        {
                            _logger.LogWarning(ex,
                                $"{model.Name} had {completedLocation} time out.");
                            taskResult = null;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex,
                                $"{model.Name} had {completedLocation} error out.");
                            taskResult = null;
                        }


                        // Remove the completed task from the running tasks
                        RunningLocations.Remove(completedLocation);


                        if (taskResult?.IsFailed ?? false)
                        {
                            FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, -1));

                        }
                        var tryGetValue = taskResult.Value!;

                        if (String.IsNullOrWhiteSpace(tryGetValue.Body))
                        {
                            FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, -1));
                        }
                        else
                        {
                            WorkerResponse? parsedResult = null;
                            try
                            {
                                 parsedResult =
                                    System.Text.Json.JsonSerializer.Deserialize<WorkerResponse>(tryGetValue.Body);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex,
                                    $"Failure parsing response for {model.Name} from {completedLocation.Name}");
                                FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, -1));
                            }

                            if (parsedResult != null)
                            {
                                if (parsedResult.Success)
                                {
                                    FinishedLocationStatus.Add(completedLocation,
                                        new AILocationReturn(parsedResult.Success,
                                            (ulong)tryGetValue.ResponseTimeMs.Value,
                                            tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                            GetColoId(tryGetValue.Headers), parsedResult.Tokens));

                                }
                                else if (parsedResult is { Success: false, Error: not null })
                                {
                                    var newError = new CustomAPIError(parsedResult.Error.Message,
                                        (int)tryGetValue.StatusCode, parsedResult.Error.Message,
                                        parsedResult.Error.Code, tryGetValue.ResponseTimeMs, GetColoId(tryGetValue.Headers));
                                    newError.LocationName = completedLocation.Name;
                                    errors.Add(newError);
                                    FinishedLocationStatus.Add(completedLocation,
                                        new AILocationReturn(parsedResult.Success,
                                            (ulong)tryGetValue.ResponseTimeMs.Value,
                                            tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                            GetColoId(tryGetValue.Headers), parsedResult.Tokens));
                                }
                                else
                                {
                                    FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, -1));
                                }
                            }
                        }


                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation(
                            $"{model.Name} had {RunningLocations.Count} locations, namely: {String.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))} timed out.");
                        /* NOM NOM */
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling location runs for job {name}, aborting... Locations not finished yet: {locations}", Name, String.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name)));
            }
            SentrySdk.AddBreadcrumb($"Finished Locations for {Name}");

 
            try
            {
                ulong averageTokensOfSuccessful = 0;
                ulong averageOfSuccessFull = 0;
                if (FinishedLocationStatus.Any(kvp => kvp.Value.Success))
                {
                    averageOfSuccessFull = (ulong)FinishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Average(kvp => (double)kvp.Value.Duration);
                    averageTokensOfSuccessful = (ulong)FinishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Average(kvp => (double)(kvp.Value.Tokens ?? 0));
                }


                FinishedRunInsertLater(
                    new ClickhouseJobRun()
                    {
                        JobName = model.Name,
                        RunStatus = (FinishedLocationStatus.All(kvp => kvp.Value.Success) || (FinishedLocationStatus.Count(kvp => kvp.Value.Success) >=
                                                           (locations.Count() / 2) )) ? "Success": "Failure",
                        RunLength = averageTokensOfSuccessful,
                        RunTime = DateTime.UtcNow,
                        ResponseLatency = averageOfSuccessFull,
                    }, FinishedLocationStatus.ToList().Select(
                            locationDataKv => new ClickhouseJobLocationRun()
                            {
                                JobName = model.Name,
                                RunStatus = locationDataKv.Value.Success ? "Success": "Failure",
                                LocationName = locationDataKv.Key.Name,
                                RunLength = (ulong)(locationDataKv.Value.Tokens ?? 0),
                                RunTime = locationDataKv.Value.ResponseUtc,
                                ResponseLatency = locationDataKv.Value.Duration,
                                ColoId = locationDataKv.Value.ColoId ?? 0,
                            }).ToList(), errors?.Any() == false ? new List<ClickhouseAPIError>() :  errors.Select(error => ClickhouseAPIError.CreateFromCustomError(model.Name, error)).ToList() ?? null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting run statistics into Clickhouse");
            }
            _logger.LogInformation($"{model.Name} done: We got {FinishedLocationStatus.Count(pair => pair.Value.Success)} successful locations and {errors.Count} errors.");
        }

        public List<ClickhouseJobRun> Runs = new List<ClickhouseJobRun>();
        public List<ClickhouseJobLocationRun> Locations = new List<ClickhouseJobLocationRun>();
        public List<ClickhouseAPIError> Errors = new List<ClickhouseAPIError>();

        public void FinishedRunInsertLater(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations,
            List<ClickhouseAPIError>? apiError = null)
        {

            if (run != null)
                Runs.Add(run);
            if (locations != null)
                Locations.AddRange(locations);
            if (apiError != null)
                Errors.AddRange(apiError);
        }
        
        public static int GetColoId(Dictionary<string, string> headers)
        {
            if (headers != null && headers.TryGetValue("colo", out var coloStr) &&
                int.TryParse(coloStr, out var coloInt))
                return coloInt;
            return -1;
        }

        public async Task PreWarmAction(List<Location> locations)
        {
            try
            {
                Dictionary<Location, Task> preInitWarmTasks = new();
                foreach (var location in locations)
                {
                    preInitWarmTasks.Add(location, SendRequestWarmup(location, CancellationToken.None));
                }

                foreach (var preInitTask in preInitWarmTasks)
                {
                    try
                    {
                        await preInitTask.Value;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogCritical(ex,
                            $"{Name}: Failure warming location: {preInitTask.Key.DisplayName ?? preInitTask.Key.Name}");
                    }
                }
                _logger.LogInformation($"Finished Pre-Warm: {preInitWarmTasks.Count(task => task.Value.IsCompletedSuccessfully)} Locations Completely Successfully. Failed Locations: {String.Join(", ", preInitWarmTasks.Where(task => task.Value.IsFaulted).Select(task => task.Key.DisplayName ?? task.Key.Name))}");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    $"Failure running PreWarmAction for {Name}");
            }
        }

        private async Task<Result<SerializableHttpResponse>> SendRequestWarmup(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                    { "Worker", location.DisplayName ?? location.Name },
                    { "APIKEY", _config.AI.AIWorkerSecret}
                },
                URL = "https://" + _config.AI.AIWorkerHostname,
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
            };
            newRequest.SetDefaultsFromLocation(location);
            return await _queue.HTTP(newRequest, location, token);
        }


        private async Task<Result<SerializableHttpResponse>> SendRequest(AIJobConfig config, Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                    { "Worker", location.DisplayName ?? location.Name },
                    { "APIKEY", _config.AI!.AIWorkerSecret},
                    { "model", config.ModelName},
                    { "input", config.Input},
                    { "inputField", config.InputField},
                    { "outputType", config.OutputType},
                },
                URL = "https://" + _config.AI.AIWorkerHostname + $"/{config.ModelName}",
                TimeoutMs = 40_000,
                EnableConnectionReuse = true,
                ReturnBody = true,
                ContentType = "application/octet-stream",
                BodyBytes = config.Content,
                Method = MethodType.POST
            };
            newRequest.SetDefaultsFromLocation(location);
            if (config.MaxTokens.HasValue && config.MaxTokens.Value > 0)
                newRequest.Headers.Add("maxTokens", config.MaxTokens.Value.ToString());
            return await _queue.HTTP(newRequest, location, token, 60);
        }

        public override async Task RunAction()
        {
            throw new NotImplementedException();
        }
    }
}
