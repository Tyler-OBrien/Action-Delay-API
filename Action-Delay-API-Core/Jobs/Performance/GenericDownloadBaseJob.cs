using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.NATS.Requests;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text.Json.Serialization;
using Action_Delay_API.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Jobs.Performance
{
    public class GenericDownloadBaseJob : BaseJob
    {


        public GenericDownloadBaseJob(IOptions<LocalConfig> config, ILogger<GenericDownloadBaseJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue) : base(config, logger, clickhouseService, context, queue)
        {
        }




        public override string Name => "PerfBaseDownloadJob";
        public override string InternalName => "PerfBaseDownloadJob";

        public override string JobType => "Perf";

        public override string JobDescription => "Generic Perf Job";
        public override int TargetExecutionSecond => 50;
        public override bool Enabled => _config.PerfConfig != null && (_config.PerfConfig.Enabled.HasValue == false || _config.PerfConfig is { Enabled: true });

        public override async Task BaseRun()
        {
            using var scope = _logger.BeginScope(Name);
            using var sentryScope = SentrySdk.PushScope();
            SentrySdk.AddBreadcrumb($"Starting Job {Name}");

            _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
            var prefetchJobData = await _dbContext.JobData.AsTracking().Where(job => job.JobType == JobType).ToListAsync();
            var listOfJobNames = new List<string>(prefetchJobData.Select(job => job.InternalJobName));
            var prefetchJobLocsData = await _dbContext.JobLocations.AsTracking().Where(job => listOfJobNames.Contains(job.InternalJobName)).ToListAsync();

            var getDownloadTasks = _config.PerfConfig!.BasicDownloadJobList;

            var jobDetails = new List<(DownloadJobGeneric downloadTask, int totalLocationRequests)>();
            int totalLocationsAcrossAllJobs = 0;

            List<Task> runningJobs = new List<Task>();
            foreach (var downloadTask in getDownloadTasks)
            {
                var allowedLocsHashset = new HashSet<string>(downloadTask.AllowedEdgeLocations ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
                var locationsToUse = _config.Locations.Count(location => location.Disabled == false &&
                                                                         (allowedLocsHashset.Any() == false || allowedLocsHashset.Contains(location.Name)));
                var totalLocationRequests = locationsToUse * (downloadTask.CountOfRequests ?? 1);


                jobDetails.Add((downloadTask, totalLocationRequests));
                totalLocationsAcrossAllJobs += totalLocationRequests;
                //runningJobs.Add(RunSpecificJob(downloadTask));
            }

            double delayPerLocationMs = totalLocationsAcrossAllJobs > 0 ? (15_000.0 / totalLocationsAcrossAllJobs) : 0;
            int cumulativeLocations = 0;

            foreach (var (downloadTask, totalLocationRequests) in jobDetails)
            {
                int delayMs = (int)(cumulativeLocations * delayPerLocationMs);

                if (delayMs > 0)
                {
                    runningJobs.Add(Task.Delay(delayMs).ContinueWith(_ => RunSpecificJob(downloadTask)).Unwrap());
                }
                else
                {
                    runningJobs.Add(RunSpecificJob(downloadTask));
                }

                cumulativeLocations += totalLocationRequests;
            }


            runningJobs.Add(Task.Delay(5000));
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
                                    JobDescription = "Download Test"
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
                                tryGetJob.JobDescription = tryGetDownloadTasks.Description ?? "Upload Test";

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
            await Task.Delay(TimeSpan.FromMinutes(1.5));
        }


        public async Task RunSpecificJob(DownloadJobGeneric downloadJobConfig)
        {
            var allowedLocsHashset = new HashSet<string>(downloadJobConfig.AllowedEdgeLocations ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
            var locationsToUse = _config.Locations.Where(location =>
                location.Disabled == false && (allowedLocsHashset.Any() == false || allowedLocsHashset.Contains(location.Name) ) ).ToList();

            var name = downloadJobConfig.Name;
            var url = downloadJobConfig.Endpoint;
            string? resolvedDnsNameserverIP = null;

            try
            {
                if (String.IsNullOrWhiteSpace(downloadJobConfig.CustomDNSNameserver) == false)
                {
                    if (IPAddress.TryParse(downloadJobConfig.CustomDNSNameserver, out var parsedIpAddress))
                    {
                        resolvedDnsNameserverIP = parsedIpAddress.ToString();
                    }
                    else
                    {
                        // hacky for now, just grab first v4
                        var getIps = await Dns.GetHostEntryAsync(downloadJobConfig.CustomDNSNameserver);
                        resolvedDnsNameserverIP =
                            getIps.AddressList.FirstOrDefault(ip => ip.AddressFamily == AddressFamily.InterNetwork)?.ToString() ?? null;
                    }
                }
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
            }

            var cancellationTokenSource = new CancellationTokenSource();
            if (downloadJobConfig.DisablePrewarmup == false)
            {
                try
                {
                    Dictionary<Location, Task> preInitWarmTasks = new();
                    foreach (var location in locationsToUse)
                    {
                        preInitWarmTasks.Add(location,
                            SendRequestWarmup(location, downloadJobConfig, resolvedDnsNameserverIP,
                                CancellationToken.None));
                    }

                    foreach (var preInitTask in preInitWarmTasks)
                    {
                        try
                        {
                            await preInitTask.Value.WaitAsync(TimeSpan.FromMinutes(2), cancellationTokenSource.Token); ;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogCritical(ex,
                                $"{name}: Failure warming location: {preInitTask.Key.DisplayName ?? preInitTask.Key.Name}, removing from list..");
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
            }

            var runningLocations = new Dictionary<(Location location, int num), Task<Result<SerializableHttpResponse>>>();

            var finishedLocationStatus = new List<PerformanceLocationReturn>();

            List<CustomAPIErrorPerf>? errors = new List<CustomAPIErrorPerf>();

            var locations = locationsToUse;

            var requestCount = downloadJobConfig.CountOfRequests ?? 1;

            var runCounts = locations.Count * requestCount;

            // Start monitoring on each Location
            if (requestCount == 1)
            {
                foreach (var location in locations)
                {

                    for (int i = 0; i < (downloadJobConfig.CountOfRequests ?? 1); i++)
                    {
                        var task = BaseRunLocation(location, downloadJobConfig, resolvedDnsNameserverIP,
                            cancellationTokenSource.Token);
                        runningLocations[(location, i)] = task;
                    }
                }
            }
            else
            {
                // Stagger multiple requests over 10 seconds in batches
                var delayBetweenBatches = TimeSpan.FromSeconds(10.0 / requestCount);

                for (int i = 0; i < requestCount; i++)
                {
                    foreach (var location in locations)
                    {
                        var task = BaseRunLocation(location, downloadJobConfig, resolvedDnsNameserverIP, cancellationTokenSource.Token);
                        runningLocations[(location, i)] = task;
                    }

                    // Wait before starting next batch (except for the last batch)
                    if (i < requestCount - 1)
                    {
                        await Task.Delay(delayBetweenBatches, cancellationTokenSource.Token);
                    }
                }
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
                        var completedKvp = runningLocations.First(x => x.Value == completedTask).Key;
                        var completedLocation = completedKvp.location;
                        Result<SerializableHttpResponse>? taskResult = null;
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
                        runningLocations.Remove(completedKvp);


                        if (taskResult == null || (taskResult?.IsFailed ?? true) || taskResult.ValueOrDefault == null)
                        {
                            finishedLocationStatus.Add(
                                new PerformanceLocationReturn(completedLocation, false, 0, DateTime.UtcNow, null, null));
                            continue;
                        }

                        var tryGetValue = taskResult.Value!;


                        if (tryGetValue.WasSuccess)
                        {
                            finishedLocationStatus.Add(
                                new PerformanceLocationReturn(completedLocation, tryGetValue.WasSuccess,
                                    (uint)(tryGetValue.ResponseTimeMs.HasValue == false ? 0 : tryGetValue.ResponseTimeMs.Value) ,
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers), TryGetBindingDir(tryGetValue.Headers)));

                        }
                        else if (tryGetValue.WasSuccess == false)
                        {
                            _logger.LogInformation($"Non-Success for {name}, location: {completedLocation.DisplayName ?? completedLocation.Name}, status: {tryGetValue.StatusCode} and error looks like: {tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(50)}");
                            if (tryGetValue.ProxyFailure == false)
                            {
                                var newError = new CustomAPIErrorPerf(
                                    tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(255) ??
                                    string.Empty,
                                    (int)(tryGetValue.StatusCode),
                                    tryGetValue.Body?.IntelligentCloudflareErrorsFriendlyTruncate(255) ?? string.Empty,
                                    tryGetValue.StatusCode.ToString(), tryGetValue.ResponseTimeMs,
                                    GetColoId(tryGetValue.Headers));
                                newError.LocationName = completedLocation.Name;
                                errors.Add(newError);
                            }

                            finishedLocationStatus.Add(
                                new PerformanceLocationReturn(completedLocation, tryGetValue.WasSuccess,
                                    (uint)(tryGetValue?.ResponseTimeMs.HasValue == false ? 0 : tryGetValue!.ResponseTimeMs!.Value),
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers), TryGetBindingDir(tryGetValue.Headers)));
                        }



                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation(
                            $"{name} had {runCounts} runs, namely: {string.Join(", ", runningLocations.Select(loc => loc.Key.location.DisplayName ?? loc.Key.location.Name))} timed out.");
                        /* NOM NOM */
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error handling location runs for job {name}, aborting... Locations not finished yet: {locations}",
                    name, string.Join(", ", runningLocations.Select(loc => loc.Key.location.DisplayName ?? loc.Key.location.Name)));
                SentrySdk.CaptureException(ex);
            }

            SentrySdk.AddBreadcrumb($"Finished Locations for {name}");



            try
            {
                uint averageBindingLatencyOfSuccessful = 0;
                uint averageOfSuccessFull = 0;
                if (finishedLocationStatus.Any(kvp => kvp.Success))
                {
                    var tryGetSuccessful = finishedLocationStatus.Where(kvp => kvp.Success)
                        .Select(kvp => (double)kvp.Duration).ToList();
                    if (tryGetSuccessful.Any()) averageOfSuccessFull = (uint)tryGetSuccessful.Median();

                    var tryGetBindingLatenciesToUse = finishedLocationStatus.Where(kvp => kvp.Success)
                        .Where(kvp => kvp.BindingDuration != null)
                        .Select(kvp => (double)kvp.BindingDuration!.Value).ToList();
                    if (tryGetBindingLatenciesToUse.Any())
                        averageBindingLatencyOfSuccessful = (uint)tryGetBindingLatenciesToUse
                            .Median();

                }

                var runStatus = (finishedLocationStatus.All(kvp => kvp.Success) ||
                                 (finishedLocationStatus.Count(kvp => kvp.Success) >=
                                  (runCounts / 2)))
                    ? "Success"
                    : "Failure";

                if (finishedLocationStatus.Any() == false)
                    runStatus = "Failure";

                _logger.LogInformation($"Finished {name}, runStatus: {runStatus}, average ms: {averageOfSuccessFull}, binding avg: {averageBindingLatencyOfSuccessful}, successful: {finishedLocationStatus.Count(kvp => kvp.Success)}/{runCounts}");
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
                            RunStatus = locationDataKv.Success ? "Success" : "Failure",
                            LocationName = locationDataKv.Location.Name,
                            RunLength = 0,
                            RunTime = locationDataKv.ResponseUtc,
                            ResponseLatency = locationDataKv.Duration,
                            LocationId = locationDataKv.LocationId ?? string.Empty,
                            BindingResponseLatency = locationDataKv.BindingDuration ?? 0,
                        }).ToArray(),
                    errors?.Any() == false
                        ? Array.Empty<ClickhouseAPIErrorPerf>()
                        : (errors?.Select(error => ClickhouseAPIErrorPerf.CreateFromCustomError(name, error)).ToArray() ??
                           Array.Empty<ClickhouseAPIErrorPerf>()));
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

        public void FinishedRunInsertLater(ClickhouseJobRunPerf run, ClickhouseJobLocationRunPerf[]? locations,
            ClickhouseAPIErrorPerf[] apiError = null)
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

        private async Task<Result<SerializableHttpResponse>> SendRequestWarmup(Location location, DownloadJobGeneric jobConfig, string? overridenCustomNameServerResolved, CancellationToken token)
        {

            string prewarmUrl = jobConfig.PrewarmEndpoint;

            if (string.IsNullOrEmpty(prewarmUrl))
            {
                // just send to no path/root to warm up conn
                var resolvedUrl = new UriBuilder(jobConfig.Endpoint)
                {
                    Scheme = Uri.UriSchemeHttps,
                    Port = -1
                };

                resolvedUrl.Path = "/";
                prewarmUrl = resolvedUrl.ToString();
            }
            else
            {
                prewarmUrl = prewarmUrl.ProcessEndpoint(location);
            }

            var newRequest = new NATSHttpRequest()
                {
                    Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                    { "APIKEY", _config.PerfConfig.Secret}
                },
                    URL = prewarmUrl,
                    TimeoutMs = 15_000,
                    EnableConnectionReuse = !jobConfig.NoConnectionKeepAlive,
                    ReturnBody = false,
                    ReturnBodyOnError = false,
                    CustomDNSServerOverride = overridenCustomNameServerResolved,
                    DNSResolveOverride = jobConfig.DNSResolveOverride,
                    RetriesCount = 0,
                    ResponseHeaders = new List<string>()
                {
                    "colo",
                    "server",
                    "x-adp-dur"
                }
                };
            if (jobConfig.CustomHeaders != null)
            {
                foreach (var jobConfigCustomHeader in jobConfig.CustomHeaders)
                {
                    newRequest.Headers[jobConfigCustomHeader.Key] = jobConfigCustomHeader.Value;
                }
            }

            if (jobConfig.EdgeLocationCustomDNSNameserverOverride != null)
            {
                if (jobConfig.EdgeLocationCustomDNSNameserverOverride.TryGetValue(location.Name, out var overrideDns))
                {
                    newRequest.CustomDNSServerOverride = overrideDns;
                }
            }

            newRequest.SetDefaultsFromLocation(location);

            if (jobConfig.ForceNetType.HasValue)
                newRequest.NetType = jobConfig.ForceNetType.Value;
            return await _queue.HTTP(newRequest, location, token);
        }

  

        public virtual async Task<Result<SerializableHttpResponse>> BaseRunLocation(Location location, DownloadJobGeneric jobConfig, string? overridenCustomNameServerResolved, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                    { "APIKEY", _config.PerfConfig.Secret}
                },
                URL = jobConfig.Endpoint.ProcessEndpoint(location),
                TimeoutMs = 30_000,
                EnableConnectionReuse = !jobConfig.NoConnectionKeepAlive,
                ReturnBody = false,
                RetriesCount = 0,
                ReturnBodyOnError = true,
                CustomDNSServerOverride = overridenCustomNameServerResolved,
                DNSResolveOverride = jobConfig.DNSResolveOverride,
                NoResponseHeaders = true,
                ResponseHeaders = new List<string>()
                {
                    "colo",
                    "server",
                    "x-adp-dur"
                }
            };
            if (jobConfig.CustomHeaders != null)
            {
                foreach (var jobConfigCustomHeader in jobConfig.CustomHeaders)
                {
                    newRequest.Headers[jobConfigCustomHeader.Key] = jobConfigCustomHeader.Value;
                }
            }
            if (jobConfig.EdgeLocationCustomDNSNameserverOverride != null)
            {
                if (jobConfig.EdgeLocationCustomDNSNameserverOverride.TryGetValue(location.Name, out var overrideDns))
                {
                    newRequest.CustomDNSServerOverride = overrideDns;
                }
            }
            newRequest.SetDefaultsFromLocation(location);
            if (jobConfig.ForceNetType.HasValue)
                newRequest.NetType = jobConfig.ForceNetType.Value;

            return await _queue.HTTP(newRequest, location, token);
        }

        public override Task RunAction()
        {
            throw new NotImplementedException();
        }
    }
    public class PerformanceLocationReturn
    {
        public PerformanceLocationReturn(Location location, bool success, uint duration, DateTime responseUtc, string? locationId, uint? bindingDuration)
        {
            Location = location;
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


        [JsonIgnore]
        public Location Location { get; set; }
        

    }

}
