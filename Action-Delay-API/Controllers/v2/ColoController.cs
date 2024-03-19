using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Colos;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/colos")]
public class ColoController : CustomBaseController
{
    private readonly IColoDataService _coloDataService;

    private readonly ILogger _logger;


    public ColoController(IColoDataService coloDataService,
        ILogger<ColoController> logger)
    {
        _coloDataService = coloDataService;
        _logger = logger;
    }


    [HttpGet("")]
    [SwaggerResponse(200, Type = typeof(DataResponse<ColoDataAPI[]>),
        Description = "On success, return a list of all known colos with all data")]
    [SwaggerResponseExample(200, typeof(ColoDataAPIExample))]

    public async Task<IActionResult> GetColos(CancellationToken token)
    {
        return (await _coloDataService.GetColos(token)).MapToResult();
    }


    [HttpGet("iata")]
    [SwaggerResponse(200, Type = typeof(DataResponse<ColoDataAPISimple[]>),
        Description = "On success, return a list of all known colos in simple format")]
    [SwaggerResponseExample(200, typeof(ColoDataAPISimpleExample))]

    public async Task<IActionResult> GetColosByIataList(CancellationToken token)
    {
        return (await _coloDataService.GetColosByIataList(token)).MapToResult();
    }

    [HttpGet("iataregion")]
    [SwaggerResponse(200, Type = typeof(DataResponse<Dictionary<string, string>>),
        Description = "On success, return a list of all known colos")]
    [SwaggerResponseExample(200, typeof(ColoIataRegionSample))]

    public async Task<IActionResult> GetColosRegionColoName(CancellationToken token)
    {
        return (await _coloDataService.GetColosRegionColoName(token)).MapToResult();
    }

    [HttpGet("idregion")]
    [SwaggerResponse(200, Type = typeof(DataResponse<Dictionary<int, string>>),
        Description = "On success, return a list of all known colos")]
    [SwaggerResponseExample(200, typeof(ColoIDRegionSample))]

    public async Task<IActionResult> GetColosRegionID(CancellationToken token)
    {
        return (await _coloDataService.GetColosRegionID(token)).MapToResult();
    }
}