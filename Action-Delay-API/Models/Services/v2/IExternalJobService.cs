using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Services.v2;
using FluentResults;

namespace Action_Delay_API.Models.Services.v2
{
    public interface IExternalJobService
    {
        public Task<Result<DataResponse<bool>>> IngestGenericMetric(GenericDataIngestDTO jobRequest,
            CancellationToken token);
        public Task<Result<DataResponse<bool>>> SendJobResult(JobResultRequestDTO jobRequest, int coloId,
            CancellationToken token);

    }
}
