using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Local;

namespace Action_Delay_API_Core.Jobs.SimpleJob
{
    public class WorkerLogsDelayJob : BaseJob
    {
        private readonly ICloudflareAPIBroker _apiBroker;

        public WorkerLogsDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkerLogsDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(config, logger, clickHouse, dbContext, queue)
        {
            _apiBroker = apiBroker;
        }
        public override int TargetExecutionSecond => 29;
        public override bool Enabled => _config.WorkerLogsDelayJob != null && (_config.WorkerLogsDelayJob.Enabled.HasValue == false || _config.WorkerLogsDelayJob is { Enabled: true });
        public override async Task RunAction()
        {
            var dateTimeLessThen = TimeProvider.System.GetUtcNow().AddDays(-2);
            var datetimeGreaterThan = TimeProvider.System.GetUtcNow().AddHours(2);


            var tryGetAnalytic = await _apiBroker.TelemetryQuery( dateTimeLessThen, datetimeGreaterThan, _config.WorkerLogsDelayJob.AccountId, _config.WorkerLogsDelayJob.ScriptName, _config.WorkerLogsDelayJob.API_Key, CancellationToken.None);
            if (tryGetAnalytic.IsFailed)
            {
                _logger.LogCritical($"Failure getting Worker Obs Logs logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                if (tryGetAnalytic.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure getting  Worker Obs Logs, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            if ((tryGetAnalytic.Value?.Result?.Events?.EventsEvents.Any() ?? false) == false )
            {
                _logger.LogCritical($"Failure getting  Worker Obs Logs, API returned no events");
                throw new CustomAPIError(
                    $"Failure getting  Worker Obs Logs, API returned no events");
                return;
            }

            var data = tryGetAnalytic.Value!.Result!.Events.EventsEvents.First().Timestamp.ToString();
            long parsedDatetime = -1;
            if (DateTime.TryParse(data, out var eventTimeStamp) || (long.TryParse(data, out  parsedDatetime) && parsedDatetime > 100001002420 && parsedDatetime < DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()))
            {
                if (parsedDatetime != -1 && (eventTimeStamp == DateTime.MinValue || eventTimeStamp == default))
                    eventTimeStamp = DateTimeOffset.FromUnixTimeMilliseconds(parsedDatetime).DateTime;

                this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - eventTimeStamp).TotalMilliseconds > 0
                    ? (ulong)(DateTime.UtcNow - eventTimeStamp).TotalMilliseconds
                    : 0;
                this.JobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
                this.JobData.APIResponseTimeUtc = tryGetAnalytic.Value.ResponseTimeMs;
                await InsertRunResult();
                await TrySave(true);
            }
            else
            {
                _logger.LogCritical($"Failure getting  Worker Obs Logs, could not parse event timestamp {eventTimeStamp}, {data}");
                throw new CustomAPIError(
                    $"Failure getting  Worker Obs Logs, could not parse event timestamp {eventTimeStamp}, {data}");
                return;
            }
        }



        public override string Name => "Worker Logs Delay Job";
        public override string InternalName => "workerlogs";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "How far back is the newest Worker Log event?";

    }
}
