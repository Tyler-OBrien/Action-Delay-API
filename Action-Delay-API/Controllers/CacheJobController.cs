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
[ApiExplorerSettings(IgnoreApi = true)]
public class CacheJobController : CustomBaseController
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