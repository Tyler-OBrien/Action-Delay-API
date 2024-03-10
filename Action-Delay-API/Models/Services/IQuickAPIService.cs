using Action_Delay_API.Models.API.Responses.DTOs.QuickAnalytics;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API_Core.Models.Local;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Models.Services
{
    public interface IQuickAPIService
    {
        public Task<Result<QuickAnalyticsResponse[]>> CompatibleWorkerScriptDeploymentAnalytics(string jobName,
            CancellationToken token);

        public Task<Result<JobDataResponse>> CompatibleWorkerScriptDeploymentCurrentRun(string jobName,
            CancellationToken token);
    }
}
