using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.Services;
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
    private readonly ILogger _logger;
    private readonly ICacheJobService _cacheJobService;



    public CacheJobController(ICacheJobService cacheJobService,
        ILogger<CacheJobController> logger)
    {
        _logger = logger;
        _cacheJobService = cacheJobService;
    }


    // GET: api/<ScrapeJobController>
    [HttpGet]
    [SwaggerResponse(200, Type = typeof(string), Description = "Cache Testing Value including Date and GUID for Identification, used in Cache Delay Job")]

    public async Task<IActionResult> Get(CancellationToken token)
    {
        return (await _cacheJobService.GetCacheValue(token)).MapToResult();
    }

}