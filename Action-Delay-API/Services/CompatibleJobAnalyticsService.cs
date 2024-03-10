using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.CompatiableJobAnalytics;
using Action_Delay_API.Models.Services;
using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services
{
    public class CompatibleJobAnalyticsService : ICompatibleJobAnalyticsService
    {
        private readonly ActionDelayDatabaseContext _genericServersContext;
        private readonly IClickHouseService _clickHouseService;


        private readonly ILogger _logger;

        public CompatibleJobAnalyticsService(ActionDelayDatabaseContext genericServersContext, ILogger<CompatibleJobAnalyticsService> logger, IClickHouseService _clickhouseService)
        {
            _genericServersContext = genericServersContext;
            _clickHouseService = _clickhouseService;
            _logger = logger;
        }

        public async Task<Result<DeploymentStatisticResponse[]>> CompatibleWorkerScriptDeploymentAnalytics(CancellationToken token)
        {
            var getClickHouseData = await _clickHouseService.GetCompatibleDeploymentStatistics(token);
            var getCurrentJobStatus =
                await _genericServersContext.JobData.FirstOrDefaultAsync(job => job.JobName == "Worker Script Delay Job", token);
            if (getCurrentJobStatus is { CurrentRunStatus: not null } and { CurrentRunStatus: "Undeployed", CurrentRunLengthMs: not null, CurrentRunTime: not null })
            {
                getClickHouseData.Add(new DeploymentStatistic()
                {
                    Deployed = "False",
                    RunLength = getCurrentJobStatus.CurrentRunLengthMs.Value,
                    RunTime = (ulong)new DateTimeOffset(getCurrentJobStatus.CurrentRunTime.Value).ToUnixTimeMilliseconds(),
                    Time = new DateTimeOffset(getCurrentJobStatus.CurrentRunTime.Value).ToUnixTimeMilliseconds().ToString(),
                });
            }
            return getClickHouseData.Select(stat => new DeploymentStatisticResponse
            {
                Deployed = stat.Deployed,
                RunLength = stat.RunLength,
                RunTime = stat.RunTime,
                Time = stat.Time,
            }).ToArray();
        }
        public async Task<Result<JobDataResponse>> CompatibleWorkerScriptDeploymentCurrentRun(CancellationToken token)
        {
            var tryGetJob = await _genericServersContext.JobData.FirstOrDefaultAsync(
                job => job.JobName == "Worker Script Delay Job", token);

            if (tryGetJob == null)
            {
                return Result.Fail(new ErrorResponse(404,
                    $"Could not find job", "job_not_found"));
            }
            return JobDataResponse.FromJobData(tryGetJob);
        }
    }
}
