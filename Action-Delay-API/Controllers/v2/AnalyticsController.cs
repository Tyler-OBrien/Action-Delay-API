using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Requests.DTOs.v2.Analytics;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using FluentResults;
using HarfBuzzSharp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Hybrid;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;
using System.Net;
using System.Xml.Linq;

namespace Action_Delay_API.Controllers.v2;



[Route("v2/jobs")]
public class AnalyticsController : CustomBaseController
{

    private readonly IAnalyticsService _analyticsService;
    private HybridCache _cache;
    private readonly ILogger _logger;


    public AnalyticsController(IAnalyticsService analyticsService, HybridCache cache,
        ILogger<AnalyticsController> logger)
    {
        _cache = cache;
        _analyticsService = analyticsService;
        _logger = logger;
    }



    public DateTime firstDayOfThisCentury = new DateTime(2000, 1, 1);
    private Result<JobAnalyticsRequestOptions> ProcessQueryParameters(AnalyticsQueryParams queryParams, bool metricsRequired = true)
    {
        if (queryParams.StartDateTime == null)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Start DateTime is required", "bad_query_param"));
        }

        if (queryParams.StartDateTime < firstDayOfThisCentury)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Start DateTime has to be sometime in the 20th Century", "bad_query_param"));
        }

        if (queryParams.EndDateTime == null)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "End DateTime is required", "bad_query_param"));
        }

        if (queryParams.EndDateTime < firstDayOfThisCentury)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "End DateTime has to be sometime in the 20th Century", "bad_query_param"));
        }


        if (String.IsNullOrWhiteSpace(queryParams.Metrics) && metricsRequired)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Query Params Metrics cannot be empty", "bad_query_param"));
        }

        if (queryParams.Metrics?.Length > 200)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Query Params Metrics too long", "bad_query_param"));
        }

        var newRequestOptions = JobAnalyticsRequestOptions.None;

        var splitMetrics = new HashSet<string>(queryParams?.Metrics?.Split(",") ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);

        if (splitMetrics.Contains("MinRunLength"))
            newRequestOptions |= JobAnalyticsRequestOptions.MinRunLength;

        if (splitMetrics.Contains("MaxRunLength"))
            newRequestOptions |= JobAnalyticsRequestOptions.MaxRunLength;

        if (splitMetrics.Contains("AvgRunLength"))
            newRequestOptions |= JobAnalyticsRequestOptions.AvgRunLength;

        if (splitMetrics.Contains("MedianRunLength"))
            newRequestOptions |= JobAnalyticsRequestOptions.MedianRunLength;

        if (splitMetrics.Contains("MinApiResponseLatency") || splitMetrics.Contains("MinEdgeResponseLatency"))
            newRequestOptions |= JobAnalyticsRequestOptions.MinResponseLatency;

        if (splitMetrics.Contains("MaxApiResponseLatency") || splitMetrics.Contains("MaxEdgeResponseLatency"))
            newRequestOptions |= JobAnalyticsRequestOptions.MaxResponseLatency;

        if (splitMetrics.Contains("AvgApiResponseLatency") || splitMetrics.Contains("AvgEdgeResponseLatency"))
            newRequestOptions |= JobAnalyticsRequestOptions.AvgResponseLatency;


        if (splitMetrics.Contains("MedianApiResponseLatency") || splitMetrics.Contains("MedianEdgeResponseLatency"))
            newRequestOptions |= JobAnalyticsRequestOptions.MedianResponseLatency;

        if (newRequestOptions == JobAnalyticsRequestOptions.None && metricsRequired)
        {
            return Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Query Params Metrics cannot be none/empty. ", "bad_query_param"));
        }

        return newRequestOptions;
    }


    /// <summary>
    /// Get Adaptively Sampled Job Analytics
    /// </summary>
    /// <param name="jobName"></param>
    /// <param name="queryParams"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("{jobName}/analytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<NormalJobAnalyticsDTO>),
        Description = "On success, return adaptively sampled job analytics with the requested metrics")]
    //[SwaggerResponseExample(200, typeof(JobDataResponseExample))]
    [SwaggerRequestExample(typeof(AnalyticsQueryParams), typeof(NormalJobAnalyticsRequestExample))]
    public async Task<IActionResult> GetJobAnalytics(string jobName, [FromQuery] AnalyticsQueryParams queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        return (await _analyticsService.GetJobAnalytics(jobName, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, tryGetRequestOptions.Value, token, queryParams.MaxPoints)).MapToResult();
    }


    /// <summary>
    /// Get Adaptively Sampled Job Error Analytics
    /// </summary>
    /// <param name="jobName"></param>
    /// <param name="queryParams"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("{jobName}/erroranalytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<ErrorJobAnalyticsDTO>),
        Description = "On success, return adaptively sampled job analytics with the requested metrics")]
    //[SwaggerResponseExample(200, typeof(JobDataResponseExample))]
    [SwaggerRequestExample(typeof(AnalyticsQueryParams), typeof(ErrorJobAnalyticsDTORequestExample))]
    public async Task<IActionResult> GetJobErrorAnalytics(string jobName, [FromQuery] AnalyticsQueryParams queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        return (await _analyticsService.GetErrorAnalyticsForJob(jobName, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, token, queryParams.MaxPoints)).MapToResult();
    }


    /// <summary>
    /// Get Adaptively Sampled Job Analytics
    /// </summary>
    /// <param name="jobName"></param>
    /// <param name="queryParams"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("analytics/type/{jobType}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<NormalJobAnalyticsDTO>),
        Description = "On success, return adaptively sampled job analytics with the requested metrics")]
    //[SwaggerResponseExample(200, typeof(JobDataResponseExample))]
    [SwaggerRequestExample(typeof(AnalyticsQueryParams), typeof(NormalJobAnalyticsRequestExample))]
    public async Task<IActionResult> GetJobAnalyticsByType(string jobType, [FromQuery] AnalyticsQueryParams queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams, false);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();



        return (await _analyticsService.GetJobAnalyticsByType(jobType, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, tryGetRequestOptions.Value, token, queryParams.MaxPoints)).MapToResult();
    }

    /// <summary>
    /// Get Adaptively Sampled Job Error Analytics
    /// </summary>
    /// <param name="jobName"></param>
    /// <param name="queryParams"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("erroranalytics/type/{jobType}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<ErrorJobAnalyticsDTO>),
        Description = "On success, return adaptively sampled job analytics with the requested metrics")]
    //[SwaggerResponseExample(200, typeof(JobDataResponseExample))]
    [SwaggerRequestExample(typeof(AnalyticsQueryParams), typeof(ErrorJobAnalyticsDTORequestExample))]
    public async Task<IActionResult> GetJobErrorAnalyticsByType(string jobType, [FromQuery] AnalyticsQueryParams queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        return (await _analyticsService.GetErrorAnalyticsForJobType(jobType, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, token, queryParams.MaxPoints)).MapToResult();
    }


    [HttpGet("{jobName}/locations/{locationName}/analytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<NormalJobLocationAnalyticsDTO>),

        Description = "On success, return adaptively sampled job analytics with the requested metrics and location")]
    //[SwaggerResponseExample(200, typeof(JobLocationDataResponseExample))]

    public async Task<IActionResult> GetJobLocationAnalytics(string jobName, string locationName, [FromQuery] AnalyticsQueryParamsLocations queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        return (await _analyticsService.GetJobAnalyticsLocation(jobName, locationName.ToUpper(), queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, tryGetRequestOptions.Value, token, queryParams.MaxPoints)).MapToResult();
    }

    [HttpGet("{jobName}/locations/region/{regionName}/analytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<NormalJobLocationAnalyticsDTO>),

        Description = "On success, return adaptively sampled job analytics with the requested metrics and location")]
    //[SwaggerResponseExample(200, typeof(JobLocationDataResponseExample))]

    public async Task<IActionResult> GetJobLocationAnalyticsByRegion(string jobName, string regionName, [FromQuery] AnalyticsQueryParamsLocations queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        return (await _analyticsService.GetJobAnalyticsLocationRegion(new []{ jobName }, regionName, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, tryGetRequestOptions.Value, token, queryParams.MaxPoints)).MapToResult();
    }

    // GetCountJobAnalyticsLocationRegionByRegion

    [HttpGet("{jobName}/locations/region/{regionName}/requestRoutingRegionAnalytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<RegionJobLocationAnalyticsDTO>),

        Description = "On success, return adaptively sampled job analytics with the requested metrics and location")]
    //[SwaggerResponseExample(200, typeof(JobLocationDataResponseExample))]

    public async Task<IActionResult> GetRequestRoutingRegionAnalytics(string jobName, string regionName, [FromQuery] AnalyticsQueryParamsLocations queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        if (Math.Abs((queryParams.EndDateTime!.Value - queryParams.StartDateTime!.Value).TotalDays) > 32)
            return (Result.Fail(new ErrorResponse(HttpStatusCode.UnprocessableEntity,
                "Currently, this endpoint is limited to one month for performance reasons", "bad_query_param"))).MapErrorToResult();


        return (await _analyticsService.GetCountJobAnalyticsLocationRegionByRegion(new[] { jobName }, regionName, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, tryGetRequestOptions.Value, token, queryParams.MaxPoints)).MapToResult();
    }


    [HttpGet("analytics/locations/region/{regionName}/{jobNames}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<NormalJobLocationAnalyticsDTO>),

        Description = "On success, return adaptively sampled job analytics with the requested metrics and location")]
    //[SwaggerResponseExample(200, typeof(JobLocationDataResponseExample))]

    public async Task<IActionResult> GetJobLocationAnalyticsByRegionMultiple(string regionName, string jobNames, [FromQuery] AnalyticsQueryParamsLocations queryParams, CancellationToken token)
    {
        var tryGetRequestOptions = ProcessQueryParameters(queryParams);

        if (tryGetRequestOptions.IsFailed)
            return tryGetRequestOptions.MapToResult();

        return (await _analyticsService.GetJobAnalyticsLocationRegion(jobNames.Split(","), regionName, queryParams.StartDateTime!.Value, queryParams.EndDateTime!.Value, tryGetRequestOptions.Value, token, queryParams.MaxPoints)).MapToResult();
    }


    /// <summary>
    /// Get Overall Analytics
    /// </summary>
    /// <param name="jobName"></param>
    /// <param name="queryParams"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("OverallAnalytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<OverallAnalyticsResponseDTO>),
        Description = "On success, return overall analytics")]
    //[SwaggerResponseExample(200, typeof(JobDataResponseExample))]
    public async Task<IActionResult> GetOverallAnalytics( CancellationToken token)
    {
        var entryOptions = new HybridCacheEntryOptions
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = TimeSpan.FromMinutes(5),
        };
        var response = await _cache.GetOrCreateAsync(
            $"GetOverallAnalytics", 
            async cancel =>
            {
                try
                {
                    return await _analyticsService.GetOverallAnalytics(cancel);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error resolving Overall Analytics");
                    throw;
                }
            },
            options: entryOptions,
            cancellationToken: token
        );


        return new OkObjectResult(response);
    }
}