using Action_Delay_API.Extensions;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs.v2;
using Action_Delay_API.Models.Services.v2;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Controllers.v2
{
    [Route("v2/incidents")]
    public class IncidentController : CustomBaseController
    {
        private readonly IIncidentService _incidentService;
        private readonly ILogger _logger;


        public IncidentController(IIncidentService incidentService,
            ILogger<IncidentController> logger)
        {
            _incidentService = incidentService;
            _logger = logger;
        }


        [HttpGet("type/{type}")]
        [SwaggerResponse(200, Type = typeof(DataResponse<IncidentDataResponse[]>),
            Description = "On success, return a list of all known active incidents")]
        [SwaggerResponseExample(200, typeof(IncidentDataArrayResponseExample))]
        public async Task<IActionResult> GetActiveIncidents(string type, CancellationToken token)
        {
            return (await _incidentService.GetActiveIncidents(type, token)).MapToResult();
        }


    }
}
