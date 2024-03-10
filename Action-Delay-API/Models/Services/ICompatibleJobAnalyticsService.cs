using Action_Delay_API.Models.API.Responses.DTOs.CompatiableJobAnalytics;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API_Core.Models.API.CompatAPI;
using FluentResults;

namespace Action_Delay_API.Models.Services
{
    public interface ICompatibleJobAnalyticsService
    { 
        Task<Result<DeploymentStatisticResponse[]>> CompatibleWorkerScriptDeploymentAnalytics(
            CancellationToken token);

        Task<Result<JobDataResponse>> CompatibleWorkerScriptDeploymentCurrentRun(CancellationToken token);
    }
}
