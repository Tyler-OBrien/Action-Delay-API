using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Helpers;
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
using System.Collections.Concurrent;
using System.Net;
using System.Security.Cryptography;

namespace Action_Delay_API_Core.Jobs.Performance
{
    public class GenericDownloadS3BaseJob : BaseJob
    {

        public GenericDownloadS3BaseJob(IOptions<LocalConfig> config,
            ILogger<GenericDownloadS3BaseJob> logger, IClickHouseService clickhouseService,
            ActionDelayDatabaseContext context, IQueue queue) : base(config, logger, clickhouseService,
            context, queue)
        {
        }




        public override string Name => "PerfBaseDownloadS3Job";
        public override string InternalName => "PerfBaseDownloadS3Job";

        public override string JobType => "Perf";

        public override string JobDescription => "Generic Perf Job";
        public override int TargetExecutionSecond => 20;

        public override bool Enabled => _config.PerfConfig != null &&
                                        (_config.PerfConfig.Enabled.HasValue == false || _config.PerfConfig is
                                        { Enabled: true });


        public override async Task BaseRun()
        {
            using var scope = _logger.BeginScope(Name);
            using var sentryScope = SentrySdk.PushScope();
            SentrySdk.AddBreadcrumb($"Starting Job {Name}");

            _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
            var prefetchJobData = await _dbContext.JobData.AsTracking().Where(job => job.JobType == JobType).ToListAsync();
            var listOfJobNames = new List<string>(prefetchJobData.Select(job => job.InternalJobName));
            // prewarm
            _ = await _dbContext.JobLocations.AsTracking().Where(job => listOfJobNames.Contains(job.InternalJobName)).ToListAsync();

            var getDownloadTasks = _config.PerfConfig!.S3DownloadJobs;

            List<Task> runningJobs = new List<Task>();
            foreach (var uploadTask in getDownloadTasks)
            {

                runningJobs.Add(RunSpecificJob(uploadTask));
            }

            runningJobs.Add(Task.Delay(1000));
            await Task.WhenAll(runningJobs);
            try
            {
                if (Runs.Any())
                {
                    try
                    {
                        foreach (var run in Runs)
                        {
                            var tryGetJob = await _dbContext.JobData.AsTracking()
                                .FirstOrDefaultAsync(job => job.InternalJobName == run.JobName);
                            if (tryGetJob == null)
                            {
                                var newJobData = tryGetJob = new JobData()
                                {
                                    JobName = run.JobName,
                                    InternalJobName = run.JobName,
                                    JobType = "Perf",
                                    JobDescription = "S3 Download Test"
                                };
                                _dbContext.JobData.Add(newJobData);
                            }
                            else
                            {
                                tryGetJob.LastRunStatus = tryGetJob.CurrentRunStatus;
                                tryGetJob.LastRunLengthMs = tryGetJob.CurrentRunLengthMs;
                                tryGetJob.LastRunTime = tryGetJob.CurrentRunTime;
                            }

                            var tryGetDownloadTasks =
                                getDownloadTasks.FirstOrDefault(download => download.Name == run.JobName);
                            if (tryGetDownloadTasks != null)
                                tryGetJob.JobDescription = tryGetDownloadTasks.Description ?? "S3 Download Test";

                            tryGetJob.CurrentRunTime = run.RunTime;
                            tryGetJob.CurrentRunLengthMs =
                                run.ResponseLatency; // for Perf jobs, Latency = Latency
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
                                location.ResponseLatency; // for Perf jobs, Latency = Latency
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
                    await _clickHouseService.InsertRunPerf(Runs.ToList(), Locations.ToList(), errorList);
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
        }


        public async Task RunSpecificJob(DownloadS3Job s3Job)
        {
            var allowedLocsHashset = new HashSet<string>(s3Job.AllowedEdgeLocations, StringComparer.OrdinalIgnoreCase);
            var locationsToUse = _config.Locations.Where(location =>
                location.Disabled == false && allowedLocsHashset.Contains(location.Name)).ToList();
            var name = s3Job.Name;
            var cancellationTokenSource = new CancellationTokenSource();
            try
            {
                Dictionary<Location, Task> preInitWarmTasks = new();
                foreach (var location in locationsToUse)
                {
                    preInitWarmTasks.Add(location, SendRequestWarmup(location, $"https://{s3Job.Endpoint}", s3Job, CancellationToken.None));
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
                            $"{name}: Failure warming location: {preInitTask.Key.DisplayName ?? preInitTask.Key.Name}, removing from this run");
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

            var finishedLocationStatus = new Dictionary<Location, DownloadS3PerformanceLocationReturn>();

            List<CustomAPIErrorPerf>? errors = new List<CustomAPIErrorPerf>();

            var locations = locationsToUse;

            var newClient = new S3PresignedUrlGenerator(s3Job.AccessKey, s3Job.SecretKey,
                String.IsNullOrEmpty(s3Job.Region) ? "auto" : s3Job.Region, s3Job.Endpoint);


            // Start monitoring on each Location
            foreach (var location in locations)
            {
                string objectName = s3Job.ObjectName ?? "10Kb";
                string getUrl = newClient.GenerateDownloadUrl(s3Job.BucketName, objectName, TimeSpan.FromSeconds(900));


                var task = BaseRunLocation(newClient, location, objectName, getUrl, s3Job, cancellationTokenSource.Token);
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
                        Result<SerializableHttpResponse> taskResult = null;
                        try
                        {
                            taskResult = await completedTask.WaitAsync(TimeSpan.FromMinutes(2), cancellationTokenSource.Token);
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
                                new DownloadS3PerformanceLocationReturn(false, 0, DateTime.UtcNow, null, null));
                            continue;
                        }

                        var tryGetValue = taskResult.Value!;


                        if (tryGetValue.WasSuccess)
                        {
                            finishedLocationStatus.Add(completedLocation,
                                new DownloadS3PerformanceLocationReturn(tryGetValue.WasSuccess,
                                    (uint)tryGetValue.ResponseTimeMs.Value,
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers), TryGetBindingDir(tryGetValue.Headers)));

                        }
                        else if (tryGetValue.WasSuccess == false)
                        {
                            _logger.LogInformation(
                                $"Non-Success for {name}, location: {completedLocation.DisplayName ?? completedLocation.Name}, status: {tryGetValue.StatusCode} and error looks like: {tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(75)}, info: {tryGetValue.Info}");
                            if (tryGetValue.ProxyFailure == false)
                            {
                                var newError = new CustomAPIErrorPerf(
                                    tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(255),
                                    (int)(tryGetValue.StatusCode),
                                    tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(255),
                                    tryGetValue.StatusCode.ToString(), tryGetValue.ResponseTimeMs,
                                    GetColoId(tryGetValue.Headers));
                                newError.LocationName = completedLocation.Name;
                                errors.Add(newError);
                            }

                            finishedLocationStatus.Add(completedLocation,
                                new DownloadS3PerformanceLocationReturn(tryGetValue.WasSuccess,
                                    (uint)(tryGetValue?.ResponseTimeMs.HasValue == false
                                        ? 0
                                        : tryGetValue!.ResponseTimeMs!.Value),
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers), TryGetBindingDir(tryGetValue.Headers)));
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
                SentrySdk.CaptureException(ex);
            }

            SentrySdk.AddBreadcrumb($"Finished Locations for {name}");



            try
            {
                uint averageBindingLatencyOfSuccessful = 0;
                uint averageOfSuccessFull = 0;
                if (finishedLocationStatus.Any(kvp => kvp.Value.Success))
                {
                    var tryGetSuccessful = finishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Select(kvp => (double)kvp.Value.Duration).ToList();
                    if (tryGetSuccessful.Any()) averageOfSuccessFull = (uint)tryGetSuccessful.Median();

                    var tryGetBindingLatenciesToUse = finishedLocationStatus.Where(kvp => kvp.Value.Success)
                        .Where(kvp => kvp.Value.BindingDuration != null)
                        .Select(kvp => (double)kvp.Value.BindingDuration!.Value).ToList();
                    if (tryGetBindingLatenciesToUse.Any())
                        averageBindingLatencyOfSuccessful = (uint)tryGetBindingLatenciesToUse
                            .Median();
                }

                var runStatus = (finishedLocationStatus.All(kvp => kvp.Value.Success) ||
                                 (finishedLocationStatus.Count(kvp => kvp.Value.Success) >=
                                  (locations.Count() / 2)))
                    ? "Success"
                    : "Failure";

                if (finishedLocationStatus.Any() == false)
                    runStatus = "Failure";

                _logger.LogInformation($"Finished {name}, runStatus: {runStatus}, average ms: {averageOfSuccessFull},  avg binding dir {averageBindingLatencyOfSuccessful}");
                FinishedRunInsertLater(
                    new ClickhouseJobRunPerf()
                    {
                        JobName = name,
                        RunStatus = runStatus,
                        RunLength = 0,
                        RunTime = DateTime.UtcNow,
                        ResponseLatency = averageOfSuccessFull,
                        BindingResponseLatency = averageBindingLatencyOfSuccessful
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
                            BindingResponseLatency = locationDataKv.Value.BindingDuration ?? 0,
                        }).ToList(),
                    errors?.Any() == false
                        ? new List<ClickhouseAPIErrorPerf>()
                        : errors?.Select(error => ClickhouseAPIErrorPerf.CreateFromCustomError(name, error)).ToList() ??
                          null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inserting run statistics into Clickhouse");
                SentrySdk.CaptureException(ex);
            }
        }


        public ConcurrentBag<ClickhouseJobRunPerf> Runs = new ConcurrentBag<ClickhouseJobRunPerf>();
        public ConcurrentBag<ClickhouseJobLocationRunPerf> Locations = new ConcurrentBag<ClickhouseJobLocationRunPerf>();
        public ConcurrentBag<ClickhouseAPIErrorPerf> Errors = new ConcurrentBag<ClickhouseAPIErrorPerf>();

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


        public static uint? TryGetBindingDir(Dictionary<string, string> headers)
        {
            if (headers != null)
            {
                var tryGetHeader = headers.FirstOrDefault(headerKvp =>
                    headerKvp.Key.Equals("x-adp-dur", StringComparison.OrdinalIgnoreCase));
                if (String.IsNullOrWhiteSpace(tryGetHeader.Value) == false &&
                    uint.TryParse(tryGetHeader.Value, out var parsedDur))
                    return parsedDur;
            }

            return null;
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

        private async Task<Result<SerializableHttpResponse>> SendRequestWarmup(Location location, string url, DownloadS3Job job,
            CancellationToken token)
        {
            // just send to no path/root to warm up conn
            var resolvedUrl = new UriBuilder(url)
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
                },
                URL = resolvedUrl.ToString(),
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
                ReturnBody = false,
                ReturnBodyOnError = false,
                NoResponseHeaders = true
            };
            newRequest.SetDefaultsFromLocation(location);
            if (job.ForceNetType.HasValue)
                newRequest.NetType = job.ForceNetType.Value;
            return await _queue.HTTP(newRequest, location, token);
        }



        public virtual async Task<Result<SerializableHttpResponse>> BaseRunLocation(S3PresignedUrlGenerator client, Location location,
            string objectName, string getUrl, DownloadS3Job job, CancellationToken token)
        {
            try
            {
                var newRequest = new NATSHttpRequest()
                {
                    Headers = new Dictionary<string, string>()
                    {
                        { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}" },
                    },
                    URL = getUrl,
                    TimeoutMs = 30_000,
                    EnableConnectionReuse = true,
                    Method = MethodType.GET,
                    ReturnBody = false,
                    ReturnBodyOnError = false,
                    RetriesCount = 0,
                    ResponseHeaders = new List<string>()
                    {
                        "content-length",
                        "x-amz-version-id",
                        "colo",
                        "server",
                    },
                };




                newRequest.SetDefaultsFromLocation(location);
                if (job.ForceNetType.HasValue)
                    newRequest.NetType = job.ForceNetType.Value;

                var tryPut = await _queue.HTTP(newRequest, location, token);

                return tryPut;
            }
            catch (OperationCanceledException ex)
            {
                _logger.LogWarning(ex,
                    $"{job.Name} had {location.Name} time out.");
                return Result.Fail($"{job.Name} had {location.Name} time out.");

            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex,
                    $"{job.Name} had {location.Name} error out.");
                return Result.Fail($"{job.Name} had {location.Name} error out.");

            }
        }

        public override Task RunAction()
        {
            throw new NotImplementedException();
        }
    }



    public class DownloadS3PerformanceLocationReturn
    {
        public DownloadS3PerformanceLocationReturn(bool success, uint duration, DateTime responseUtc, string? locationId, uint? bindingDuration)
        {
            Success = success;
            Duration = duration;
            ResponseUtc = responseUtc;
            LocationId = locationId;
            BindingDuration = bindingDuration;
        }

        public bool Success { get; set; }

        public uint Duration { get; set; }

        public DateTime ResponseUtc { get; set; }

        public uint? BindingDuration { get; set; }


        public string? LocationId { get; set; }

    }
}

