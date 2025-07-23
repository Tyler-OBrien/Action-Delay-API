using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Broker.ColoData;
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
    public class LogpushDelayJob : BaseJob
    {
        private readonly IColoDataBroker _apiBroker;

        public LogpushDelayJob(IOptions<LocalConfig> config, ILogger<LogpushDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, IColoDataBroker coloDataBroker) : base(config, logger, clickHouse, dbContext, queue)
        {
            _apiBroker = coloDataBroker;
        }
        public override int TargetExecutionSecond => 53;
        public override bool Enabled => _config.CloudflareLogpushDelayJob != null && (_config.CloudflareLogpushDelayJob.Enabled.HasValue == false || _config.CloudflareLogpushDelayJob is { Enabled: true });
        public override async Task RunAction()
        {



            var tryGetAnalytic = await _apiBroker.GetCloudflareLastDataDate(CancellationToken.None);
            if (tryGetAnalytic.IsFailed)
            {
                _logger.LogCritical($"Failure getting Cloudflare last logpush event date, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                if (tryGetAnalytic.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure getting  Cloudflare last logpush event date, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            var data = tryGetAnalytic.Value;

            this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - data).TotalMilliseconds > 0 ? (ulong)(DateTime.UtcNow - data).TotalMilliseconds : 0;
            this.JobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
            this.JobData.APIResponseTimeUtc = 0;
            await InsertRunResult();
            await TrySave(true);
        }



        public override string Name => "Logpush Delay Job";
        public override string InternalName => "logpush";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "How much is logpush delayed by? This is a simple normal (non-edge) logpush http job. We send a request to a Pull Zone every second to ensure there's always fresh data coming. ";

    }
}
