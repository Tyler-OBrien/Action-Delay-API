﻿using System.Net;
using System.Security.Cryptography;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Jobs.AI;
using System.Linq;

namespace Action_Delay_API_Core.Jobs.Performance
{
    public class GenericUploadBaseJob : BaseJob
    {
        public GenericUploadBaseJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config,
            ILogger<GenericUploadBaseJob> logger, IClickHouseService clickhouseService,
            ActionDelayDatabaseContext context, IQueue queue) : base(apiBroker, config, logger, clickhouseService,
            context, queue)
        {
        }




        public override string Name => "PerfBaseUploadJob";
        public override string InternalName => "PerfBaseUploadJob";

        public override string JobType => "Perf";

        public override string JobDescription => "Generic Perf Job";
        public override int TargetExecutionSecond => 30;

        public override bool Enabled => _config.PerfConfig != null &&
                                        (_config.PerfConfig.Enabled.HasValue == false || _config.PerfConfig is
                                        { Enabled: true });

        public override async Task BaseRun()
        {
            using var scope = _logger.BeginScope(Name);
            using var sentryScope = SentrySdk.PushScope();
            SentrySdk.AddBreadcrumb($"Starting Job {Name}");

            _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");

            var getDownloadTasks = _config.PerfConfig!.UploadJobs;

            List<Task> runningJobs = new List<Task>();
            foreach (var uploadTask in getDownloadTasks)
            {

                runningJobs.Add(RunSpecificJob(uploadTask));
            }

            runningJobs.Add(Task.Delay(5000));
            await Task.WhenAll(runningJobs);
            try
            {
                if (Runs.Any())
                {
                    await _clickHouseService.InsertRunPerf(Runs, Locations, Errors);
                }

                Runs.Clear();
                Locations.Clear();
                Errors.Clear();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting into Clickhouse");
            }

            _logger.LogInformation($"Perf Run over");
            await Task.Delay(TimeSpan.FromMinutes(1));
        }


        public async Task RunSpecificJob(UploadJobGeneric job)
        {
            var allowedLocsHashset = new HashSet<string>(job.AllowedEdgeLocations, StringComparer.OrdinalIgnoreCase);
            var locationsToUse = _config.Locations.Where(location =>
                location.Disabled == false && allowedLocsHashset.Contains(location.Name)).ToList();
            var name = job.Name;
            var cancellationTokenSource = new CancellationTokenSource();
            try
            {
                Dictionary<Location, Task> preInitWarmTasks = new();
                foreach (var location in locationsToUse)
                {
                    preInitWarmTasks.Add(location, SendRequestWarmup(location, job, CancellationToken.None));
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
                            $"{name}: Failure warming location: {preInitTask.Key.DisplayName ?? preInitTask.Key.Name}, removing from run...");
                        locationsToUse.Remove(preInitTask.Key);
                    }
                }

                _logger.LogInformation(
                    $"Finished Pre-Warm: {preInitWarmTasks.Count(task => task.Value.IsCompletedSuccessfully)} Locations Completely Successfully. Failed Locations: {string.Join(", ", preInitWarmTasks.Where(task => task.Value.IsFaulted).Select(task => task.Key.DisplayName ?? task.Key.Name))}");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    $"Failure running PreWarmAction for {name}");
            }

            var runningLocations = new Dictionary<Location, Task<Result<SerializableHttpResponse>>>();

            var finishedLocationStatus = new Dictionary<Location, UploadPerformanceLocationReturn>();

            List<CustomAPIErrorPerf>? errors = new List<CustomAPIErrorPerf>();

            var locations = locationsToUse;

            // Start monitoring on each Location
            foreach (var location in locations)
            {

                var task = BaseRunLocation(location, cancellationTokenSource.Token, job);
                runningLocations[location] = task;
            }

            SentrySdk.AddBreadcrumb($"Started Locations for {name}");

            try
            {
                // Check the status of tasks continuously
                while (runningLocations.Values.Count(task => task != null) > 0)
                {
                    try
                    {
                        // Get the task that finishes first

                        var completedTask = await Task.WhenAny(runningLocations.Values);
                        var completedLocation = runningLocations.First(x => x.Value == completedTask).Key;
                        Result<SerializableHttpResponse>? taskResult = null;
                        try
                        {
                            taskResult = await completedTask;
                        }
                        catch (OperationCanceledException ex)
                        {
                            _logger.LogWarning(ex,
                                $"{name} had {completedLocation} time out.");
                            taskResult = null;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex,
                                $"{name} had {completedLocation} error out.");
                            taskResult = null;
                        }


                        // Remove the completed task from the running tasks
                        runningLocations.Remove(completedLocation);


                        if (taskResult == null || (taskResult?.IsFailed ?? true) || taskResult.ValueOrDefault == null)
                        {
                            finishedLocationStatus.Add(completedLocation,
                                new UploadPerformanceLocationReturn(false, 0, DateTime.UtcNow, null));
                            continue;
                        }

                        var tryGetValue = taskResult.Value!;


                        if (tryGetValue.WasSuccess)
                        {
                            finishedLocationStatus.Add(completedLocation,
                                new UploadPerformanceLocationReturn(tryGetValue.WasSuccess,
                                    (ulong)tryGetValue.ResponseTimeMs.Value,
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers)));

                        }
                        else if (tryGetValue.WasSuccess == false)
                        {
                            _logger.LogInformation(
                                $"Non-Success for {name}, location: {completedLocation.DisplayName ?? completedLocation.Name}, status: {tryGetValue.StatusCode} and error looks like: {tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(50)}");
                            if (tryGetValue.ProxyFailure == false)
                            {
                                var newError = new CustomAPIErrorPerf(
                                    tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(100),
                                    (int)(tryGetValue.StatusCode),
                                    tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(100),
                                    tryGetValue.StatusCode.ToString(), tryGetValue.ResponseTimeMs,
                                    GetColoId(tryGetValue.Headers));
                                newError.LocationName = completedLocation.Name;
                                errors.Add(newError);
                            }
                            finishedLocationStatus.Add(completedLocation,
                                new UploadPerformanceLocationReturn(tryGetValue.WasSuccess,
                                    (ulong)(tryGetValue?.ResponseTimeMs.HasValue == false
                                        ? 0
                                        : tryGetValue!.ResponseTimeMs!.Value),
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers)));
                        }



                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation(
                            $"{name} had {runningLocations.Count} locations, namely: {string.Join(", ", runningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))} timed out.");
                        /* NOM NOM */
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error handling location runs for job {name}, aborting... Locations not finished yet: {locations}",
                    name, string.Join(", ", runningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name)));
            }

            SentrySdk.AddBreadcrumb($"Finished Locations for {name}");



            try
            {
                ulong averageOfSuccessFull = 0;
                if (finishedLocationStatus.Any(kvp => kvp.Value.Success))
                {
                    averageOfSuccessFull = (ulong)finishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Average(kvp => (double)kvp.Value.Duration);

                }

                var runStatus = (finishedLocationStatus.All(kvp => kvp.Value.Success) ||
                                 (finishedLocationStatus.Count(kvp => kvp.Value.Success) >=
                                  (locations.Count() / 2)))
                    ? "Success"
                    : "Failure";

                if (finishedLocationStatus.Any() == false)
                    runStatus = "Failure";

                _logger.LogInformation($"Finished {name}, runStatus: {runStatus}, average ms: {averageOfSuccessFull}");
                FinishedRunInsertLater(
                    new ClickhouseJobRunPerf()
                    {
                        JobName = name,
                        RunStatus = runStatus,
                        RunLength = 0,
                        RunTime = DateTime.UtcNow,
                        ResponseLatency = averageOfSuccessFull,
                    }, finishedLocationStatus.ToList().Select(
                        locationDataKv => new ClickhouseJobLocationRunPerf()
                        {
                            JobName = name,
                            RunStatus = locationDataKv.Value.Success ? "Success" : "Failure",
                            LocationName = locationDataKv.Key.Name,
                            RunLength = 0,
                            RunTime = locationDataKv.Value.ResponseUtc,
                            ResponseLatency = locationDataKv.Value.Duration,
                            LocationId = locationDataKv.Value.LocationId ?? string.Empty,
                        }).ToList(),
                    errors?.Any() == false
                        ? new List<ClickhouseAPIErrorPerf>()
                        : errors?.Select(error => ClickhouseAPIErrorPerf.CreateFromCustomError(name, error)).ToList() ??
                          null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting run statistics into Clickhouse");
            }
        }


        public List<ClickhouseJobRunPerf> Runs = new List<ClickhouseJobRunPerf>();
        public List<ClickhouseJobLocationRunPerf> Locations = new List<ClickhouseJobLocationRunPerf>();
        public List<ClickhouseAPIErrorPerf> Errors = new List<ClickhouseAPIErrorPerf>();

        public void FinishedRunInsertLater(ClickhouseJobRunPerf run, List<ClickhouseJobLocationRunPerf>? locations,
            List<ClickhouseAPIErrorPerf>? apiError = null)
        {

            if (run != null)
                Runs.Add(run);
            if (locations != null)
                Locations.AddRange(locations);
            if (apiError != null)
                Errors.AddRange(apiError);
        }

        public static string GetColoId(Dictionary<string, string> headers)
        {
            if (headers != null && headers.TryGetValue("colo", out var coloStr))
                return coloStr;
            if (headers != null && headers.TryGetValue("server", out var serverHdr) &&
                serverHdr.StartsWith("BunnyCDN-", StringComparison.OrdinalIgnoreCase))
            {
                var trySplit = serverHdr.Split('-');
                if (trySplit.Length > 1)
                    return trySplit[1];
            }
            if (headers != null && headers.TryGetValue("Server", out var ServerHdr) &&
                ServerHdr.StartsWith("BunnyCDN-", StringComparison.OrdinalIgnoreCase))
            {
                var trySplit = ServerHdr.Split('-');
                if (trySplit.Length > 1)
                    return trySplit[1];
            }
            return null;
        }


        private async Task<Result<SerializableHttpResponse>> SendRequestWarmup(Location location, UploadJobGeneric job,
            CancellationToken token)
        {
            // just send to no path/root to warm up conn
            var resolvedUrl = new UriBuilder(job.Endpoint)
            {
                Scheme = Uri.UriSchemeHttps,
                Port = -1
            };

            resolvedUrl.Path = "/";
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}" },
                    { "Worker", location.DisplayName ?? location.Name },
                },
                URL = resolvedUrl.ToString(),
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
                ReturnBody = false,
                ReturnBodyOnError = true
            };
            newRequest.SetDefaultsFromLocation(location);
            if (job.ForceNetType.HasValue)
                newRequest.NetType = job.ForceNetType.Value;
            return await _queue.HTTP(newRequest, location, token);
        }



        public virtual async Task<Result<SerializableHttpResponse>> BaseRunLocation(Location location,
            CancellationToken token, UploadJobGeneric job)
        {

            var randomBytes = GenerateRandomBytes(10_000);

            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}" },
                    { "Worker", location.DisplayName ?? location.Name },
                },
                URL = job.Endpoint + "/" + $"action-delay-api-uploadtest-{location.NATSName ?? location.Name}",
                TimeoutMs = 30_000,
                EnableConnectionReuse = true,
                Method = MethodType.PUT,
                ReturnBody = false,
                RetriesCount = 0,
                ReturnBodyOnError = true,
                Base64Body = System.Convert.ToBase64String(randomBytes),
            };
            foreach (var customHeaderKvp in job.CustomHeaders)
            {
                newRequest.Headers[customHeaderKvp.Key] = customHeaderKvp.Value;
            }
            newRequest.SetDefaultsFromLocation(location);
            if (job.ForceNetType.HasValue)
                newRequest.NetType = job.ForceNetType.Value;

            var tryPut = await _queue.HTTP(newRequest, location, token);

            if (job is { CheckUploadedContentHash: true } && tryPut is { IsSuccess: true, ValueOrDefault.WasSuccess: true })
            {
                try
                {
                    var getBytesSha256 = Convert.ToHexString(SHA256.HashData(randomBytes));
                    // if this worked, let's pull it back and look at what we get back!
                    newRequest.Method = MethodType.GET;
                    newRequest.ReturnBodySha256 = true;
                    newRequest.ReturnBodyOnError = false;
                    var tryGet = await _queue.HTTP(newRequest, location, token);
                    if (tryGet.ValueOrDefault != null && tryGet is { IsSuccess: true, ValueOrDefault.WasSuccess: true } && tryGet.Value.BodySha256 != null)
                    {
                        if (tryGet.ValueOrDefault!.BodySha256!.Equals(getBytesSha256, StringComparison.OrdinalIgnoreCase) == false)
                        {
                            tryPut.Value.WasSuccess = false;
                            tryPut.Value.StatusCode = HttpStatusCode.PreconditionFailed;
                            tryPut.Value.Body =
                                $"Uploaded Content Hash was different then retrieved.";
                            var tryGetHeader = tryGet.ValueOrDefault.Headers.FirstOrDefault(headerkvp =>
                                headerkvp.Key.Equals("content-length", StringComparison.OrdinalIgnoreCase));
                            if (String.IsNullOrEmpty(tryGetHeader.Key) == false &&
                                int.TryParse(tryGetHeader.Value, out var parsedContentLength) &&
                                parsedContentLength != randomBytes.Length)
                                tryPut.Value.Body += $" Content Length Different then expected: {parsedContentLength}";
                            return tryPut;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error pulling back upload info");
                    SentrySdk.CaptureException(ex);
                }

            }

            return tryPut;
        }

        public static byte[] GenerateRandomBytes(int sizeInBytes)
        {
            byte[] randomBytes = new byte[sizeInBytes];
            Random.Shared.NextBytes(randomBytes);
            return randomBytes;
        }

        public override Task RunAction()
        {
            throw new NotImplementedException();
        }
    }



    public class UploadPerformanceLocationReturn
    {
        public UploadPerformanceLocationReturn(bool success, ulong duration, DateTime responseUtc, string? locationId)
        {
            Success = success;
            Duration = duration;
            ResponseUtc = responseUtc;
            LocationId = locationId;
        }

        public bool Success { get; set; }

        public ulong Duration { get; set; }

        public DateTime ResponseUtc { get; set; }

        public string? LocationId { get; set; }

    }
}