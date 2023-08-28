using Action_Delay_API.Models.Responses;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Controllers;

[Route("v1/cache")]
[ApiController]
[SwaggerResponse(400, Type = typeof(ErrorResponseDetails<object>), Description = "On request failure, an object will be returned indicating what part of your request is invalid. Optionally includes details object of type BadRequestObjectResult.")]
[SwaggerResponse(404, Type = typeof(ErrorResponse), Description = "On invalid route, an object will be returned indicating the invalid route.")]
[SwaggerResponse(500, Type = typeof(ErrorResponse), Description = "On an internal server error, an object will be returned indicating the server error.")]
[SwaggerResponse(405, Type = typeof(ErrorResponse), Description = "On an invalid request method,  an object will be returned indicating the wrong request method.")]
[SwaggerResponse(429, Type = typeof(ErrorResponse), Description = "On hitting a rate limit, a rate limit response will be returned.")]
public class CacheJobController : ControllerBase
{
    private readonly ActionDelayDatabaseContext _genericServersContext;
    private readonly ILogger _logger;


    public CacheJobController(ActionDelayDatabaseContext serversContext,
        ILogger<CacheJobController> logger)
    {
        _genericServersContext = serversContext;
        _logger = logger;
    }


    // GET: api/<ScrapeJobController>
    [HttpGet]
    [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

    public async Task<ActionResult<IResponse>> Get(CancellationToken token)
    {
        return Ok(((await _genericServersContext.GenericJobData.AsNoTracking().FirstOrDefaultAsync(jobData => jobData.JobName == "Single URL Purge Delay Job", cancellationToken: token))?.Value ?? ""));
    }

}