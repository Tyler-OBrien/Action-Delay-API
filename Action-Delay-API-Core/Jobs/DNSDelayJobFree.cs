using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Jobs
{
    public class DNSDelayJobFree : DNSDelayJob
    {
        public DNSDelayJobFree(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<DNSDelayJobFree> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, queue, clickHouse, dbContext)
        {
            _jobConfig = _config.DNSJobFree;
        }

        public override string Name => "DNS Delay Job Free";

        public override int TargetExecutionSecond => 55;

    }
}
