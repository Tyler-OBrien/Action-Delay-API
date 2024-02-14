using Action_Delay_API.Models.Responses;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Controllers;

[Route("v1/quick")]
[ApiController]
[SwaggerResponse(400, Type = typeof(ErrorResponseDetails<object>), Description = "On request failure, an object will be returned indicating what part of your request is invalid. Optionally includes details object of type BadRequestObjectResult.")]
[SwaggerResponse(404, Type = typeof(ErrorResponse), Description = "On invalid route, an object will be returned indicating the invalid route.")]
[SwaggerResponse(500, Type = typeof(ErrorResponse), Description = "On an internal server error, an object will be returned indicating the server error.")]
[SwaggerResponse(405, Type = typeof(ErrorResponse), Description = "On an invalid request method,  an object will be returned indicating the wrong request method.")]
[SwaggerResponse(429, Type = typeof(ErrorResponse), Description = "On hitting a rate limit, a rate limit response will be returned.")]
public class QuickApiController : ControllerBase
{
    private readonly ActionDelayDatabaseContext _genericServersContext;
    private readonly IClickHouseService _clickHouseService;
    private readonly ILogger _logger;


    public QuickApiController(ActionDelayDatabaseContext serversContext, IClickHouseService clickHouseService,
        ILogger<CacheJobController> logger)
    {
        _genericServersContext = serversContext;
        _clickHouseService = clickHouseService;
        _logger = logger;
    }


    // GET: api/<ScrapeJobController>
    [HttpGet("QuickAnalytics/{jobName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

    public async Task<ActionResult<IResponse>> CompatibleWorkerScriptDeploymentAnalytics(string jobName, CancellationToken token)
    {
        return Ok(await _clickHouseService.GetQuickAnalytics(jobName, token));
    }
    // GET: api/<ScrapeJobController>
    [HttpGet("CurrentInfo/{jobName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

    public async Task<ActionResult<IResponse>> CompatibleWorkerScriptDeploymentCurrentRun(string jobName, CancellationToken token)
    {
        return Ok(await _genericServersContext.JobData.FirstOrDefaultAsync(
            job => job.JobName == jobName, token));

    }

}