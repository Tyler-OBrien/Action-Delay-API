using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using GraphQL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



public class Status
{
    public const string STATUS_UNDEPLOYED = "Undeployed";
    public const string STATUS_DEPLOYED = "Deployed";
    public const string STATUS_PENDING = "Pending";
    public const string STATUS_ERRORED = "Errored";
    public const string STATUS_API_ERROR = "API_Error";
}

public abstract class BaseJob
{
    internal readonly LocalConfig _config;
    internal readonly ILogger _logger;
    internal readonly IClickHouseService _clickHouseService;
    internal readonly ActionDelayDatabaseContext _dbContext;
    internal readonly IQueue _queue;



    protected BaseJob(IOptions<LocalConfig> config, ILogger<BaseJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue)
    {
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
    public abstract string JobType { get; }
    public abstract string JobDescription { get; }


    public abstract int TargetExecutionSecond { get; }
    public abstract bool Enabled { get; }



    public virtual async Task TrySave(bool force)
    {
        await _dbContext.SaveChangesAsync();
    }

    public virtual async Task BaseRun()
    {
        using var scope = _logger.BeginScope(Name);
        using var sentryScope = SentrySdk.PushScope();
        SentrySdk.AddBreadcrumb($"Starting Job {Name}");
        try
        {
            var cancellationTokenSource = new CancellationTokenSource();
            // Pre-init job and locations in database
            _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
            JobData = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.InternalJobName == InternalName);
            if (JobData == null)
            {
                var newJobData = new JobData()
                {
                    JobName = Name,
                    InternalJobName = InternalName,
                    JobType = JobType,
                    JobDescription = JobDescription
                };
                _dbContext.JobData.Add(newJobData);
                await TrySave(true);
                JobData = await _dbContext.JobData.AsTracking().FirstAsync(job => job.InternalJobName == InternalName);
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
            SentrySdk.AddBreadcrumb($"Got Job Data: {JobData.CurrentRunStatus}");

            // Execute the action for this Job
            try
            {
                await RunAction();
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

        }
        finally
        {
            await TrySave(true);
            // await _queue.DisposeAsync();
        }
    }

    public abstract Task RunAction();



    public async Task InsertRunResult(CustomAPIError? customApiError = null)
    {
        try
        {
            if (customApiError != null)
                await InsertTrackedError(_dbContext, customApiError, JobType, _logger);
            await _clickHouseService.InsertRun(
                new ClickhouseJobRun()
                {
                    JobName = JobData.InternalJobName,
                    RunStatus = JobData.CurrentRunStatus!,
                    RunLength = JobData.CurrentRunLengthMs ?? 0,
                    RunTime = JobData.CurrentRunTime ?? DateTime.UtcNow,
                    ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0)
                }, new List<ClickhouseJobLocationRun>(), ClickhouseAPIError.CreateFromCustomError(this.InternalName, customApiError));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{jobName}: Error inserting run result", Name);
        }
        try
        {
            await TrySave(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{jobName}: Error inserting run result", Name);
        }
    }

    public static Task InsertTrackedError(ActionDelayDatabaseContext context, CustomAPIError error,
        string firstService, ILogger logger)
    {

        var clickhouseApiError = new ClickhouseAPIError()
        {
            ErrorType = String.IsNullOrWhiteSpace(error.WorkerStatusCode)
                ? error.StatusCode.ToString()
                : error.WorkerStatusCode,
            ErrorDescription = error.SimpleErrorMessage
        };
        clickhouseApiError.ErrorHash = ClickhouseAPIError.Sha256Hash(clickhouseApiError.ErrorDescription, clickhouseApiError.ErrorType);
        return InsertTrackedError(context, clickhouseApiError, firstService, logger);
    }

    public static async Task InsertTrackedError(ActionDelayDatabaseContext context, IClickhouseError error, string firstService, ILogger logger)
    {
        try
        {

            var tryGetError = await context.JobErrors.AnyAsync(existingError =>
                existingError.ErrorHash == error.ErrorHash );
            if (tryGetError == false)
            {
                var newError = new JobError()
                {
                    ErrorDescription = error.ErrorDescription,
                    ErrorHash = error.ErrorHash,
                    ErrorType = error.ErrorType,
                    FirstSeen = DateTime.UtcNow,
                    FirstService = firstService
                };
                context.JobErrors.Add(newError);
                await context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{jobName}: Error inserting run failure into db", firstService);
        }
    }

    public static async Task InsertTrackedErrors(ActionDelayDatabaseContext context, IEnumerable<IClickhouseError> errors, string firstService, ILogger logger)
    {
        try
        {
            List<string> errorHashes = new List<string>(errors.Select(error => error.ErrorHash));

            var tryGetError = await context.JobErrors.Where(existingError =>
                errorHashes.Contains(existingError.ErrorHash)).Select(existingError => existingError.ErrorHash).ToListAsync();

            var errorsNotFound = errors.ExceptBy(tryGetError, error => error.ErrorHash).ToList();
            foreach (var error in errorsNotFound)
            {
                var newError = new JobError()
                {
                    ErrorDescription = error.ErrorDescription,
                    ErrorHash = error.ErrorHash,
                    ErrorType = error.ErrorType,
                    FirstSeen = DateTime.UtcNow,
                    FirstService = firstService
                };
                context.JobErrors.Add(newError);
            }


            if (errorsNotFound.Any())
            {
                await context.SaveChangesAsync();
            }

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{jobName}: Error inserting run failure into db", firstService);
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
                    ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0)
                }, new List<ClickhouseJobLocationRun>(), ClickhouseAPIError.CreateFromCustomError(this.InternalName, customApiError));
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


}