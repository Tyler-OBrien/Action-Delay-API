using Action_Delay_API.Models.API.Responses.DTOs.v2;
using Action_Delay_API.Models.API.Responses;
using FluentResults;

namespace Action_Delay_API.Models.Services.v2
{
    public interface IIncidentService
    {
        public Task<Result<DataResponse<IncidentDataResponse[]>>> GetActiveIncidents(string type, CancellationToken token);

    }
}
