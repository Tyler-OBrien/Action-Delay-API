using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using FluentResults;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Jobs;

namespace Action_Delay_API.Models.Services.v2
{
    public interface IJobDataService
    {

        public Task<Result<DataResponse<JobDataResponse[]>>> GetJobs(string type, CancellationToken token);
        public Task<Result<DataResponse<JobDataResponse>>> GetJob(string jobName, CancellationToken token);

        public Task<Result<DataResponse<StreamDeckResponseDTO>>> GetStreamDeckData(string jobName,
            CancellationToken token);

    }
}
