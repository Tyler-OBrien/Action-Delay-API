using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Errors;
using System.Xml.Linq;
using System.Text.Json.Serialization;
using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.Services.v2;

namespace Action_Delay_API.Services.v2
{
    

    public class ExternalJobService : IExternalJobService
    {
        private readonly ActionDelayDatabaseContext _genericServersContext;
        private readonly IClickHouseService _clickHouseService;

        private readonly ILogger _logger;

        public ExternalJobService(ActionDelayDatabaseContext genericServersContext, ILogger<ExternalJobService> logger, IClickHouseService clickhouseService)
        {
            _clickHouseService = clickhouseService;
            _genericServersContext = genericServersContext;
            _logger = logger;
        }

        public async Task<Result<DataResponse<bool>>> SendJobResult(JobResultRequestDTO jobRequest, int coloId, CancellationToken token)
        {
            var tryGetJob = await _genericServersContext.JobData.FirstOrDefaultAsync(job => job.InternalJobName == jobRequest.InternalJobName, token);
            if (tryGetJob == null)
            {
                tryGetJob = new JobData();
                tryGetJob.InternalJobName = jobRequest.InternalJobName;
                tryGetJob.JobName = jobRequest.JobName;
                _genericServersContext.JobData.Add(tryGetJob);
            }
            else
            {
                tryGetJob.LastRunStatus = tryGetJob.CurrentRunStatus;
                tryGetJob.LastRunLengthMs = tryGetJob.CurrentRunLengthMs;
                tryGetJob.LastRunTime = tryGetJob.CurrentRunTime;

                if (jobRequest.CalculateRunLengthFromLastTime)
                {
                    var getRunLength = (jobRequest.RunTime - tryGetJob.LastRunTime.Value).TotalMilliseconds;
                    if (getRunLength > 0)
                        jobRequest.RunLengthMs = (ulong)getRunLength;
                }
            }

            if (jobRequest.CalculateColoIdFromRequestHeader)
            {
                jobRequest.ColoId = coloId;
            }

            tryGetJob.CurrentRunLengthMs = jobRequest.RunLengthMs;
            tryGetJob.CurrentRunStatus = jobRequest.RunStatus;
            tryGetJob.CurrentRunTime = jobRequest.RunTime;

            try
            {
                await _clickHouseService.InsertRun(
                    new ClickhouseJobRun()
                    {
                        JobName = jobRequest.JobName,
                        RunStatus = jobRequest.RunStatus,
                        RunLength = jobRequest.RunLengthMs,
                        RunTime = jobRequest.RunTime,
                        ResponseLatency = jobRequest.APIResponseLatency ?? 0,
                    }, new List<ClickhouseJobLocationRun>(), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{jobName}: Error inserting run failure for error cause: {errorCause}", jobRequest.JobName, ex.Message);

                return Result.Fail(new ErrorResponse(500,
                    "Internal Error on inserting into Clickhouse", "internal_error"));
            }
            try
            {
                await _genericServersContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving run status for {jobName}", jobRequest.JobName);
                return Result.Fail(new ErrorResponse(500,
                    "Internal Error on inserting into database", "internal_error"));
            }

            return new DataResponse<bool>(true);
        }

    }
}
