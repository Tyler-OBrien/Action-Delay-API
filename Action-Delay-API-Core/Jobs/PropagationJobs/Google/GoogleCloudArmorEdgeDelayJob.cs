using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Google
{
    // Same header-marker probe as the backend job, pointed at an edge security policy. Edge policies are
    // enforced ahead of the Cloud CDN cache rather than at the backend, so they are a separate rollout
    // path - the difference between the two jobs is the point of running both.
    public class GoogleCloudArmorEdgeDelayJob : GoogleCloudArmorDelayJob
    {
        public GoogleCloudArmorEdgeDelayJob(IGoogleComputeAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<GoogleCloudArmorEdgeDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider)
            : base(config.Value.GoogleCloudArmorEdgeJob, apiBroker, config, logger, queue, clickHouse, dbContext, locationProvider)
        {
        }

        public override int TargetExecutionSecond => 26;

        public override string Name => "Google Cloud Armor Edge Delay Job";
        public override string InternalName => "googlearmoredge";
        public override string JobDescription => "Delay of a Cloud Armor edge security policy rule reaching Google's edge. Edge policies are enforced ahead of the Cloud CDN cache; the rule denies requests carrying a marker header, and we send that header on edge until we see the block.";
    }
}
