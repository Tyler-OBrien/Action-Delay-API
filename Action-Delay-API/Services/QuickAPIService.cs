using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.QuickAnalytics;
using Action_Delay_API.Models.Services;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Action_Delay_API.Services
{
    public class QuickAPIService : IQuickAPIService
    {

        private readonly ActionDelayDatabaseContext _genericServersContext;
        private readonly IClickHouseService _clickHouseService;
        private readonly ICacheSingletonService _cacheSingletonService;


        private readonly ILogger _logger;

        public QuickAPIService(ActionDelayDatabaseContext genericServersContext, ILogger<QuickAPIService> logger, IClickHouseService _clickhouseService, ICacheSingletonService cacheSingletonService)
        {
            _genericServersContext = genericServersContext;
            _clickHouseService = _clickhouseService;
            _cacheSingletonService = cacheSingletonService;
            _logger = logger;
        }


        public async Task<Result<QuickAnalyticsResponse[]>> CompatibleWorkerScriptDeploymentAnalytics(string jobName, CancellationToken token)
        {
            var tryGetJobInternalName = await _cacheSingletonService.GetInternalJobName(jobName, token);
            if (tryGetJobInternalName == null)
                return Result.Fail(new ErrorResponse(404,
                    "Could not find job", "job_not_found"));

            return (await _clickHouseService.GetQuickAnalytics(tryGetJobInternalName, token)).Select(api => new QuickAnalyticsResponse()
            {
                MedianRunLength = api.MedianRunLength,
                Period = api.Period,
            }).ToArray();
        }

        public async Task<Result<QuickAnalyticsResponse[]>> CompatibleWorkerScriptDeploymentAnalyticsByType(string jobType, CancellationToken token)
        {

            var tryGetCleanTyped = await _cacheSingletonService.GetJobType(jobType, token);
            var tryGetJobInternalName = await _cacheSingletonService.GetJobsByType(jobType, token);
            if (tryGetJobInternalName.Any() == false)
                return Result.Fail(new ErrorResponse(404,
                    "Could not find jobs by this type", "job_not_found"));

            return (await _clickHouseService.GetQuickAnalytics(tryGetCleanTyped, tryGetJobInternalName, token)).Select(api => new QuickAnalyticsResponse()
            {
                MedianRunLength = api.MedianRunLength,
                Period = api.Period,
                JobName = api.JobName,
            }).ToArray();
        }
        // GET: api/<ScrapeJobController>
        [HttpGet("CurrentInfo/{jobName}")]
        [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

        public async Task<Result<JobDataResponse>> CompatibleWorkerScriptDeploymentCurrentRun(string jobName, CancellationToken token)
        {
            var tryGetJobInternalName = await _cacheSingletonService.GetInternalJobName(jobName, token);
            if (tryGetJobInternalName == null)
                return Result.Fail(new ErrorResponse(404,
                    "Could not find job", "job_not_found"));

            var tryGetJob = await _genericServersContext.JobData.FirstOrDefaultAsync(
                job => job.InternalJobName == tryGetJobInternalName, token);

            if (tryGetJob == null)
            {
                return Result.Fail(new ErrorResponse(404,
                    $"Could not find job", "job_not_found"));
            }
            return JobDataResponse.FromJobData(tryGetJob);

        }
    }
}
