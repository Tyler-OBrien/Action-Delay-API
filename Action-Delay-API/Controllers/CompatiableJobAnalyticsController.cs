using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.CompatiableJobAnalytics;
using Action_Delay_API.Models.Services;
using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Controllers;

[Route("v1/compat")]
[ApiController]
[SwaggerResponse(400, Type = typeof(ErrorResponseDetails<object>), Description = "On request failure, an object will be returned indicating what part of your request is invalid. Optionally includes details object of type BadRequestObjectResult.")]
[SwaggerResponse(404, Type = typeof(ErrorResponse), Description = "On invalid route, an object will be returned indicating the invalid route.")]
[SwaggerResponse(500, Type = typeof(ErrorResponse), Description = "On an internal server error, an object will be returned indicating the server error.")]
[SwaggerResponse(405, Type = typeof(ErrorResponse), Description = "On an invalid request method,  an object will be returned indicating the wrong request method.")]
[SwaggerResponse(429, Type = typeof(ErrorResponse), Description = "On hitting a rate limit, a rate limit response will be returned.")]
public class CompatibleJobAnalyticsController : ControllerBase
{

    private readonly ILogger _logger;
    private readonly ICompatibleJobAnalyticsService _compatibleJobAnalyticsService;



    public CompatibleJobAnalyticsController(ICompatibleJobAnalyticsService compatibleJobAnalyticsService, 
        ILogger<CacheJobController> logger)
    {
        _logger = logger;
        _compatibleJobAnalyticsService = compatibleJobAnalyticsService;
    }


    // GET: api/<ScrapeJobController>
    [HttpGet("CompatibleWorkerScriptDeploymentAnalytics")]
    [SwaggerResponse(200, Type = typeof(DeploymentStatisticResponse[]), Description = "On success, return analytics")]

    public async Task<IActionResult> CompatibleWorkerScriptDeploymentAnalytics(CancellationToken token)
    {
        return (await _compatibleJobAnalyticsService.CompatibleWorkerScriptDeploymentAnalytics(token)).MapToResult();
    }
    // GET: api/<ScrapeJobController>
    [HttpGet("CompatibleWorkerScriptDeploymentCurrentRun")]
    [SwaggerResponse(200, Type = typeof(JobDataResponse), Description = "On success, return job")]

    public async Task<IActionResult> CompatibleWorkerScriptDeploymentCurrentRun(CancellationToken token)
    {
        return (await _compatibleJobAnalyticsService.CompatibleWorkerScriptDeploymentCurrentRun(token)).MapToResult();

    }

}