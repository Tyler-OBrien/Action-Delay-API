using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/locations")]
public class LocationController : CustomBaseController
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
    [SwaggerResponseExample(200, typeof(LocationArrayDataResponseExample))]

    public async Task<IActionResult> GetLocations(CancellationToken token)
    {
        return (await _locationData.GetLocations(token)).MapToResult();
    }

    [HttpGet("{locationName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<LocationDataResponse>),
        Description = "On success, return the specified location")]
    [SwaggerResponseExample(200, typeof(LocationDataResponseExample))]

    public async Task<IActionResult> GetLocations(string locationName, CancellationToken token)
    {
        return (await _locationData.GetLocation(locationName, token)).MapToResult();
    }
}