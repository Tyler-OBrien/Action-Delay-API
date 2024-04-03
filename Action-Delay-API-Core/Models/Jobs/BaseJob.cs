using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
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
    internal readonly ICloudflareAPIBroker _apiBroker;
    internal readonly LocalConfig _config;
    internal readonly ILogger _logger;
    internal readonly IClickHouseService _clickHouseService;
    internal readonly ActionDelayDatabaseContext _dbContext;
    internal readonly IQueue _queue;



    protected BaseJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<BaseJob> logger, IClickHouseService clickhouseService, ActionDelayDatabaseContext context, IQueue queue)
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
            JobData = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.JobName == Name);
            if (JobData == null)
            {
                var newJobData = new JobData()
                {
                    JobName = Name,
                    InternalJobName = InternalName,
                };
                _dbContext.JobData.Add(newJobData);
                await TrySave(true);
                JobData = await _dbContext.JobData.AsTracking().FirstAsync(job => job.JobName == Name);
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
            await _clickHouseService.InsertRun(
                new ClickhouseJobRun()
                {
                    JobName = JobData.JobName,
                    RunStatus = JobData.CurrentRunStatus!,
                    RunLength = JobData.CurrentRunLengthMs ?? 0,
                    RunTime = JobData.CurrentRunTime ?? DateTime.UtcNow,
                    ResponseLatency = (uint)(JobData.APIResponseTimeUtc ?? 0)
                }, new List<ClickhouseJobLocationRun>(), ClickhouseAPIError.CreateFromCustomError(this.Name, customApiError));
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