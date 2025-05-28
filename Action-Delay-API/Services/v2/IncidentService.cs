using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API.Models.API.Responses.DTOs.v2;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services.v2
{
    public class IncidentService : IIncidentService
    {
        private readonly ICacheSingletonService _cacheSingletonService;
        private readonly ActionDelayDatabaseContext _genericServersContext;

        private readonly ILogger _logger;


        public IncidentService(ActionDelayDatabaseContext genericServersContext, ILogger<IncidentService> logger,
            ICacheSingletonService cacheSingletonService)
        {
            _cacheSingletonService = cacheSingletonService;
            _genericServersContext = genericServersContext;
            _logger = logger;
        }


        public async Task<Result<DataResponse<IncidentDataResponse[]>>> GetActiveIncidents(string type, CancellationToken token)
        {

            //var tryGetResolvedType = await _cacheSingletonService.GetJobType(type, token);

            return new DataResponse<IncidentDataResponse[]>((await _genericServersContext.Incidents.Where(inc => inc.Type == type && inc.Active).ToListAsync(token))
                .Select(IncidentDataResponse.FromIncident).ToArray());
        }

    }
}
