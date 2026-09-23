using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Errors;
using Exception = System.Exception;
using System.Collections.Concurrent;
using System.Diagnostics;
using Action_Delay_API_Core.Models.Jobs;

namespace Action_Delay_API_Core.Jobs.PropagationJobs
{

    public class Status
    {
        public const string STATUS_UNDEPLOYED = "Undeployed";
        public const string STATUS_DEPLOYED = "Deployed";
        public const string STATUS_PENDING = "Pending";
        public const string STATUS_ERRORED = "Errored";
        public const string STATUS_API_ERROR = "API_Error";
    }

    public abstract class BasePropagationJob : BaseJob
    {



        protected Dictionary<Location, Task<bool>> RunningLocations { get; set; } = new Dictionary<Location, Task<bool>>();

        protected Dictionary<Location, bool> FinishedLocationStatus { get; set; } = new Dictionary<Location, bool>();
        protected Dictionary<Location, JobDataLocation> RunningLocationsData { get; set; } = new Dictionary<Location, JobDataLocation>();

        /// <summary>
        /// What this run concluded about each location, and the authoritative record of whether a
        /// location reported at all.
        /// </summary>
        /// <remarks>
        /// <para>
        /// This exists because <see cref="JobDataLocation.CurrentRunStatus"/> cannot answer either
        /// question. It is never reset between runs - the run-start block only copies it into
        /// LastRunStatus - so after a job's first run it is never null. The emission filter that
        /// tested it for null was therefore dead code, and a location that failed to reach a terminal
        /// state emitted the *previous* run's status and length stamped with this run's timestamp:
        /// stale data indistinguishable from a fresh measurement.
        /// </para>
        /// <para>
        /// Kept in memory rather than nulling the database column, because the website's live location
        /// table reads that column and blanking it mid-run would make the table flicker empty.
        /// </para>
        /// <para>
        /// Concurrent because <see cref="RecordOutcome"/> is called from the location tasks, which run
        /// in parallel. The neighbouring <see cref="RunningLocationsData"/> gets away with a plain
        /// dictionary only because those tasks mutate its <em>values</em> and never the dictionary
        /// itself; this one takes key writes, so it needs the real thing.
        /// </para>
        /// </remarks>
        protected ConcurrentDictionary<Location, RunOutcome> RunningLocationsOutcome { get; set; } = new ConcurrentDictionary<Location, RunOutcome>();

        protected BasePropagationJob(IOptions<LocalConfig> config, ILogger<BasePropagationJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue, ILocationProvider locationProvider) : base(config, logger, clickhouseService, context, queue, locationProvider)
        {

        }


        // Delay for up to 5 minutes once half are done.
        public virtual TimeSpan CancelAfterIfHalfDone { get; private set; } = TimeSpan.FromMinutes(5);

        /* Run the Task (DNS or HTTP) Request to get caches warm and such for more consistent results */
        public virtual async Task PreWarmAction()
        {
            try
            {
                Dictionary<Location, Task> preInitWarmTasks = new();
                foreach (var location in RunLocations)
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
                _logger.LogInformation($"Finished Pre-Warm: {preInitWarmTasks.Count(task => task.Value.IsCompletedSuccessfully)} Locations Completely Successfully. Failed Locations: {string.Join(", ", preInitWarmTasks.Where(task => task.Value.IsFaulted).Select(task => task.Key.DisplayName ?? task.Key.Name))}");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    $"Failure running PreWarmAction for {Name}");
            }
        }

        public abstract Task PreWarmRunLocation(Location location);


        public abstract Task RunRepeatableAction();

        public virtual TimeSpan RepeatActionAfter => TimeSpan.FromMinutes(10);
        public abstract Task<RunLocationResult> RunLocation(Location location, CancellationToken token);
        public abstract Task HandleCompletion();

        public virtual Task JobInit() => Task.CompletedTask;





        public override async Task BaseRun()
        {
            // Everything below - pre-warm, the JobLocations rows, the fan-out and the completion
            // thresholds - must agree on one roster for the whole run.
            CaptureLocationSnapshot();

            using var scope = _logger.BeginScope(Name);
            using var sentryScope = SentrySdk.PushScope();
            var transaction = SentrySdk.StartTransaction(Name, "Job");
            SentrySdk.ConfigureScope(scope => scope.Transaction = transaction);
            SentrySdk.AddBreadcrumb($"Starting Job {Name}");
            try
            {
                var cancellationTokenSource = new CancellationTokenSource();
                // Pre-init job and locations in database
                _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
                var prefetchJobData = await _dbContext.JobData.AsTracking().Where(job => job.InternalJobName == InternalName).ToListAsync();
                var listOfJobNames = new List<string>(prefetchJobData.Select(job => job.InternalJobName));
                var prefetchJobLocsData = await _dbContext.JobLocations.AsTracking().Where(job => job.InternalJobName == InternalName).ToListAsync();


                // We always want NonTracking Here because we'll manually push back the changes we make in a semaphore, preventing issues with the ChangeTracker Dict being modified mid-save
                JobData = await _dbContext.JobData.AsNoTracking().FirstOrDefaultAsync(job => job.InternalJobName == InternalName);
                if (JobData == null)
                {
                    var newJobData = new JobData()
                    {
                        JobName = Name,
                        InternalJobName = InternalName,
                        JobType = JobType,
                        JobDescription = JobDescription,
                    };
                    _dbContext.JobData.Add(newJobData);
                    await TrySave(true);
                    JobData = await _dbContext.JobData.AsNoTracking().FirstAsync(job => job.InternalJobName == InternalName);
                }
                else
                {
                    JobData.LastRunStatus = JobData.CurrentRunStatus;
                    JobData.LastRunLengthMs = JobData.CurrentRunLengthMs;
                    JobData.LastRunTime = JobData.CurrentRunTime;
                }

                JobData.JobType = JobType;
                JobData.JobDescription = JobDescription;

                JobData.CurrentRunStatus = Status.STATUS_PENDING;
                JobData.CurrentRunLengthMs = null;
                JobData.CurrentRunTime = DateTime.UtcNow;
                _ = PushJobUpdateEvent();
                SentrySdk.AddBreadcrumb($"Got Job Data: {JobData.CurrentRunStatus}");


                var jobLocs = await _dbContext.JobLocations.AsNoTracking().Where(job => job.InternalJobName == InternalName).ToListAsync();

                foreach (var location in RunLocations)
                {
                    var tryFindLocation = jobLocs.FirstOrDefault(dbLocation =>
                        dbLocation.InternalJobName == InternalName && dbLocation.LocationName == location.Name);
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
                        tryFindLocation = newLocation.Clone();
                    }
                    else
                    {
                        tryFindLocation.LastRunStatus = tryFindLocation.CurrentRunStatus;
                        tryFindLocation.LastRunLengthMs = tryFindLocation.CurrentRunLengthMs;
                        tryFindLocation.LastRunTime = tryFindLocation.CurrentRunTime;
                    }

                    RunningLocationsData[location] = tryFindLocation;
                    // None until this run says otherwise. Anything still None at emission never
                    // reported, and is recorded as no_result rather than inheriting the last run.
                    RunningLocationsOutcome[location] = RunOutcome.None;
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
                    _ = PushJobUpdateEvent();

                }
                catch (CustomAPIError ex)
                {
                    _logger.LogWarning(ex, "Run for {jobName} failed due to API Issues: {err}", Name, ex.Message);
                    JobData.CurrentRunStatus = Status.STATUS_API_ERROR;
                    _ = PushJobUpdateEvent();
                    await InsertRunFailure(Status.STATUS_API_ERROR, ex);
                    throw;
                }
                catch (Exception)
                {
                    JobData.CurrentRunStatus = Status.STATUS_ERRORED;
                    _ = PushJobUpdateEvent();
                    await InsertRunFailure(Status.STATUS_ERRORED, null);
                    throw;
                }
                SentrySdk.AddBreadcrumb($"Ran Action for {Name}");

                ConfirmedUpdateUtc = DateTime.UtcNow;

                var backgroundRepeatableActionRun = RunRepeatableActionBackground(cancellationTokenSource.Token);

                // Start monitoring on each Location
                foreach (var location in RunLocations)
                {
                    var task = BaseRunLocation(location, cancellationTokenSource.Token);
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

                            //  if more then 80% are done, we just say the entire job is.

                            if (FinishedLocationStatus.Count(kvp => kvp.Value) >=
                                RunLocationCount * 0.80 ||
                                RunningLocations.Count <= 0)
                            {
                                if (JobData.CurrentRunStatus.Equals(Status.STATUS_UNDEPLOYED,
                                        StringComparison.OrdinalIgnoreCase))
                                {
                                    // Success, at least 75% are success
                                    if (FinishedLocationStatus.Count(kvp => kvp.Value) >=
                                        RunLocationCount * 0.75)
                                    {
                                        _logger.LogInformation(
                                            $"{JobData.JobName} is considered done, it has {RunningLocations.Count} running locations: {string.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))}, setting all other locations to cancel in {CancelAfterIfHalfDone.TotalMinutes} Minutes");
                                        cancellationTokenSource.CancelAfter(CancelAfterIfHalfDone);
                                        JobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
                                        JobRunOutcome = RunOutcome.Deployed;
                                        JobData.CurrentRunLengthMs =
                                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                                        _ = PushJobUpdateEvent();
                                        await TrySave(true);
                                    }
                                    else
                                    {
                                        _logger.LogInformation(
                                            $"FAILURE: {JobData.JobName} is considered failed, it has {RunningLocations.Count} running locations: {string.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))}, setting all other locations to cancel in {CancelAfterIfHalfDone.TotalMinutes} Minutes");
                                        cancellationTokenSource.CancelAfter(CancelAfterIfHalfDone);
                                        JobData.CurrentRunLengthMs =
                                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                                        // Distinct from "our API call failed" and from "our
                                        // probes broke", both of which also wrote STATUS_ERRORED.
                                        JobData.CurrentRunStatus = Status.STATUS_ERRORED;
                                        JobRunOutcome = RunOutcome.InsufficientCoverage;
                                        _ = PushJobUpdateEvent();
                                        await TrySave(true);
                                    }
                                }
                            }
                        }
                        catch (OperationCanceledException)
                        {
                            _logger.LogInformation(
                                $"{JobData.JobName} had {RunningLocations.Count} locations, namely: {string.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name))} timed out.");
                            /* NOM NOM */
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error handling location runs for job {name}, aborting... Locations not finished yet: {locations}", Name, string.Join(", ", RunningLocations.Select(loc => loc.Key.DisplayName ?? loc.Key.Name)));
                    SentrySdk.CaptureException(ex);
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

                RefineJobOutcome();

                // Must run *after* RefineJobOutcome, which deliberately ignores locations still
                // holding None on the grounds that they said nothing either way. Stamping them first
                // would feed no_result - which IsOurFailure counts - into that tally and let a run
                // flip to probe_degraded on the strength of locations that never reported.
                var neverReportedLocations = new HashSet<Location>();
                foreach (var location in RunningLocationsData.Keys.ToList())
                {
                    if (RunningLocationsOutcome.TryGetValue(location, out var recorded) && recorded != RunOutcome.None)
                        continue;
                    neverReportedLocations.Add(location);
                    // Recorded on the entity as well as in memory. The column is what the website's
                    // live location table reads and it is never reset between runs, so leaving it
                    // alone would keep showing the previous run's outcome for a location that has
                    // since gone silent - the same staleness the emission filter below was fixed for.
                    // Persisted by the TrySave at the end of this method, along with everything else.
                    RecordOutcome(location, RunOutcome.NoResult, FailureReason.NoResult);
                }

                try
                {
                    await _clickHouseService.InsertRun(
                        new ClickhouseJobRun()
                        {
                            JobName = JobData.InternalJobName,
                            RunStatus = JobData.CurrentRunStatus!,
                            RunLength = JobData.CurrentRunLengthMs!.Value,
                            RunTime = JobData.CurrentRunTime.Value,
                            ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0),
                            Outcome = ResolveEmittedOutcome(CompletedRunFallback)
                        }, RunningLocationsData.ToList()
                            // Every location that was attempted emits exactly one row, including the
                            // ones that never reported. Filtering on CurrentRunStatus != null used to
                            // stand in for "did this location report", but that field survives across
                            // runs, so the filter passed everything and silent locations contributed
                            // the previous run's numbers under this run's timestamp.
                            .Select(locationDataKv =>
                            {
                                // Every location now carries an outcome: the pass above filled in
                                // no_result for the ones that never reported.
                                var neverReported = neverReportedLocations.Contains(locationDataKv.Key);
                                var outcome = RunningLocationsOutcome.TryGetValue(locationDataKv.Key, out var recorded)
                                    ? recorded
                                    : RunOutcome.NoResult;

                                return new ClickhouseJobLocationRun()
                                {
                                    JobName = locationDataKv.Value.InternalJobName,
                                    // Frozen: a location that never reported has always read as
                                    // Errored, and eleven dashboards depend on that spelling.
                                    RunStatus = neverReported
                                        ? Status.STATUS_ERRORED
                                        : locationDataKv.Value.CurrentRunStatus!,
                                    LocationName = locationDataKv.Value.LocationName,
                                    RunLength = neverReported ? 0 : locationDataKv.Value.CurrentRunLengthMs ?? 0,
                                    RunTime = locationDataKv.Value.CurrentRunTime!.Value!,
                                    ResponseLatency = neverReported ? 0 : (uint)(locationDataKv.Value.ResponseTimeUtc ?? 0),
                                    ColoId = locationDataKv.Value.ColoId,
                                    Outcome = outcome.ToColumnValue(),
                                    FailureReason = FailureReason.Sanitize(locationDataKv.Value.FailureReason),
                                };
                            }).ToList(), null);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inserting run statistics into Clickhouse");
                    SentrySdk.CaptureException(ex);
                }

                try
                {
                    await TrySave(true);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error saving run status");
                    SentrySdk.CaptureException(ex);
                }

            }
            finally
            {
                // await _queue.DisposeAsync();
                transaction.Finish();
            }
        }

        public async Task RunRepeatableActionBackground(CancellationToken token)
        {
            try
            {
                while (token.IsCancellationRequested == false)
                {
                    // Execute the action for this Job
                    try
                    {
                        await Task.Delay(RepeatActionAfter, token);
                        _logger.LogInformation("Running Repeatable Action for {jobName} due to timeSpan over of {timeSpan}", Name, RepeatActionAfter);
                        if (token.IsCancellationRequested) return;
                        await RunRepeatableAction();
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation("Job {jobName} over, stopping RepeatableActionBackground", Name);
                    }
                    catch (CustomAPIError ex)
                    {
                        _logger.LogWarning(ex, "Repeatable Run for {jobName} failed due to API Issues: {err}",
                            Name,
                            ex.Message);

                    }
                    catch (Exception exc)
                    {
                        _logger.LogWarning(exc, "Repeatable Run for {jobName} failed due to API Issues: {err}",
                            Name, exc.Message);
                    }

                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Job {jobName} over, stopping RepeatableActionBackground", Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RunBackgroundAction");
            }
        }

        public async Task InsertRunFailure(string errorCause, CustomAPIError? customApiError)
        {
            try
            {
                if (customApiError != null)
                    await InsertTrackedError(_dbContext, customApiError, JobType, _logger);
                await _clickHouseService.InsertRun(
                    new ClickhouseJobRun()
                    {
                        JobName = JobData.InternalJobName,
                        RunStatus = JobData.CurrentRunStatus ?? errorCause,
                        RunLength = JobData.CurrentRunLengthMs ?? 0,
                        RunTime = JobData.CurrentRunTime ?? DateTime.UtcNow,
                        ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0),
                        Outcome = ResolveEmittedOutcome(RunOutcome.JobError)
                        // No location rows: RunAction failed, so nothing was ever attempted at the
                        // edge. The job row's outcome is the whole story.
                    }, new List<ClickhouseJobLocationRun>(), ClickhouseAPIError.CreateFromCustomError(InternalName, customApiError));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{jobName}: Error inserting run failure for error cause: {errorCause}", Name, errorCause);
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
                    var timer = Stopwatch.StartNew();
                    // Send a request and get a response
                    var response = await RunLocation(location, token);
                    var elapsedTimeRunning = timer.Elapsed;
                    if (token.IsCancellationRequested) throw new OperationCanceledException();

                    RunningLocationsData[location].ResponseTimeUtc = response.ResponseTimeMs;
                    RunningLocationsData[location].ColoId = response.ColoId;


                    if (response.Errored)
                    {
                        RunningLocationsData[location].CurrentRunLengthMs = 0;
                        // Status stays "Errored" for every cause - it is the compatibility surface.
                        // The outcome is what says whether this was the target's fault or ours.
                        RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                        RecordOutcome(location, response.Outcome, response.FailureReasonCode);
                        _ = TrySave();
                        _ = PushJobLocationUpdate(RunningLocationsData[location]);
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
                    RunningLocationsData[location].CurrentRunLengthMs =
                        (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;

                    if (JobData.CurrentRunStatus?.Equals(Status.STATUS_UNDEPLOYED, StringComparison.OrdinalIgnoreCase) ?? false)
                    {
                        JobData.CurrentRunLengthMs =
                            (ulong?)(endTime - ConfirmedUpdateUtc).TotalMilliseconds;
                        //_logger.LogInformation($"{Name} Run Still {this.JobData.CurrentRunStatus}, updating time, new time: {this.JobData.CurrentRunLengthMs}. took {elapsedTimeRunning.TotalMilliseconds}ms to check.");
                    }

                    if (response.Done == false)
                    {
                        RunningLocationsData[location].CurrentRunStatus = Status.STATUS_UNDEPLOYED;
                        _ = TrySave();
                        // Use a backoff strategy for the delay between retries
                        var delay = CalculateBackoff((DateTime.UtcNow - utcStart).TotalSeconds) - elapsedTimeRunning;
                        if (delay.TotalMilliseconds > 0)
                            await Task.Delay(delay, token);
                    }
                    else
                    {
                        RunningLocationsData[location].CurrentRunStatus = Status.STATUS_DEPLOYED;
                        RecordOutcome(location, RunOutcome.Deployed, FailureReason.None);
                        _ = TrySave();
                        _ = PushJobLocationUpdate(RunningLocationsData[location]);

                        return true;
                    }
                }
            }
            catch (OperationCanceledException ex)
            {
                RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                // This location was still legitimately propagating when the job stopped waiting,
                // once 80% of locations were done. A censored observation, not a failure - and the
                // single biggest source of overstated failure in the old data, because it was
                // recorded identically to a dead edge worker.
                RecordOutcome(location, RunOutcome.Cancelled, FailureReason.Cancelled);
                _ = PushJobLocationUpdate(RunningLocationsData[location]);
                _logger.LogError(ex, $"Location {location.Name} timed out");
                return false;
            }
            catch (Exception ex)
            {
                try
                {
                    RunningLocationsData[location].CurrentRunStatus = Status.STATUS_ERRORED;
                    RecordOutcome(location, RunOutcome.JobError, FailureReason.JobError);
                    _ = PushJobLocationUpdate(RunningLocationsData[location]);
                }
                catch (Exception) { /* nom */ }

                _logger.LogError(ex, $"Error running location {location.Name}");
                return false;
            }
        }


        /// <summary>
        /// Separates "the change did not propagate" from "our probes broke" for a run that missed its
        /// coverage threshold. Both wrote <c>insufficient_coverage</c> before this, which made the
        /// job-level success rate impossible to correct.
        /// </summary>
        /// <remarks>
        /// <para>
        /// Runs at emission rather than where the threshold is evaluated. That decision is taken as
        /// soon as 80% of locations have finished, so the remaining ~20% are still <c>None</c> and
        /// judging there would count locations that had not reported yet as failures.
        /// </para>
        /// <para>
        /// The rule itself lives in <see cref="RunOutcomeExtensions.RefineCoverageOutcome"/>, shared
        /// with the Perf and AI jobs so that <c>probe_degraded</c> means the same thing in every table
        /// the success rate can exclude it from.
        /// </para>
        /// </remarks>
        protected void RefineJobOutcome()
        {
            if (JobRunOutcome != RunOutcome.InsufficientCoverage) return;

            JobRunOutcome = RunOutcomeExtensions.RefineCoverageOutcome(RunningLocationsOutcome.Values);
        }

        /// <summary>
        /// Records what this run concluded about a location, in memory for the ClickHouse row and on
        /// the entity for the live view. The reason is sanitized here rather than trusted, because
        /// this is the last point before it reaches a LowCardinality column.
        /// </summary>
        protected void RecordOutcome(Location location, RunOutcome outcome, string failureReason)
        {
            RunningLocationsOutcome[location] = outcome;
            if (RunningLocationsData.TryGetValue(location, out var locationData))
            {
                locationData.Outcome = outcome.ToColumnValue();
                locationData.FailureReason = FailureReason.Sanitize(failureReason);
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
                    var getTrackedJobData = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.InternalJobName == InternalName);
                    if (getTrackedJobData != null)
                        getTrackedJobData.Update(JobData);

                    var getjobLocations = await _dbContext.JobLocations.AsTracking().Where(dbLocation =>
                        dbLocation.InternalJobName == InternalName).ToListAsync();

                    foreach (var dataKvp in RunningLocationsData)
                    {
                        var getTrackedLocation = getjobLocations.FirstOrDefault(dbLocation =>
                            dbLocation.InternalJobName == InternalName && dbLocation.LocationName == dataKvp.Value.LocationName);
                        if (getTrackedLocation != null)
                            getTrackedLocation.Update(dataKvp.Value);
                    }

                    try
                    {
                        foreach (var entry in _dbContext.ChangeTracker.Entries()
                                     .Where(e => e.State == EntityState.Modified))
                        {
                            entry.Property("LastEditDate").CurrentValue = DateTime.UtcNow;
                            entry.Property("LastEditDate").IsModified = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        SentrySdk.CaptureException(ex);
                        _logger.LogError(ex, "Error updating LastEditDate");
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

        public async Task PushJobUpdateEvent()
        {
            _ = _queue.JobStatusUpdate(this.JobData.InternalJobName, this.JobData.CurrentRunStatus,
                this.JobData.CurrentRunLengthMs, this.JobData.CurrentRunTime);
        }

        public async Task PushJobLocationUpdate(JobDataLocation jobDataLocation)
        {
            _ = _queue.JobLocationUpdate(jobDataLocation.InternalJobName, jobDataLocation.LocationName, jobDataLocation.CurrentRunStatus,
                jobDataLocation.CurrentRunLengthMs, jobDataLocation.CurrentRunTime);
        }


        public virtual TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            double secondsUntilNextAlarm = totalWaitTimeInSeconds switch
            {
                > 1800 => 30,
                > 600 => 15,
                > 120 => 10,
                > 60 => 2,
                > 30 => 0.5,
                > 5 => 0.5,
                > 2 => 0.25,
                _ => 0.1,
            };
            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }

    }
}
