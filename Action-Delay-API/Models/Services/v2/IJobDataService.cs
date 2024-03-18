using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using FluentResults;

namespace Action_Delay_API.Models.Services.v2
{
    public interface IJobDataService
    {

        public Task<Result<DataResponse<JobDataResponse[]>>> GetJobs(CancellationToken token);
        public Task<Result<DataResponse<JobDataResponse>>> GetJob(string jobName, CancellationToken token);
    }
}
