using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using Sentry.Protocol;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace Action_Delay_API_Core.Models.Jobs
{

    public class Status
    {
        public const string STATUS_UNDEPLOYED = "Undeployed";
        public const string STATUS_DEPLOYED = "Deployed";
        public const string STATUS_PENDING = "Pending";
        public const string STATUS_ERRORED = "Errored";
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

        public abstract int TargetExecutionSecond { get; }

        public virtual TimeSpan CancelAfterIfHalfDone => TimeSpan.FromMinutes(15);

        public abstract Task RunAction();
        public abstract Task<RunLocationResult> RunLocation(Location location, CancellationToken token);
        public abstract Task HandleCompletion();

        public async Task BaseRun()
        {
            try
            {
                var cancellationTokenSource = new CancellationTokenSource();
                // Pre-init job and locations in database
                _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
                JobData = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.JobName == Name);
                if (JobData == null)
                {
                    JobData = new JobData()
                    {
                        JobName = Name
                    };
                    JobData = _dbContext.JobData.Add(JobData).Entity;
                }
                else
                {
                    JobData.LastRunStatus = JobData.CurrentRunStatus;
                    JobData.LastRunLengthMs = JobData.CurrentRunLengthMs;
                    JobData.LastRunTime = JobData.CurrentRunTime;
                }

                JobData.CurrentRunStatus = Status.STATUS_UNDEPLOYED;
                JobData.CurrentRunLengthMs = null;
                JobData.CurrentRunTime = DateTime.UtcNow;

                foreach (var location in _config.Locations.Where(location => location.Disabled == false))
                {
                    var tryFindLocation = await _dbContext.JobLocations.FirstOrDefaultAsync(dbLocation =>
                        dbLocation.JobName == Name && dbLocation.LocationName == location.Name);
                    if (tryFindLocation == null)
                    {
                        tryFindLocation = new JobDataLocation()
                        {
                            JobName = Name,
                            LocationName = location.Name,
                        };
                        tryFindLocation = _dbContext.JobLocations.Add(tryFindLocation).Entity;
                    }

                    this.RunningLocationsData[location] = tryFindLocation;
                    tryFindLocation.CurrentRunTime = DateTime.UtcNow;
                }

                await TrySave(true);

                // Execute the action for this Job
                await RunAction();
                ConfirmedUpdateUtc = DateTime.UtcNow;

                // Start monitoring on each Location
                foreach (var location in _config.Locations.Where(location => location.Disabled == false))
                {
                    var task = BaseRunLocation(location, cancellationTokenSource.Token);
                    RunningLocations[location] = task;
                }

                // Check the status of tasks continuously
                while (RunningLocations.Count > 0 || cancellationTokenSource.Token.IsCancellationRequested)
                {
                    try
                    {
                        // Get the task that finishes first
                        var completedTask = await Task.WhenAny(RunningLocations.Values);
                        var taskResult = await completedTask;
                        var endTime = DateTime.UtcNow;
                        var completedLocation = RunningLocations.First(x => x.Value == completedTask).Key;

                        // Remove the completed task from the running tasks
                        RunningLocations.Remove(completedLocation);

                        FinishedLocationStatus.Add(completedLocation, taskResult);

                        //  if more then half are done, we just say the entire job is.

                        if (FinishedLocationStatus.Count(kvp => kvp.Value) >=
                            (_config.Locations.Count(location => location.Disabled == false) / 2) ||
                            RunningLocations.Count <= 0)
                        {
                            if (this.JobData.CurrentRunStatus.Equals(Status.STATUS_UNDEPLOYED, StringComparison.OrdinalIgnoreCase))
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
                                    _logger.LogInformation($"Current Run Status: {this.JobData.CurrentRunStatus}, dbContext has changed? {_dbContext.ChangeTracker.HasChanges()}, {_dbContext.Entry(this.JobData)?.State}, context id: {_dbContext.ContextId}, {_dbContext.Entry(this.JobData).Property(x => x.CurrentRunStatus).IsModified}, Original: {_dbContext.Entry(this.JobData).Property(x => x.CurrentRunStatus).OriginalValue}, Current: {_dbContext.Entry(this.JobData).Property(x => x.CurrentRunStatus).CurrentValue}");
                                    _dbContext.Entry(this.JobData).Property(x => x.CurrentRunStatus).IsModified = true;
                                    _dbContext.Entry(this.JobData).Property(x => x.CurrentRunStatus).EntityEntry
                                        .Entity.CurrentRunStatus = Status.STATUS_PENDING;
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

                await HandleCompletion();
                await TrySave(true);
                await _clickHouseService.InsertRun(
                    new ClickhouseJobRun()
                    {
                        JobName = JobData.JobName, RunStatus = JobData.CurrentRunStatus!,
                        RunLength = JobData.CurrentRunLengthMs!.Value, RunTime = JobData.CurrentRunTime.Value
                    }, this.RunningLocationsData.Where(locDataKv => locDataKv!.Value!.CurrentRunStatus != null).Select(
                        locationDataKv => new ClickhouseJobLocationRun()
                        {
                            JobName = locationDataKv.Value.JobName,
                            RunStatus = locationDataKv.Value.CurrentRunStatus!,
                            LocationName = locationDataKv.Value.LocationName,
                            RunLength = locationDataKv.Value.CurrentRunLengthMs!.Value,
                            RunTime = locationDataKv.Value.CurrentRunTime!.Value!
                        }).ToList());
            }
            finally
            {
               await _queue.DisposeAsync();
            }
        }

        public async Task<bool> BaseRunLocation(Location location, CancellationToken token)
        {
            try
            {
                DateTime utcStart = DateTime.UtcNow;

                // Perform the action to send the request at the Location
                while (true)
                {
                    if (token.IsCancellationRequested) throw new OperationCanceledException();
                    // Send a request and get a response
                    var response = await RunLocation(location, token);

                    if (response.Errored)
                    {
                        this.RunningLocationsData[location].CurrentRunLengthMs = 0;
                        this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                        TrySave();
                        return false;
                    }

                    var endTime = DateTime.UtcNow;

                    // modifying inmemory jobdata
                    this.RunningLocationsData[location].CurrentRunLengthMs =
                        (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;

                    if (this.JobData.CurrentRunStatus?.Equals(Status.STATUS_UNDEPLOYED, StringComparison.OrdinalIgnoreCase) ?? false)
                    {
                        this.JobData.CurrentRunLengthMs =
                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                    }

                    if (response.Done == false)
                    {
                        this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_UNDEPLOYED;
                        TrySave();
                        // Use a backoff strategy for the delay between retries
                        var delay = CalculateBackoff((DateTime.UtcNow - utcStart).TotalSeconds);
                        await Task.Delay(delay, token);
                    }
                    else
                    {
                        this.RunningLocationsData[location].CurrentRunStatus = Status.STATUS_DEPLOYED;
                        TrySave();
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

        private int _saving = 0;

        private SemaphoreSlim _semaphore = new SemaphoreSlim(1);

        public async Task TrySave(bool wait = false)
        {
            if (wait)
                await _semaphore.WaitAsync();

            if (_saving == 0)
            {
                try
                {
                    if (wait == false)
                        await _semaphore.WaitAsync();
                    Interlocked.Exchange(ref _saving, 1);
                    await _dbContext.SaveChangesAsync();

                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Error Saving.. continuing");
                }
                finally
                {
                    Interlocked.Exchange(ref _saving, 0);
                    _semaphore.Release();

                }
            }
        }



        public virtual TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            var secondsUntilNextAlarm = 0.5;
            var deployLagSeconds = totalWaitTimeInSeconds / 1000;
            if (deployLagSeconds > 5)
            {
                secondsUntilNextAlarm = 1;
            }

            if (deployLagSeconds > 30)
            {
                secondsUntilNextAlarm = 2;
            }

            if (deployLagSeconds > 60)
            {
                secondsUntilNextAlarm = 4;
            }

            if (deployLagSeconds > 120)
            {
                secondsUntilNextAlarm = 10;
            }

            if (deployLagSeconds > 600)
            {
                secondsUntilNextAlarm = 15;
            }

            if (deployLagSeconds > 1800)
            {
                secondsUntilNextAlarm = 30;
            }

            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }

    }
}
