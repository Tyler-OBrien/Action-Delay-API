using System.Reflection.Metadata.Ecma335;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Errors;
using Sentry;
using Exception = System.Exception;

namespace Action_Delay_API_Core.Models.Jobs
{

    public class Status
    {
        public const string STATUS_UNDEPLOYED = "Undeployed";
        public const string STATUS_DEPLOYED = "Deployed";
        public const string STATUS_PENDING = "Pending";
        public const string STATUS_ERRORED = "Errored";
        public const string STATUS_API_ERROR = "API_Error";
    }

    public abstract class IBaseJob
    {

        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IClickHouseService _clickHouseService;
        private readonly ActionDelayDatabaseContext _dbContext;
        private readonly IQueue _queue;

        protected Dictionary<Location, Task<bool>> RunningLocations { get; set; } = new Dictionary<Location, Task<bool>>();

        protected Dictionary<Location, bool> FinishedLocationStatus { get; set; } = new Dictionary<Location, bool>();
        protected Dictionary<Location, JobDataLocation> RunningLocationsData { get; set; } = new Dictionary<Location, JobDataLocation>();

        protected IBaseJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<IBaseJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _clickHouseService = clickhouseService;
            _dbContext = context;
            _queue = queue;
        }

        public DateTime ConfirmedUpdateUtc { get; set; }

        public JobData JobData { get; set; }


        public abstract string Name { get; }

        public abstract string InternalName { get; }


        public abstract int TargetExecutionSecond { get; }

        public virtual TimeSpan CancelAfterIfHalfDone => TimeSpan.FromMinutes(15);

        /* Run the Task (DNS or HTTP) Request to get caches warm and such for more consistent results */
        public virtual async Task PreWarmAction()
        {
            try
            {
                Dictionary<Location, Task> preInitWarmTasks = new();
                foreach (var location in _config.Locations.Where(location => location.Disabled == false))
                {
                    preInitWarmTasks.Add(location, PreWarmRunLocation(location));
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
                _logger.LogInformation($"Finished Pre-Warm: {preInitWarmTasks.Count(task => task.Value.IsCompletedSuccessfully)} Locations Completely Successfully. Failed Locations: {String.Join(", ",preInitWarmTasks.Where(task => task.Value.IsFaulted).Select(task => task.Key.DisplayName ?? task.Key.Name))}");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    $"Failure running PreWarmAction for {Name}");
            }
        }

        public abstract Task PreWarmRunLocation(Location location);


        public abstract Task RunAction();
        public abstract Task<RunLocationResult> RunLocation(Location location, CancellationToken token);
        public abstract Task HandleCompletion();

        public virtual Task JobInit() => Task.CompletedTask;
        




        public async Task BaseRun()
        {
            using var scope = _logger.BeginScope(Name);
            using var sentryScope = SentrySdk.PushScope();
            SentrySdk.AddBreadcrumb($"Starting Job {Name}");
            try
            {
                var cancellationTokenSource = new CancellationTokenSource();
                // Pre-init job and locations in database
                _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
                // We always want NonTracking Here because we'll manually push back the changes we make in a semaphore, preventing issues with the ChangeTracker Dict being modified mid-save
                JobData = await _dbContext.JobData.AsNoTracking().FirstOrDefaultAsync(job => job.JobName == Name);
                if (JobData == null)
                {
                    var newJobData = new JobData()
                    {
                        JobName = Name,
                        InternalJobName = InternalName,
                    };
                     _dbContext.JobData.Add(newJobData);
                     await TrySave(true);
                     JobData = await _dbContext.JobData.AsNoTracking().FirstAsync(job => job.JobName == Name);
                }
                else
                {
                    JobData.LastRunStatus = JobData.CurrentRunStatus;
                    JobData.LastRunLengthMs = JobData.CurrentRunLengthMs;
                    JobData.LastRunTime = JobData.CurrentRunTime;
                }

                JobData.CurrentRunStatus = Status.STATUS_PENDING;
                JobData.CurrentRunLengthMs = null;
                JobData.CurrentRunTime = DateTime.UtcNow;
                SentrySdk.AddBreadcrumb($"Got Job Data: {JobData.CurrentRunStatus}");
                foreach (var location in _config.Locations.Where(location => location.Disabled == false))
                {
                    var tryFindLocation = await _dbContext.JobLocations.AsNoTracking().FirstOrDefaultAsync(dbLocation =>
                        dbLocation.JobName == Name && dbLocation.LocationName == location.Name);
                    if (tryFindLocation == null)
                    {
                        var newLocation = new JobDataLocation()
                        {
                            JobName = Name,
                            InternalJobName = InternalName,
                            LocationName = location.Name,
                        };
                       _dbContext.JobLocations.Add(newLocation);
                       await TrySave(true);
                        tryFindLocation = await _dbContext.JobLocations.AsNoTracking().FirstAsync(dbLocation =>
                           dbLocation.JobName == Name && dbLocation.LocationName == location.Name);
                    }
                    else
                    {
                        tryFindLocation.LastRunStatus = tryFindLocation.CurrentRunStatus;
                        tryFindLocation.LastRunLengthMs = tryFindLocation.CurrentRunLengthMs;
                        tryFindLocation.LastRunTime = tryFindLocation.CurrentRunTime;
                    }

                    this.RunningLocationsData[location] = tryFindLocation;
                    tryFindLocation.CurrentRunTime = DateTime.UtcNow;
                }
                SentrySdk.AddBreadcrumb($"Set/Got Location Data");

                await TrySave(true);

                await JobInit();

                // PreWarm
                await PreWarmAction();

                // Execute the action for this Job
                try
                {
                    await RunAction();
                    JobData.CurrentRunStatus = Status.STATUS_UNDEPLOYED;
                }
                catch (CustomAPIError ex)
                {
                    _logger.LogWarning(ex, "Run for {jobName} failed due to API Issues: {err}", this.Name, ex.Message);
                    this.JobData.CurrentRunStatus = Status.STATUS_API_ERROR;
                    await InsertRunFailure(Status.STATUS_API_ERROR, ex);
                    throw;
                }
                catch (Exception)
                {
                    this.JobData.CurrentRunStatus = Status.STATUS_ERRORED;
                    await InsertRunFailure(Status.STATUS_ERRORED, null);
                    throw;
                }
                SentrySdk.AddBreadcrumb($"Ran Action for {Name}");

                ConfirmedUpdateUtc = DateTime.UtcNow;

                // Start monitoring on each Location
                foreach (var location in _config.Locations.Where(location => location.Disabled == false))
                {
                    var task = BaseRunLocation(location, cancellationTokenSource.Token);
                    RunningLocations[location] = task;
                }

                SentrySdk.AddBreadcrumb($"Started Locations for {Name}");

                try
                {
                    // Check the status of tasks continuously
                    while (RunningLocations.Values.Count(task => task != null ) > 0)
                    {
                        try
                        {
                            // Get the task that finishes first

                            var completedTask = await Task.WhenAny(RunningLocations.Values);
                            var completedLocation = RunningLocations.First(x => x.Value == completedTask).Key;
                            bool taskResult = false;
                            try
                            {
                                taskResult = await completedTask;
                            }
                            catch (OperationCanceledException ex)
                            {
                                _logger.LogWarning(ex, 
                                    $"{JobData.JobName} had {completedLocation} time out.");
                                taskResult = false;
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, 
                                    $"{JobData.JobName} had {completedLocation} error out.");
                                taskResult = false;
                            }

                            var endTime = DateTime.UtcNow;
                         

                            // Remove the completed task from the running tasks
                            RunningLocations.Remove(completedLocation);

                            FinishedLocationStatus.Add(completedLocation, taskResult);

                            //  if more then half are done, we just say the entire job is.

                            if (FinishedLocationStatus.Count(kvp => kvp.Value) >=
                                (_config.Locations.Count(location => location.Disabled == false) / 2) ||
                                RunningLocations.Count <= 0)
                            {
                                if (this.JobData.CurrentRunStatus.Equals(Status.STATUS_UNDEPLOYED,
                                        StringComparison.OrdinalIgnoreCase))
                                {
                                    // Success, at least half are success
                                    if (FinishedLocationStatus.Count(kvp => kvp.Value) >=
                                        (_config.Locations.Count(location => location.Disabled == false) / 2))
                                    {
                                        _logger.LogInformation($"Current Run Status: {this.JobData.CurrentRunStatus}");
                                        _logger.LogInformation(
                                            $"{JobData.JobName} is considered done, it has {RunningLocations.Count} running locations: {String.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))}, setting all other locations to cancel in {CancelAfterIfHalfDone.TotalMinutes} Minutes");
                                        cancellationTokenSource.CancelAfter(CancelAfterIfHalfDone);
                                        this.JobData.CurrentRunStatus = Status.STATUS_PENDING;
                                        this.JobData.CurrentRunLengthMs =
                                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;

                                        await TrySave(true);
                                        this.JobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
                                    }
                                    else
                                    {
                                        _logger.LogInformation(
                                            $"FAILURE: {JobData.JobName} is considered failed, it has {RunningLocations.Count} running locations: {String.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))}, setting all other locations to cancel in {CancelAfterIfHalfDone.TotalMinutes} Minutes");
                                        cancellationTokenSource.CancelAfter(CancelAfterIfHalfDone);
                                        this.JobData.CurrentRunLengthMs =
                                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                                        this.JobData.CurrentRunStatus = Status.STATUS_ERRORED;
                                        await TrySave(true);
                                    }
                                }
                            }
                        }
                        catch (OperationCanceledException)
                        {
                            _logger.LogInformation(
                                $"{JobData.JobName} had {RunningLocations.Count} locations, namely: {String.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))} timed out.");
                            /* NOM NOM */
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error handling location runs for job {name}, aborting... Locations not finished yet: {locations}", Name, String.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name)));
                }
                finally
                {
                    await cancellationTokenSource.CancelAsync();
                }
                SentrySdk.AddBreadcrumb($"Finished Locations for {Name}");

                try
                {
                    await HandleCompletion();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error handling Completion for job {name}", Name);
                }

                try
                {
                    await _clickHouseService.InsertRun(
                        new ClickhouseJobRun()
                        {
                            JobName = JobData.JobName, RunStatus = JobData.CurrentRunStatus!,
                            RunLength = JobData.CurrentRunLengthMs!.Value, RunTime = JobData.CurrentRunTime.Value, ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0)
                        }, this.RunningLocationsData.ToList()
                            .Where(locDataKv => locDataKv!.Value!.CurrentRunStatus != null).Select(
                                locationDataKv => new ClickhouseJobLocationRun()
                                {
                                    JobName = locationDataKv.Value.JobName,
                                    RunStatus = locationDataKv.Value.CurrentRunStatus!,
                                    LocationName = locationDataKv.Value.LocationName,
                                    RunLength = locationDataKv.Value.CurrentRunLengthMs!.Value,
                                    RunTime = locationDataKv.Value.CurrentRunTime!.Value!,
                                    ResponseLatency = (uint)(locationDataKv.Value.ResponseTimeUtc ?? 0),
                                    ColoId = locationDataKv.Value.ColoId,
                                }).ToList(), null);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inserting run statistics into Clickhouse");
                }

                try
                {
                    await TrySave(true);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error saving run status");
                }

            }
            finally
            { 
              // await _queue.DisposeAsync();
            }
        }

        public async Task InsertRunFailure(string errorCause, CustomAPIError? customApiError)
        {
            try
            {
                await _clickHouseService.InsertRun(
                    new ClickhouseJobRun()
                    {
                        JobName = JobData.JobName,
                        RunStatus = JobData.CurrentRunStatus ?? errorCause,
                        RunLength = JobData.CurrentRunLengthMs ?? 0,
                        RunTime = JobData.CurrentRunTime ?? DateTime.UtcNow,
                        ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0)
                    }, new List<ClickhouseJobLocationRun>(), ClickhouseAPIError.CreateFromCustomError(this.Name, customApiError));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{jobName}: Error inserting run failure for error cause: {errorCause}", Name,  errorCause);
            }
            try
            {
                await TrySave(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{jobName}: Error saving run status, failure for error cause: {errorCause}", Name, errorCause);
            }
        }

        public async Task<bool> BaseRunLocation(Location location, CancellationToken token)
        {
            try
            {
                DateTime utcStart = DateTime.UtcNow;
                bool ignoreBadTimeSync = false; // sanity check just in case
                // Perform the action to send the request at the Location
                while (true)
                {
                    if (token.IsCancellationRequested) throw new OperationCanceledException();
                    // Send a request and get a response
                    var response = await RunLocation(location, token);
                    if (token.IsCancellationRequested) throw new OperationCanceledException();

                    this.RunningLocationsData[location].ResponseTimeUtc = response.ResponseTimeMs;
                    this.RunningLocationsData[location].ColoId = response.ColoId;


                    if (response.Errored)
                    {
                        this.RunningLocationsData[location].CurrentRunLengthMs = 0;
                        this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                        _ = TrySave();
                        return false;
                    }
                    

                    var endTime = DateTime.UtcNow;

                    if (ignoreBadTimeSync == false && response.ResultUtc != null)
                    {
                        if (response.ResultUtc < utcStart)
                        {
                            _logger.LogError($"Warning: {location.DisplayName ?? location.Name} told us the result of the request performed at {response.ResultUtc}, before the start of the op at {utcStart}. Time Sync Issue. Ignoring time from this location from now on");
                            ignoreBadTimeSync = true;
                        }
                        else if (response.ResultUtc > DateTime.UtcNow)
                        {
                            _logger.LogError($"Warning: {location.DisplayName ?? location.Name} told us the result of the request performed at {response.ResultUtc}, which is after the current time {DateTime.UtcNow}. Time Sync Issue. Ignoring time from this location from now on");
                            ignoreBadTimeSync = true;
                        }
                        else
                        {
                            // Ok to use this..
                            endTime = response.ResultUtc.Value;
                        }
                    }

                    // modifying inmemory jobdata
                    this.RunningLocationsData[location].CurrentRunLengthMs =
                        (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;

                    if (this.JobData.CurrentRunStatus?.Equals(Status.STATUS_UNDEPLOYED, StringComparison.OrdinalIgnoreCase) ?? false)
                    {
                        this.JobData.CurrentRunLengthMs =
                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                        _logger.LogInformation($"{Name} Run Still {this.JobData.CurrentRunStatus}, updating time, new time: {this.JobData.CurrentRunLengthMs}");
                    }

                    if (response.Done == false)
                    {
                        this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_UNDEPLOYED;
                        _ = TrySave();
                        // Use a backoff strategy for the delay between retries
                        var delay = CalculateBackoff((DateTime.UtcNow - utcStart).TotalSeconds);
                        await Task.Delay(delay, token);
                    }
                    else
                    {
                        this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_DEPLOYED;
                        _ = TrySave();
                        return true;
                    }
                }
            }
            catch (OperationCanceledException ex)
            {
                this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                _logger.LogError(ex, $"Location {location.Name} timed out");
                return false;
            }
            catch (Exception ex)
            {
                this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                _logger.LogError(ex, $"Error running location {location.Name}");
                return false;
            }
        }


        private SemaphoreSlim _semaphore = new SemaphoreSlim(1);

        public async Task TrySave(bool force = false)
        {
            bool hasLock = false;

            if (force)
            {
                await _semaphore.WaitAsync();
                hasLock = true;
            }
            else
            {
                // Try to get the Lock without waiting
                hasLock = _semaphore.Wait(0);
            }

            if (hasLock)
            {
                try
                {
                    // Take Changes from Non-Tracked local objects and commit them to tracked versions
                    // This is done to avoid issues where Tracked objects were being modified mid-save.
                    var getTrackedJobData = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.JobName == Name);
                    if (getTrackedJobData != null)
                        getTrackedJobData.Update(JobData);

                    var getjobLocations = await _dbContext.JobLocations.AsTracking().Where(dbLocation =>
                        dbLocation.JobName == Name).ToListAsync();

                    foreach (var dataKvp in this.RunningLocationsData)
                    {
                        var getTrackedLocation = getjobLocations.FirstOrDefault(dbLocation =>
                            dbLocation.JobName == Name && dbLocation.LocationName == dataKvp.Value.LocationName);
                       if (getTrackedLocation != null)
                        getTrackedLocation.Update(dataKvp.Value);
                    }

                    await _dbContext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Error Saving.. continuing");
                }
                finally
                {
                    _semaphore.Release();
                }
            }
        }



        public virtual TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            double secondsUntilNextAlarm = totalWaitTimeInSeconds switch
            {
                > 1800 => 30,
                > 600 => 15,
                > 120 => 10,
                > 60 => 4,
                > 30 => 2,
                > 5 => 1,
                > 2 => 0.5,
                _ => 0.1,
            };
            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }

    }
}
