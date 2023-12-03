using Action_Delay_API.Models.Responses;
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
public class CompatibleJobanalyticsController : ControllerBase
{
    private readonly ActionDelayDatabaseContext _genericServersContext;
    private readonly IClickHouseService _clickHouseService;
    private readonly ILogger _logger;


    public CompatibleJobanalyticsController(ActionDelayDatabaseContext serversContext, IClickHouseService clickHouseService,
        ILogger<CacheJobController> logger)
    {
        _genericServersContext = serversContext;
        _clickHouseService = clickHouseService;
        _logger = logger;
    }


    // GET: api/<ScrapeJobController>
    [HttpGet("CompatibleWorkerScriptDeploymentAnalytics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

    public async Task<ActionResult<IResponse>> CompatibleWorkerScriptDeploymentAnalytics(CancellationToken token)
    {
        var getClickHouseData = await _clickHouseService.GetCompatibleDeploymentStatistics(token);
        var getCurrentJobStatus =
            await _genericServersContext.JobData.FirstOrDefaultAsync(job => job.JobName == "Worker Script Delay Job", token);
        if (getCurrentJobStatus is { CurrentRunStatus: not null } and { CurrentRunStatus: "Undeployed", CurrentRunLengthMs: not null, CurrentRunTime: not null })
        {
            getClickHouseData.Add(new DeploymentStatistic()
            {
                Deployed = "False",
                RunLength = getCurrentJobStatus.CurrentRunLengthMs.Value,
                RunTime = (ulong)new DateTimeOffset(getCurrentJobStatus.CurrentRunTime.Value).ToUnixTimeMilliseconds(),
                Time = new DateTimeOffset(getCurrentJobStatus.CurrentRunTime.Value).ToUnixTimeMilliseconds().ToString(),
            });
        }
        return Ok(getClickHouseData);
    }
    // GET: api/<ScrapeJobController>
    [HttpGet("CompatibleWorkerScriptDeploymentCurrentRun")]
    [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

    public async Task<ActionResult<IResponse>> CompatibleWorkerScriptDeploymentCurrentRun(CancellationToken token)
    {
        return Ok(await _genericServersContext.JobData.FirstOrDefaultAsync(
            job => job.JobName == "Worker Script Delay Job", token));

    }

}