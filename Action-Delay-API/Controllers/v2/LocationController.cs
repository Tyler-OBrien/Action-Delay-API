using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/locations")]
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
public class LocationController : ControllerBase
{
    private readonly ILocationDataService _locationData;
    private readonly ILogger _logger;


    public LocationController(ILocationDataService locationDataService,
        ILogger<LocationController> logger)
    {
        _locationData = locationDataService;
        _logger = logger;
    }


    [HttpGet("")]
    [SwaggerResponse(200, Type = typeof(DataResponse<LocationDataResponse[]>),
        Description = "On success, return a list of all known locations with all details")]
    public async Task<IActionResult> GetLocations(CancellationToken token)
    {
        return (await _locationData.GetLocations(token)).MapToResult();
    }

    [HttpGet("{locationName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<LocationDataResponse>),
        Description = "On success, return the specified location")]
    public async Task<IActionResult> GetLocations(string locationName, CancellationToken token)
    {
        return (await _locationData.GetLocation(locationName, token)).MapToResult();
    }
}