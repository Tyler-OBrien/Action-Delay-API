﻿using Action_Delay_API_Core.Broker;
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

namespace Action_Delay_API_Core.Jobs.Performance
{
    public class GenericDownloadBaseJob : BaseJob
    {


        public GenericDownloadBaseJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<GenericDownloadBaseJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue) : base(apiBroker, config, logger, clickhouseService, context, queue)
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

            var getDownloadTasks = _config.PerfConfig!.BasicDownloadJobList;

            List<Task> runningJobs = new List<Task>();
            foreach (var downloadTask in getDownloadTasks)
            {

                runningJobs.Add(RunSpecificJob(downloadTask));
            }
            runningJobs.Add(Task.Delay(5000));
            await Task.WhenAll(runningJobs);
            try
            {
                if (Runs.Any())
                {
                    await _clickHouseService.InsertRunPerf(Runs.ToList(), Locations.ToList(), Errors.ToList());
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
            var locstoUse = _config.Locations.Where(location => location.Disabled == false).ToList();
            try
            {
                Dictionary<Location, Task> preInitWarmTasks = new();
                foreach (var location in locstoUse)
                {
                    preInitWarmTasks.Add(location, SendRequestWarmup(location, downloadJobConfig, resolvedDnsNameserverIP, CancellationToken.None));
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
                            $"{name}: Failure warming location: {preInitTask.Key.DisplayName ?? preInitTask.Key.Name}, removing from list..");
                        locstoUse.Remove(preInitTask.Key);
                    }
                }
                _logger.LogInformation($"Finished Pre-Warm: {preInitWarmTasks.Count(task => task.Value.IsCompletedSuccessfully)} Locations Completely Successfully. Failed Locations: {string.Join(", ", preInitWarmTasks.Where(task => task.Value.IsFaulted).Select(task => task.Key.DisplayName ?? task.Key.Name))}");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    $"Failure running PreWarmAction for {name}");
            }

            var runningLocations = new Dictionary<Location, Task<Result<SerializableHttpResponse>>>();

            var finishedLocationStatus = new Dictionary<Location, PerformanceLocationReturn>();

            List<CustomAPIErrorPerf>? errors = new List<CustomAPIErrorPerf>();

            var locations = locstoUse;

            // Start monitoring on each Location
            foreach (var location in locations)
            {
                var task = BaseRunLocation(location, downloadJobConfig, resolvedDnsNameserverIP, cancellationTokenSource.Token);
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
                                new PerformanceLocationReturn(false, 0, DateTime.UtcNow, null));
                            continue;
                        }

                        var tryGetValue = taskResult.Value!;


                        if (tryGetValue.WasSuccess)
                        {
                            finishedLocationStatus.Add(completedLocation,
                                new PerformanceLocationReturn(tryGetValue.WasSuccess,
                                    (ulong)(tryGetValue.ResponseTimeMs.HasValue == false ? 0 : tryGetValue.ResponseTimeMs.Value) ,
                                    tryGetValue.ResponseUTC ?? DateTime.UtcNow,
                                    GetColoId(tryGetValue.Headers)));

                        }
                        else if (tryGetValue.WasSuccess == false)
                        {
                            _logger.LogInformation($"Non-Success for {name}, location: {completedLocation.DisplayName ?? completedLocation.Name}, status: {tryGetValue.StatusCode} and error looks like: {tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(50)}");
                            if (tryGetValue.ProxyFailure == false)
                            {
                                var newError = new CustomAPIErrorPerf(
                                    tryGetValue.Body?.IntelligentCloudflareErrorsS3FriendlyTruncate(100) ??
                                    string.Empty,
                                    (int)(tryGetValue.StatusCode),
                                    tryGetValue.Body?.IntelligentCloudflareErrorsFriendlyTruncate(100) ?? string.Empty,
                                    tryGetValue.StatusCode.ToString(), tryGetValue.ResponseTimeMs,
                                    GetColoId(tryGetValue.Headers));
                                newError.LocationName = completedLocation.Name;
                                errors.Add(newError);
                            }

                            finishedLocationStatus.Add(completedLocation,
                                new PerformanceLocationReturn(tryGetValue.WasSuccess,
                                    (ulong)(tryGetValue?.ResponseTimeMs.HasValue == false ? 0 : tryGetValue!.ResponseTimeMs!.Value),
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
                SentrySdk.CaptureException(ex);
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

                _logger.LogInformation($"Finished {name}, runStatus: {runStatus}, average ms: {averageOfSuccessFull}, successful: {finishedLocationStatus.Count(kvp => kvp.Value.Success)}/{locations.Count}");
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
            // just send to no path/root to warm up conn
            var resolvedUrl = new UriBuilder(jobConfig.Endpoint)
            {
                Scheme = Uri.UriSchemeHttps,
                Port = -1
            };

            resolvedUrl.Path = "/";
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                    { "Worker", location.DisplayName ?? location.Name },
                    { "APIKEY", _config.PerfConfig.Secret}
                },
                URL = resolvedUrl.ToString(),
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
                ReturnBody = false,
                ReturnBodyOnError = true,
                CustomDNSServerOverride = overridenCustomNameServerResolved,
                DNSResolveOverride = jobConfig.DNSResolveOverride
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
                    { "Worker", location.DisplayName ?? location.Name },
                    { "APIKEY", _config.PerfConfig.Secret}
                },
                URL = jobConfig.Endpoint,
                TimeoutMs = 30_000,
                EnableConnectionReuse = true,
                ReturnBody = false,
                RetriesCount = 0,
                ReturnBodyOnError = true,
                CustomDNSServerOverride = overridenCustomNameServerResolved,
                DNSResolveOverride = jobConfig.DNSResolveOverride
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
        public PerformanceLocationReturn(bool success, ulong duration, DateTime responseUtc, string? locationId)
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