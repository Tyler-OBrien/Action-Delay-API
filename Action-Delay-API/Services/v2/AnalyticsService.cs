using System.Net;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using System;
using Action_Delay_API_Core.Models.API.CompatAPI;

namespace Action_Delay_API.Services.v2;

public class AnalyticsService : IAnalyticsService
{
    private readonly ICacheSingletonService _cacheSingletonService;
    private readonly IClickHouseService _clickhouseService;
    private readonly ActionDelayDatabaseContext _genericServersContext;

    private readonly ILogger _logger;


    public AnalyticsService(ActionDelayDatabaseContext genericServersContext, IClickHouseService clickhouseService, ILogger<AnalyticsService> logger,
        ICacheSingletonService cacheSingletonService)
    {
        _cacheSingletonService = cacheSingletonService;
        _clickhouseService = clickhouseService;
        _genericServersContext = genericServersContext;
        _logger = logger;
    }

    private Result ValidateParams(DateTime startDateTime, DateTime endDateTime, JobAnalyticsRequestOptions options, int maxPoints)
    {
        if (endDateTime == startDateTime)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "End Date cannot be equal to Start Date", "bad_input"));
        }
        if (endDateTime < startDateTime)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "End Date cannot be less then Start Date", "bad_input"));
        }
        // some padding for time sync (this check doesn't really need to be done, but it's pretty silly if they're requesting results far ahead of current time)
        // we do not yet have a time machine
        if (DateTime.UtcNow.AddHours(1) < endDateTime)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "End Date cannot be greater then current time", "bad_input"));
        }
        if (options == JobAnalyticsRequestOptions.None)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "At least one field has to be selected", "bad_input"));
        }

        if (maxPoints < 10)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Max Points can't be less then 10", "bad_input"));
        }

        if (maxPoints > 250)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Max Points can't be greater then 250 (soft limit, open for adjusting)", "bad_input"));
        }

        return Result.Ok();
    }

    public NormalJobAnalyticsPoint JobDataFromOptions(JobData jobData, JobAnalyticsRequestOptions options)
    {
        var newJobAnalyticsPoint = new NormalJobAnalyticsPoint();

        newJobAnalyticsPoint.Undeployed = true;
        newJobAnalyticsPoint.TimePeriod = jobData.CurrentRunTime!.Value;

        if (options.HasFlag(JobAnalyticsRequestOptions.MinRunLength))
            newJobAnalyticsPoint.MinRunLength = jobData.CurrentRunLengthMs;

        if (options.HasFlag(JobAnalyticsRequestOptions.MaxRunLength))
            newJobAnalyticsPoint.MaxRunLength = jobData.CurrentRunLengthMs;

        if (options.HasFlag(JobAnalyticsRequestOptions.AvgRunLength))
            newJobAnalyticsPoint.AvgRunLength = jobData.CurrentRunLengthMs;

        if (options.HasFlag(JobAnalyticsRequestOptions.MedianRunLength))
            newJobAnalyticsPoint.MedianRunLength = jobData.CurrentRunLengthMs;

        /*
        if (options.HasFlag(JobAnalyticsRequestOptions.MinResponseLatency))
            newJobAnalyticsPoint.MinResponseLatency = jobData.APIResponseTimeUtc;

        if (options.HasFlag(JobAnalyticsRequestOptions.MaxResponseLatency))
            newJobAnalyticsPoint.MaxResponseLatency = jobData.APIResponseTimeUtc;

        if (options.HasFlag(JobAnalyticsRequestOptions.AvgResponseLatency))
            newJobAnalyticsPoint.AvgResponseLatency = jobData.APIResponseTimeUtc;

        if (options.HasFlag(JobAnalyticsRequestOptions.MedianResponseLatency))
            newJobAnalyticsPoint.MedianResponseLatency = jobData.APIResponseTimeUtc;
        */
        return newJobAnalyticsPoint;
    }

    public static JobAnalyticsConfiguration JobAnalyticsWorkersDelayConfig = new JobAnalyticsConfiguration()
    {
        NormalDataSet = "job_runs",
        NormalDataSetRunStatusFilter = "Deployed",
        ThirtyMinDataSet = "job_runs_mv_30_mins",
        TwelthHourDataSet = "job_runs_mv_12_hours",
        ColumnNames = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "response_latency" },
        },
        ColumnNamesAgg = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "min_run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "max_run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "avg_run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "quan_run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "min_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "max_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "avg_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "quan_response_latency" },
        }
    };
    public static JobAnalyticsConfiguration JobAnalyticsAIConfig = new JobAnalyticsConfiguration()
    {
        NormalDataSet = "job_runs_ai",
        NormalDataSetRunStatusFilter = "Success",
        ThirtyMinDataSet = "job_runs_ai_mv_30_mins",
        TwelthHourDataSet = "job_runs_ai_mv_12_hours",
        ColumnNames = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "average_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "average_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "average_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "average_response_latency" },
        },
        ColumnNamesAgg = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "min_run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "max_run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "avg_run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "quan_run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "min_average_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "max_average_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "avg_average_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "quan_average_response_latency" },
        }
    };

    public static JobAnalyticsConfiguration JobAnalyticsPerfConfig = new JobAnalyticsConfiguration()
    {
        NormalDataSet = "job_runs_perf",
        NormalDataSetRunStatusFilter = "Success",
        ThirtyMinDataSet = "job_runs_perf_mv_30_mins",
        TwelthHourDataSet = "job_runs_perf_mv_12_hours",
        ColumnNames = new Dictionary<JobAnalyticsRequestOptions, string>()
        {

            { JobAnalyticsRequestOptions.MinResponseLatency, "average_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "average_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "average_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "average_response_latency" },
        },
        ColumnNamesAgg = new Dictionary<JobAnalyticsRequestOptions, string>()
        {

            { JobAnalyticsRequestOptions.MinResponseLatency, "min_average_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "max_average_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "avg_average_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "quan_average_response_latency" },
        }
    };

    public async Task<Result<DataResponse<NormalJobAnalyticsDTO>>> GetJobAnalytics(string jobName, DateTime startDateTime, DateTime endDateTime, JobAnalyticsRequestOptions options, CancellationToken token, int maxPoints = 100)
    {
        var tryValidate = ValidateParams(startDateTime, endDateTime, options, maxPoints);
        if (tryValidate.IsFailed)
            return Result.Fail(tryValidate.Errors.First());

        var tryGetJobInternalName = await _cacheSingletonService.GetInternalJobName(jobName, token);
        if (tryGetJobInternalName == null)
            return Result.Fail(new ErrorResponse(404,
                "Could not find job", "job_not_found"));

        var getJobType = await _cacheSingletonService.GetJobTypeFromName(tryGetJobInternalName, token);

        var getCurrentJobStatusTask = _genericServersContext.JobData.FirstOrDefaultAsync(job => job.InternalJobName == tryGetJobInternalName, token);

        Task<NormalJobAnalytics> getAnalyticsTask = null;

        if (getJobType?.Equals("AI", StringComparison.OrdinalIgnoreCase) ?? false) 
            getAnalyticsTask =  _clickhouseService.GetNormalJobAnalytics(tryGetJobInternalName, startDateTime, endDateTime, JobAnalyticsAIConfig, maxPoints, options, token);
        else if (getJobType?.Equals("Perf", StringComparison.OrdinalIgnoreCase) ?? false)
            getAnalyticsTask = _clickhouseService.GetNormalJobAnalytics(tryGetJobInternalName, startDateTime, endDateTime, JobAnalyticsPerfConfig, maxPoints, options, token);
        else 
            getAnalyticsTask = _clickhouseService.GetNormalJobAnalytics(tryGetJobInternalName, startDateTime, endDateTime, JobAnalyticsWorkersDelayConfig, maxPoints, options, token);
        await Task.WhenAll(getAnalyticsTask, getCurrentJobStatusTask);
        var getCurrentJobStatus = getCurrentJobStatusTask.Result;
        var getAnalytics = getAnalyticsTask.Result;


        if (getCurrentJobStatus is { CurrentRunStatus: not null } and { CurrentRunStatus: "Undeployed", CurrentRunLengthMs: not null, CurrentRunTime: not null } && endDateTime > getCurrentJobStatus.CurrentRunTime)
        {
            getAnalytics.Points.Add(JobDataFromOptions(getCurrentJobStatus, options));
        }
        return new DataResponse<NormalJobAnalyticsDTO>(new NormalJobAnalyticsDTO(getAnalytics, tryGetJobInternalName));

    }

    public static JobAnalyticsConfiguration JobLocationAnalyticsWorkersDelayConfig = new JobAnalyticsConfiguration()
    {
        NormalDataSet = "job_runs_locations",
        ThirtyMinDataSet = "job_runs_locations_mv_30_mins",
        TwelthHourDataSet = "job_runs_locations_mv_12_hours",
        ColumnNames = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "response_latency" },
        },
        ColumnNamesAgg = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "min_run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "max_run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "avg_run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "quan_run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "min_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "max_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "avg_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "quan_response_latency" },
        }
    };
    public static JobAnalyticsConfiguration JobLocationAnalyticsAIConfig = new JobAnalyticsConfiguration()
    {
        NormalDataSet = "job_runs_locations_ai",
        ThirtyMinDataSet = "job_runs_locations_ai_mv_30_mins",
        TwelthHourDataSet = "job_runs_locations_ai_mv_12_hours",
        ColumnNames = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "response_latency" },
        },
        ColumnNamesAgg = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "min_run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "max_run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "avg_run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "quan_run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "min_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "max_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "avg_response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "quan_response_latency" },
        }
    };

    public static JobAnalyticsConfiguration JobLocationAnalyticsPerfConfig = new JobAnalyticsConfiguration()
    {
        NormalDataSet = "job_runs_locations_perf",
        ThirtyMinDataSet = "job_runs_locations_perf_mv_30_mins",
        TwelthHourDataSet = "job_runs_locations_perf_mv_12_hours",
        ColumnNames = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "response_latency" },
            { JobAnalyticsRequestOptions.MedianResponseLatency, "response_latency" },
        },
        ColumnNamesAgg = new Dictionary<JobAnalyticsRequestOptions, string>()
        {
            { JobAnalyticsRequestOptions.MinRunLength, "min_run_length" },
            { JobAnalyticsRequestOptions.MaxRunLength, "max_run_length" },
            { JobAnalyticsRequestOptions.AvgRunLength, "avg_run_length" },
            { JobAnalyticsRequestOptions.MedianRunLength, "quan_run_length" },
            { JobAnalyticsRequestOptions.MinResponseLatency, "min_response_latency" },
            { JobAnalyticsRequestOptions.MaxResponseLatency, "max_response_latency" },
            { JobAnalyticsRequestOptions.AvgResponseLatency, "avg_response_latency" }, 
            { JobAnalyticsRequestOptions.MedianResponseLatency, "quan_response_latency" },
        }
    };



    public async Task<Result<DataResponse<NormalJobLocationAnalyticsDTO>>> GetJobAnalyticsLocation(string jobName, string locationName, DateTime startDateTime, DateTime endDateTime, JobAnalyticsRequestOptions options, CancellationToken token, int maxPoints = 100)
    {
        var tryValidate = ValidateParams(startDateTime, endDateTime, options, maxPoints);
        if (tryValidate.IsFailed)
            return Result.Fail(tryValidate.Errors.First());

        if (await _cacheSingletonService.DoesLocationExist(locationName, token) == false)
            return Result.Fail(new ErrorResponse(404,
                "Could not find location", "location_not_found"));

        var tryGetJobInternalName = await _cacheSingletonService.GetInternalJobName(jobName, token);
        if (tryGetJobInternalName == null)
            return Result.Fail(new ErrorResponse(404,
                "Could not find job", "job_not_found"));

        var getJobType = await _cacheSingletonService.GetJobType(tryGetJobInternalName, token);




        Task<NormalJobAnalytics> tryGetAnalytics = null;

        if (getJobType.Equals("AI", StringComparison.OrdinalIgnoreCase))
            tryGetAnalytics = _clickhouseService.GetNormalJobLocationAnalytics(tryGetJobInternalName, locationName, startDateTime, endDateTime, JobLocationAnalyticsAIConfig, maxPoints, options, token);
        else if (getJobType.Equals("Perf", StringComparison.OrdinalIgnoreCase))
            tryGetAnalytics = _clickhouseService.GetNormalJobLocationAnalytics(tryGetJobInternalName, locationName, startDateTime, endDateTime, JobLocationAnalyticsPerfConfig, maxPoints, options, token);
        else
            tryGetAnalytics = _clickhouseService.GetNormalJobLocationAnalytics(tryGetJobInternalName, locationName, startDateTime, endDateTime, JobLocationAnalyticsWorkersDelayConfig, maxPoints, options, token);

        var getAnalytics = await tryGetAnalytics;

        return new DataResponse<NormalJobLocationAnalyticsDTO>(new NormalJobLocationAnalyticsDTO(getAnalytics, locationName, tryGetJobInternalName));
    }
}