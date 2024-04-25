using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs
{
    public class DNSDelayJobFree : DNSDelayJob
    {
        public DNSDelayJobFree(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<DNSDelayJobFree> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, queue, clickHouse, dbContext)
        {
            _jobConfig = _config.DNSJobFree;
        }

        public override string Name => "DNS Delay Job Free";

        public override string InternalName => "dnsfree";


        public override int TargetExecutionSecond => 55;

        public override bool Enabled => _config.DNSJobFree != null && (_config.DNSJobFree.Enabled.HasValue == false || _config.DNSJobFree is { Enabled: true });


    }
}
