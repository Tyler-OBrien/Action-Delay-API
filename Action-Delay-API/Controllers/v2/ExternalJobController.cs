using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Local;
using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.Services.v2;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Controllers.v2;

[Route("v2/externaljob")]
[ApiExplorerSettings(IgnoreApi = true)]
public class ExternalJobController : CustomBaseController
{
    private readonly IExternalJobService _externalJobService;
    private readonly ILogger _logger;
    private readonly APIConfig _apiConfig;


    public ExternalJobController(IExternalJobService externalJobService,
        ILogger<ExternalJobController> logger, IOptions<APIConfig> apiConfig)
    {
        _externalJobService = externalJobService;
        _logger = logger;
        _apiConfig = apiConfig.Value;
    }


    private Result<bool> CheckAccess()
    {
        if (this.HttpContext.Request.Headers.TryGetValue("APIKEY", out var apiKeyValue) == false)
        {
            return Result.Fail(new ErrorResponse(401, $"No APIKEY Header", "no_apikey_header"));
        }

        if (String.IsNullOrWhiteSpace(apiKeyValue) ||
            apiKeyValue.ToString().Equals(_apiConfig.ExternalJobAPIKey, StringComparison.Ordinal) == false)
        {
            return Result.Fail(new ErrorResponse(401, $"Invalid API Key.", "invalid_api_key"));
        }
        return true;
    }


[HttpPost("SendJobResult")]
    [SwaggerResponse(200, Type = typeof(DataResponse<bool>),
        Description = "On success, return a boolean indicating success")]

    public async Task<IActionResult> SendJobResult([FromBody] JobResultRequestDTO jobResult, CancellationToken token)
    {
        var tryApiKey = CheckAccess();
        if (tryApiKey.IsFailed)
        {
            return tryApiKey.MapToResult();
        }

        int coloId = 0; 
        if (this.HttpContext.Request.Headers.TryGetValue("colo", out var coloCode) && String.IsNullOrWhiteSpace(coloCode) == false &&
                int.TryParse(coloCode, out var foundColoId))
        {
            coloId = foundColoId;
        }

        return (await _externalJobService.SendJobResult(jobResult, coloId, token)).MapToResult();
    }


    [HttpPost("IngestMetrics")]
    [SwaggerResponse(200, Type = typeof(DataResponse<bool>),
        Description = "On success, return a boolean indicating success")]

    public async Task<IActionResult> IngestMetrics([FromBody] GenericDataIngestDTO jobResult, CancellationToken token)
    {
        var tryApiKey = CheckAccess();
        if (tryApiKey.IsFailed)
        {
            return tryApiKey.MapToResult();
        }



        return (await _externalJobService.IngestGenericMetric(jobResult, token)).MapToResult();
    }

    

}