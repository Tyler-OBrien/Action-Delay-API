using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.QuickAnalytics;
using Action_Delay_API.Models.Services;
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


        private readonly ILogger _logger;

        public QuickAPIService(ActionDelayDatabaseContext genericServersContext, ILogger<QuickAPIService> logger, IClickHouseService _clickhouseService)
        {
            _genericServersContext = genericServersContext;
            _clickHouseService = _clickhouseService;
            _logger = logger;
        }
        // GET: api/<ScrapeJobController>
        [HttpGet("QuickAnalytics/{jobName}")]
        [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

        public async Task<Result<QuickAnalyticsResponse[]>> CompatibleWorkerScriptDeploymentAnalytics(string jobName, CancellationToken token)
        {
            return (await _clickHouseService.GetQuickAnalytics(jobName, token)).Select(api => new QuickAnalyticsResponse()
            {
                MedianRunLength = api.MedianRunLength,
                Period = api.Period,
            }).ToArray();
        }
        // GET: api/<ScrapeJobController>
        [HttpGet("CurrentInfo/{jobName}")]
        [SwaggerResponse(200, Type = typeof(DataResponse<List<Location>>), Description = "On success")]

        public async Task<Result<JobDataResponse>> CompatibleWorkerScriptDeploymentCurrentRun(string jobName, CancellationToken token)
        {
            var tryGetJob = await _genericServersContext.JobData.FirstOrDefaultAsync(
                job => job.JobName == jobName, token);

            if (tryGetJob == null)
            {
                return Result.Fail(new ErrorResponse(404,
                    $"Could not find job", "job_not_found"));
            }
            return JobDataResponse.FromJobData(tryGetJob);

        }
    }
}
