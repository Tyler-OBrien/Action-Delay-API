using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Colos;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/colos")]
[ApiController]
[SwaggerResponse(400, Type = typeof(ErrorResponseDetails<object>),
    Description =
        "On request failure, an object will be returned indicating what part of your request is invalid. Optionally includes details object of type BadRequestObjectResult.")]
[SwaggerResponse(404, Type = typeof(ErrorResponse),
    Description = "On invalid route, an object will be returned indicating the invalid route.")]
[SwaggerResponse(500, Type = typeof(ErrorResponse),
    Description = "On an internal server error, an object will be returned indicating the server error.")]
[SwaggerResponse(405, Type = typeof(ErrorResponse),
    Description = "On an invalid request method,  an object will be returned indicating the wrong request method.")]
[SwaggerResponse(429, Type = typeof(ErrorResponse),
    Description = "On hitting a rate limit, a rate limit response will be returned.")]
public class ColoController : ControllerBase
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
    public async Task<IActionResult> GetColos(CancellationToken token)
    {
        return (await _coloDataService.GetColos(token)).MapToResult();
    }


    [HttpGet("iata")]
    [SwaggerResponse(200, Type = typeof(DataResponse<ColoDataAPISimple[]>),
        Description = "On success, return a list of all known colos in simple format")]
    public async Task<IActionResult> GetColosByIataList(CancellationToken token)
    {
        return (await _coloDataService.GetColosByIataList(token)).MapToResult();
    }

    [HttpGet("iataregion")]
    [SwaggerResponse(200, Type = typeof(DataResponse<Dictionary<string, string>>),
        Description = "On success, return a list of all known colos")]
    public async Task<IActionResult> GetColosRegionColoName(CancellationToken token)
    {
        return (await _coloDataService.GetColosRegionColoName(token)).MapToResult();
    }

    [HttpGet("idregion")]
    [SwaggerResponse(200, Type = typeof(DataResponse<Dictionary<int, string>>),
        Description = "On success, return a list of all known colos")]
    public async Task<IActionResult> GetColosRegionID(CancellationToken token)
    {
        return (await _coloDataService.GetColosRegionID(token)).MapToResult();
    }
}