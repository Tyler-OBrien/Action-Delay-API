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
    public abstract class IBaseJob
    {

        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IClickHouseService _clickHouseService;
        private readonly ActionDelayDatabaseContext _dbContext;

        protected Dictionary<Location, Task> RunningLocations { get; set; } = new Dictionary<Location, Task>();
        protected Dictionary<Location, JobDataLocation> RunningLocationsData { get; set; } = new Dictionary<Location, JobDataLocation>();

        protected IBaseJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<IBaseJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _clickHouseService = clickhouseService;
            _dbContext = context;
        }

        public abstract TimeSpan Interval { get; }

        public DateTime ConfirmedUpdateUtc { get; set; }

        public JobData JobData { get; set; }


        public abstract string Name { get; }

        public abstract Task RunAction();
        public abstract Task<RunLocationResult> RunLocation(Location location);
        public abstract Task HandleCompletion();

        public async Task BaseRun()
        {
            // Pre-init job and locations in database
            _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
            JobData = await _dbContext.JobData.FirstOrDefaultAsync(job => job.JobName == Name);
            if (JobData == null)
            {
                JobData = new JobData()
                {
                    JobName = Name
                };
                _dbContext.JobData.Add(JobData);
            }
            else
            {
                JobData.LastRunStatus = JobData.CurrentRunStatus;
                JobData.LastRunLengthMs = JobData.CurrentRunLengthMs;
                JobData.LastRunTime = JobData.CurrentRunTime;

                JobData.CurrentRunStatus = null;
                JobData.CurrentRunLengthMs = null;
            }
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
                    _dbContext.JobLocations.Add(tryFindLocation);
                }
                this.RunningLocationsData[location] = tryFindLocation;
                tryFindLocation.CurrentRunTime = DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync();

            // Execute the action for this Job
            await RunAction();
            ConfirmedUpdateUtc = DateTime.UtcNow;

            // Start monitoring on each Location
            foreach (var location in _config.Locations.Where(location => location.Disabled == false))
            {
                var task = BaseRunLocation(location);
                RunningLocations[location] = task;
            }

            // Check the status of tasks continuously
            while (RunningLocations.Count > 0)
            {
                // Get the task that finishes first
                var completedTask = await Task.WhenAny(RunningLocations.Values);
                var endTime = DateTime.UtcNow;
                var completedLocation = RunningLocations.First(x => x.Value == completedTask).Key;

                // Remove the completed task from the running tasks
                RunningLocations.Remove(completedLocation);

                //  if more then half are done, we just say the entire job is.
                if (RunningLocations.Count < (_config.Locations.Count(location => location.Disabled == false) / 2) || RunningLocations.Count <= 0)
                {
                    this.JobData.CurrentRunLengthMs =
                        (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                    this.JobData.CurrentRunStatus = "Deployed";
                    TrySave();
                }
                
            }
            await HandleCompletion();
            await TrySave(true);
            await _clickHouseService.InsertRun(
                new ClickhouseJobRun()
                {
                    JobName = JobData.JobName, RunStatus = JobData.CurrentRunStatus!,
                    RunLength = JobData.CurrentRunLengthMs!.Value, RunTime = JobData.CurrentRunTime.Value
                }, this.RunningLocationsData.Select(locationDataKv => new ClickhouseJobLocationRun()
                {JobName = locationDataKv.Value.JobName,
                    RunStatus = locationDataKv.Value.CurrentRunStatus!,
                    LocationName = locationDataKv.Value.LocationName,
                    RunLength = locationDataKv.Value.CurrentRunLengthMs!.Value,
                    RunTime = locationDataKv.Value.CurrentRunTime!.Value!
                }).ToList());
        }

        public async Task BaseRunLocation(Location location)
        {
            DateTime utcStart = DateTime.UtcNow;

            // Perform the action to send the request at the Location
            while (true)
            {
                // Send a request and get a response
                var response = await RunLocation(location);
                var endTime = DateTime.UtcNow;

                // modifying inmemory jobdata
                this.RunningLocationsData[location].CurrentRunLengthMs =
                    (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                if (response.Done == false)
                {
                    this.RunningLocationsData[location].CurrentRunStatus = "Undeployed";
                    TrySave();
                    // Use a backoff strategy for the delay between retries
                    var delay = CalculateBackoff((DateTime.UtcNow - utcStart).TotalSeconds);
                    await Task.Delay(delay);
                }
                else
                {
                    this.RunningLocationsData[location].CurrentRunStatus = "Deployed";
                    TrySave();
                    break;
                }
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

            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }

    }
}
