using Action_Delay_API_Core.Broker.ColoData;
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

namespace Action_Delay_API_Core.Jobs.SimpleJob.Bunny
{
    public class BunnyLogForwarderDelayJob : BaseJob
    {
        private readonly IColoDataBroker _apiBroker;

        public BunnyLogForwarderDelayJob(IOptions<LocalConfig> config, ILogger<BunnyLogForwarderDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, IColoDataBroker coloDataBroker) : base(config, logger, clickHouse, dbContext, queue)
        {
            _apiBroker = coloDataBroker;
        }
        public override int TargetExecutionSecond => 53;
        public override bool Enabled => _config.BunnyLogForwarderDelayJob != null && (_config.BunnyLogForwarderDelayJob.Enabled.HasValue == false || _config.BunnyLogForwarderDelayJob is { Enabled: true });
        public override async Task RunAction()
        {



            var tryGetAnalytic = await _apiBroker.GetBunnyLastDataDate(CancellationToken.None);
            if (tryGetAnalytic.IsFailed)
            {
                _logger.LogCritical($"Failure getting Bunny last logfwdr event date, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                if (tryGetAnalytic.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure getting  Bunny last logfwdr event date, logs: {tryGetAnalytic.Errors?.FirstOrDefault()?.Message}");
                return;
            }

            var data = tryGetAnalytic.Value;

            this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - data).TotalMilliseconds > 0 ? (ulong)(DateTime.UtcNow - data).TotalMilliseconds : 0;
            this.JobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
            this.JobData.APIResponseTimeUtc = 0;
            await InsertRunResult();
            await TrySave(true);
        }



        public override string Name => "Bunny Logforwarder Delay Job";
        public override string InternalName => "bunnylogforwarder";

        public override string JobType => "BunnyDelay";

        public override string JobDescription => "How much is Logforwarder delayed by? This tracks the delay of the latest received event's timestamp. We queue/batch for a max of 5 seconds before it can hit this. We send a request to a Pull Zone every second to ensure there's always fresh data coming. ";

    }
}
