using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Unicode;
using System.Threading;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Extensions;
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
        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly IAIJobConfigs _jobConfigs;
        public WorkersAIJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkersAIJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue, IAIJobConfigs aiJobConfigs) : base(config, logger, clickhouseService, context, queue)
        {
            _jobConfigs = aiJobConfigs;
            _apiBroker = apiBroker;
        }

        public override string Name => "Workers AI";
        public override string InternalName => "ai";

        public override string JobType => "AI";

        public override string JobDescription => "AI Perf Job";
        public override int TargetExecutionSecond => 32;

        public override bool Enabled => _config.AI != null && (_config.AI.Enabled.HasValue == false || _config.AI is { Enabled: true });


        public override async Task BaseRun()
        {
            List<AIGetModelsResponse.AIGetModelsResponseDTO> models = null;
            var tryFindData = await _dbContext.GenericJobData.FirstOrDefaultAsync(data => data.JobName == InternalName);
            var prefetchJobData = await _dbContext.JobData.AsTracking().Where(job => job.JobType == JobType).ToListAsync();
            var listOfJobNames = new List<string>(prefetchJobData.Select(job => job.InternalJobName));
            var prefetchJobLocsData = await _dbContext.JobLocations.AsTracking().Where(job => listOfJobNames.Contains(job.InternalJobName)).ToListAsync();

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
                models = getValue.Result.ToList();
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
                models = getModels.ToList();
            }
            else
            {
                throw new Exception("Could not get model data, nothing in DB and API did not respond right.");
            }

            var tryGetStaticDBData = await _dbContext.GenericJobData.FirstOrDefaultAsync(data => data.JobName == InternalName + "_static");
            if (tryGetStaticDBData != null)
            {
                int injectedModels = 0;
                try
                {
                    var getStaticModels =
                        JsonSerializer.Deserialize<AIGetModelsResponse.AIGetModelsResponseDTO[]>(
                            tryGetStaticDBData.Value);
                    foreach (var staticModel in getStaticModels)
                    {
                        var tryGetCurrent = models.FirstOrDefault(model =>
                            model.Name.Equals(staticModel.Name, StringComparison.OrdinalIgnoreCase));
                        if (tryGetCurrent == null)
                        {
                            models.Add(staticModel);
                            injectedModels += 1;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deseralizing custom static ai model config data");
                }

                _logger.LogInformation($"Injected {injectedModels} models from static config");
            }
            else
            {
                _logger.LogInformation($"No Static models from ${InternalName + "_static"}");
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
                    try
                    {
                        foreach (var run in Runs)
                        {
                            var tryGetJob = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.InternalJobName == run.JobName);
                            if (tryGetJob == null)
                            {
                                var newJobData = tryGetJob = new JobData()
                                {
                                    JobName = run.JobName,
                                    InternalJobName = run.JobName,
                                    JobType = "AI",
                                    JobDescription = "AI Model Run"
                                };
                                _dbContext.JobData.Add(newJobData);
                            }
                            else
                            {
                                tryGetJob.LastRunStatus = tryGetJob.CurrentRunStatus;
                                tryGetJob.LastRunLengthMs = tryGetJob.CurrentRunLengthMs;
                                tryGetJob.LastRunTime = tryGetJob.CurrentRunTime;
                            }

                            tryGetJob.CurrentRunTime = run.RunTime;
                            tryGetJob.CurrentRunLengthMs = run.ResponseLatency; // for AI jobs, RunLength = Tokens, ResponseLatency = Latency
                            tryGetJob.CurrentRunStatus = run.RunStatus;
                        }

                        foreach (var location in Locations)
                        {
                            var tryGetLocation = await _dbContext.JobLocations.AsTracking()
                                .FirstOrDefaultAsync(job => job.InternalJobName == location.JobName && job.LocationName == location.LocationName);
                            if (tryGetLocation == null)
                            {
                                var newJobData = tryGetLocation = new JobDataLocation()
                                {
                                    JobName = location.JobName,
                                    InternalJobName = location.JobName,
                                    LocationName = location.LocationName
                                };
                                _dbContext.JobLocations.Add(newJobData);
                            }
                            else
                            {
                                tryGetLocation.LastRunStatus = tryGetLocation.CurrentRunStatus;
                                tryGetLocation.LastRunLengthMs = tryGetLocation.CurrentRunLengthMs;
                                tryGetLocation.LastRunTime = tryGetLocation.CurrentRunTime;
                            }

                            tryGetLocation.CurrentRunTime = location.RunTime;
                            tryGetLocation.CurrentRunLengthMs =
                                location.ResponseLatency; // for AI jobs, RunLength = Tokens, ResponseLatency = Latency
                            tryGetLocation.CurrentRunStatus = location.RunStatus;
                        }
                        await TrySave(true);

                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Issue saving to Db");
                    }
                    var errorList = Errors.ToList();
                    try
                    {
                        await InsertTrackedErrors(_dbContext, errorList, JobType, _logger);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error logging errors to postgres");
                    }

                    await _clickHouseService.InsertRunAI(Runs.ToList(), Locations.ToList(), errorList);
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
            public AILocationReturn(bool success, ulong duration, DateTime responseUtc, int? coloId, int? tokens, ulong? bindingDuration)
            {
                Success = success;
                Duration = duration;
                ResponseUtc = responseUtc;
                ColoId = coloId;
                Tokens = tokens;
                BindingDuration = bindingDuration;
            }

            public bool Success { get; set; }

            public ulong Duration { get; set; }

            public ulong? BindingDuration { get; set; }

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
                        Result<SerializableHttpResponse>? taskResult = null;
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


                        if (taskResult == null || (taskResult?.IsFailed ?? true) || taskResult.ValueOrDefault == null)
                        {
                            FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, -1, null, null));
                            continue;
                        }
                        var tryGetValue = taskResult!.Value!;

                        if (String.IsNullOrWhiteSpace(tryGetValue.Body))
                        {
                            FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, GetColoId(tryGetValue.Headers), null, TryGetBindingDir(tryGetValue.Headers)));
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
                                FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, GetColoId(tryGetValue.Headers), null, TryGetBindingDir(tryGetValue.Headers)));
                            }

                            if (parsedResult != null)
                            {
                                if (parsedResult.Success)
                                {
                                    FinishedLocationStatus.Add(completedLocation,
                                        new AILocationReturn(parsedResult.Success,
                                            (ulong)tryGetValue.ResponseTimeMs.Value,
                                            tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                            GetColoId(tryGetValue.Headers), parsedResult.Tokens, TryGetBindingDir(tryGetValue.Headers)));

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
                                            GetColoId(tryGetValue.Headers), parsedResult.Tokens, TryGetBindingDir(tryGetValue.Headers)));
                                }
                                else
                                {
                                    FinishedLocationStatus.Add(completedLocation, new AILocationReturn(false, 0, DateTime.UtcNow, GetColoId(tryGetValue.Headers), null, TryGetBindingDir(tryGetValue.Headers)));
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
                ulong averageBindingLatencyOfSuccessful = 0;
                if (FinishedLocationStatus.Any(kvp => kvp.Value.Success))
                {

                    var tryGetSuccessful = FinishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Select(kvp => (double)kvp.Value.Duration).ToList();
                    if (tryGetSuccessful.Any())
                    {
                        averageOfSuccessFull = (ulong)tryGetSuccessful.Median();
                        averageTokensOfSuccessful = (ulong)FinishedLocationStatus.Where(kvp => kvp.Value.Success)
                            .Average(kvp => (double)(kvp.Value.Tokens ?? 0));
                    }

                    var tryGetBindingLatenciesToUse = FinishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Where(kvp => kvp.Value.BindingDuration != null)
                        .Select(kvp => (double)kvp.Value.BindingDuration!.Value).ToList();
                    if (tryGetBindingLatenciesToUse.Any())
                        averageBindingLatencyOfSuccessful = (ulong)tryGetBindingLatenciesToUse
                            .Median();


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
                        BindingResponseLatency = averageBindingLatencyOfSuccessful,
                    }, FinishedLocationStatus.ToList().Select(
                            locationDataKv => new ClickhouseJobLocationRun()
                            {
                                JobName = model.Name,
                                RunStatus = locationDataKv.Value.Success ? "Success": "Failure",
                                LocationName = locationDataKv.Key.Name,
                                RunLength = (ulong)(locationDataKv.Value.Tokens ?? 0),
                                RunTime = locationDataKv.Value.ResponseUtc,
                                ResponseLatency = locationDataKv.Value.Duration,
                                BindingResponseLatency = locationDataKv.Value.BindingDuration ?? 0,
                                ColoId = locationDataKv.Value.ColoId ?? 0,
                            }).ToList(), errors?.Any() == false ? new List<ClickhouseAPIError>() :  errors.Select(error => ClickhouseAPIError.CreateFromCustomError(model.Name, error)).ToList() ?? null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting run statistics into Clickhouse");
            }
            _logger.LogInformation($"{model.Name} done: We got {FinishedLocationStatus.Count(pair => pair.Value.Success)} successful locations and {errors.Count} errors.");
        }

        public ConcurrentBag<ClickhouseJobRun> Runs = new ConcurrentBag<ClickhouseJobRun>();
        public ConcurrentBag<ClickhouseJobLocationRun> Locations = new ConcurrentBag<ClickhouseJobLocationRun>();
        public ConcurrentBag<ClickhouseAPIError> Errors = new ConcurrentBag<ClickhouseAPIError>();

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

        public static ulong? TryGetBindingDir(Dictionary<string, string> headers)
        {
            if (headers != null)
            {
                var tryGetHeader = headers.FirstOrDefault(headerKvp =>
                    headerKvp.Key.Equals("x-adp-dur", StringComparison.OrdinalIgnoreCase));
                if (String.IsNullOrWhiteSpace(tryGetHeader.Value) == false &&
                    ulong.TryParse(tryGetHeader.Value, out var parsedDur))
                    return parsedDur;
            }

            return null;
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
                    { "APIKEY", _config.AI.AIWorkerSecret}
                },
                URL = "https://" + _config.AI.AIWorkerHostname,
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
                NoResponseHeaders = true,
                ReturnBody = false,
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
                Method = MethodType.POST,
                RetriesCount = 0,
                NoResponseHeaders = true,
                ResponseHeaders = new List<string>()
                {
                    "colo",
                    "server",
                    "x-adp-dur",
                }

            };
            if (String.IsNullOrEmpty(config.OutputTypeCheck) == false)
                newRequest.Headers["OutputTypeCheck"] = config.OutputTypeCheck;
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
