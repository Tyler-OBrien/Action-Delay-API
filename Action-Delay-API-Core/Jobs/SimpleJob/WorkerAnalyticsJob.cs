using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Jobs.SimpleJob
{
    public class WorkerAnalyticsJob : BaseJob
    {
        public WorkerAnalyticsJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkerAnalyticsJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
        {
        }
        public override int TargetExecutionSecond => 29;
        public override bool Enabled => _config.WorkerAnalyticsDelayJob != null && (_config.WorkerAnalyticsDelayJob.Enabled.HasValue == false || _config.WorkerAnalyticsDelayJob is { Enabled: true });
        public override async Task RunAction()
        {
            // depends on plan, maybe shouldn't be hardcoded?
            var datetimeGreaterThan = DateTime.UtcNow.AddDays(-25);


            var tryGetAnalytic = await _apiBroker.GetLastWorkerAnalytic(_config.WorkerAnalyticsDelayJob.ScriptName, _config.WorkerAnalyticsDelayJob.AccountId, datetimeGreaterThan.ToString("O"), _config.WorkerAnalyticsDelayJob.API_Key, CancellationToken.None);
            if (tryGetAnalytic.IsFailed)
            {
                _logger.LogCritical($"Failure getting Zone Analytic, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                if (tryGetAnalytic.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure getting Zone Analytic, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            var data = tryGetAnalytic.Value!.Result!.Viewer.Accounts.First().WorkersInvocationsAdaptive.First().Dimensions.Datetime;

            this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - data).TotalMilliseconds > 0 ? (ulong)(DateTime.UtcNow - data).TotalMilliseconds : 0;
            this.JobData.CurrentRunStatus = Models.Jobs.Status.STATUS_DEPLOYED;
            this.JobData.APIResponseTimeUtc = tryGetAnalytic.Value.ResponseTimeMs;
            await InsertRunResult();
            await TrySave(true);
        }



        public override string Name => "Worker Analytics Delay Job";
        public override string InternalName => "workeranalytics";
    }
}
