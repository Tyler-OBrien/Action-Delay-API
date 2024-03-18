using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/jobs")]
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
public class JobController : ControllerBase
{
    private readonly IJobDataService _jobDataService;
    private readonly ILocationDataService _jobLocationDataService;
    private readonly ILogger _logger;


    public JobController(IJobDataService jobDataService, ILocationDataService jobLocationData,
        ILogger<JobController> logger)
    {
        _jobDataService = jobDataService;
        _jobLocationDataService = jobLocationData;
        _logger = logger;
    }


    [HttpGet("")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobDataResponse[]>),
        Description = "On success, return a list of all known jobs")]
    public async Task<IActionResult> GetJobs(CancellationToken token)
    {
        return (await _jobDataService.GetJobs(token)).MapToResult();
    }

    [HttpGet("{jobName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobDataResponse[]>),
        Description = "On success, return a list of all known jobs")]
    public async Task<IActionResult> GetJob(string jobName, CancellationToken token)
    {
        return (await _jobDataService.GetJob(jobName, token)).MapToResult();
    }

    [HttpGet("{jobName}/locations")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobLocationDataResponse[]>),
        Description = "On success, return a list of all location statuses for this job")]
    public async Task<IActionResult> GetJobLocations(string jobName, CancellationToken token)
    {
        return (await _jobLocationDataService.GetLocationJobData(jobName, token)).MapToResult();
    }

    [HttpGet("{jobName}/locations/{locationName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobLocationDataResponse>),
        Description = "On success, return the location's status for this job")]
    public async Task<IActionResult> GetJobLocation(string jobName, string locationName, CancellationToken token)
    {
        return (await _jobLocationDataService.GetLocationsJobData(jobName, locationName, token)).MapToResult();
    }
}