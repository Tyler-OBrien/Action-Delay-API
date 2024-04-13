using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Jobs;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/jobs")]

public class JobController : CustomBaseController
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
    [SwaggerResponseExample(200, typeof(JobDataArrayResponseExample))]
    public async Task<IActionResult> GetJobs(CancellationToken token)
    {
        return (await _jobDataService.GetJobs(token)).MapToResult();
    }

    [HttpGet("{jobName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobDataResponse>),
        Description = "On success, return a list of all known jobs")]
    [SwaggerResponseExample(200, typeof(JobDataResponseExample))]

    public async Task<IActionResult> GetJob(string jobName, CancellationToken token)
    {
        return (await _jobDataService.GetJob(jobName, token)).MapToResult();
    }

    [HttpGet("{jobName}/streamdeck")]
    [SwaggerResponse(200, Type = typeof(DataResponse<StreamDeckResponseDTO>),
        Description = "On success, return the simple text of the predicted response")]
    [SwaggerResponseExample(200, typeof(StreamDeckResponseResponseExample))]

    public async Task<IActionResult> GetStreamDeck(string jobName, CancellationToken token)
    {
        return (await _jobDataService.GetStreamDeckData(jobName, token)).MapToResult();
    }

    [HttpGet("{jobName}/locations")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobLocationDataResponse[]>),
        Description = "On success, return a list of all location statuses for this job")]
    [SwaggerResponseExample(200, typeof(JobLocationDataArrayResponseExample))]

    public async Task<IActionResult> GetJobLocations(string jobName, CancellationToken token)
    {
        return (await _jobLocationDataService.GetLocationJobData(jobName, token)).MapToResult();
    }

    [HttpGet("{jobName}/locations/{locationName}")]
    [SwaggerResponse(200, Type = typeof(DataResponse<JobLocationDataResponse>),

        Description = "On success, return the location's status for this job")]
    [SwaggerResponseExample(200, typeof(JobLocationDataResponseExample))]

    public async Task<IActionResult> GetJobLocation(string jobName, string locationName, CancellationToken token)
    {
        return (await _jobLocationDataService.GetLocationsJobData(jobName, locationName, token)).MapToResult();
    }
}