using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs.PropagationJobs
{
    public class WorkerDelayTestingJob : WorkerDelayJob
    {
        public WorkerDelayTestingJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<WorkerDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, queue, clickHouse, dbContext)
        {
            _jobConfig = config.Value.WorkerDelayJobTesting;
        }
        public override string Name => "Worker Script Delay Job Testing";
        public override string InternalName => "workertesting";


        public override int TargetExecutionSecond => 13;

        public override bool Enabled => _config.WorkerDelayJobTesting != null && (_config.WorkerDelayJobTesting.Enabled.HasValue == false || _config.WorkerDelayJobTesting is { Enabled: true });
    }
}
