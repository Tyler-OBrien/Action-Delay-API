using Action_Delay_API_Core.Models.NATS;

namespace Action_Delay_API_Core.Models.Local
{
    public class LocalConfig
    {
        public string CoreName { get; set; }

        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }
        public string? NATSConnectionURLClickhouse { get; set; }

        public bool UsingNATS { get; set; }

        public bool NATSRequestCompression { get; set; }


        public bool? BackgroundLocationDataRefresh { get; set; }

        public List<string>? BackgroundRefreshProviders { get; set; }

        public string PostgresConnectionString { get; set; }

        /// <summary>
        /// The database this node's origin API reads, when that is not the same one we write to.
        /// Blank disables the local marker write, leaving the primary-only behaviour.
        /// </summary>
        public string? PostgresConnectionStringLocal { get; set; }


        public bool SendClickhouseResultsToNATS { get; set; }

        public string ClickhouseConnectionString { get; set; }

        public string ActionDelayProxySecret { get; set; }






        public string Location { get; set; }

        public string NodeName { get; set; }

        public List<Location> Locations { get; set; }

        /// <summary>Floor on how small the roster service is allowed to shrink the fleet. 0 disables the check.</summary>
        public int Min_Locations { get; set; }

        public LocationRosterConfig? LocationRoster { get; set; }

        public WorkerDelayJobConfig? DelayJob { get; set; }
        public WorkerDelayJobConfig? WorkerDelayJobTesting { get; set; }

        public WfPDelayJobConfig? WfPJob { get; set; }


        public DNSDelayJobConfig? DNSJob { get; set; }
        public DNSDelayJobConfig? DNSJobFree { get; set; }

        public DNSDelayJobConfig? BunnyDNSJob { get; set; }
        public GoogleCloudDNSDelayJobConfig? GoogleCloudDNSJob { get; set; }
        public GoogleCloudLoadBalancerDelayJobConfig? GoogleCloudLoadBalancerJob { get; set; }
        public GoogleCloudArmorDelayJobConfig? GoogleCloudArmorJob { get; set; }
        public BunnyEdgeScriptDelayJobConfig? BunnyEdgeScriptJob { get; set; }
        public BunnyEdgeRuleDelayJobConfig? BunnyEdgeRuleJob { get; set; }
        public BunnyUploadReplicationDelayJobConfig? BunnyUploadReplicationJob { get; set; }
        public BunnyCacheDelayJobConfig? BunnyCacheJob { get; set; }


        public CustomRuleUpdateConfig? WAFJob { get; set; }
        public CacheDelayJobConfig? CacheJob { get; set; }
        public ZoneAnalyticDelayJob? ZoneAnalyticsDelayJob { get; set; }
        public PageRuleUpdateConfig? PageRuleJob { get; set; }
        public AIConfig? AI { get; set; }


        public WorkerAnalyticDelayJob? WorkerAnalyticsDelayJob { get; set; }
        public WorkerLogsDelayJob? WorkerLogsDelayJob { get; set; }

        public CustomHostnamesDelayJob? CustomHostnamesDelayJob { get; set; }
        public CertificateRenewalDelayJob? CertRenewalDelayJob { get; set; }

        public CloudflareLogpushDelayJob? CloudflareLogpushDelayJob { get; set; }
        public BunnyLogForwarderDelayJob? BunnyLogForwarderDelayJob { get; set; }
        public PerfConfig? PerfConfig { get; set; }



    }

    public class CloudflareLogpushDelayJob : BaseConfig
    {

        public string API_Key { get; set; }
    }

    public class BunnyLogForwarderDelayJob : BaseConfig
    {

        public string AccessKey { get; set; }
    }

    public class PerfConfig : BaseConfig
    {
        public List<DownloadJobGeneric> BasicDownloadJobList { get; set; }

        public List<UploadS3Job> S3Jobs { get; set; }
        public List<DownloadS3Job> S3DownloadJobs { get; set; }
        public List<UploadJobGeneric> UploadJobs { get; set; }

        // Sent with every request, just basic auth on endpoints
        public string Secret { get; set; }
    }

    public class DownloadJobGeneric
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Endpoint { get; set; }

        public string PrewarmEndpoint { get; set; }

        public Dictionary<string, string>? CustomHeaders { get; set; }

        public string[]? AllowedEdgeLocations { get; set; }
        public Dictionary<string, string>? EdgeLocationCustomDNSNameserverOverride { get; set; }

        public Dictionary<string, NetType>? EdgeLocationForceNetType { get; set; }


        public string? CustomDNSNameserver { get; set; }
        public string? DNSResolveOverride { get; set; }

        public NetType? ForceNetType { get; set; }

        public bool DisablePrewarmup { get; set; }
        
        public bool NoConnectionKeepAlive { get; set; }

        public int? CountOfRequests { get; set; }
    }


    public class UploadJobGeneric
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Endpoint { get; set; }

        public string PrewarmEndpoint { get; set; }

        public int? Size { get; set; }



        public Dictionary<string, string> CustomHeaders { get; set; }

        public string[] AllowedEdgeLocations { get; set; }

        public NetType? ForceNetType { get; set; }

        public bool? CheckUploadedContentHash { get; set; }

    }


    public class DownloadS3Job
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Endpoint { get; set; }

        public string BucketName { get; set; }

        public string Region { get; set; }

        public string AccessKey { get; set; }

        public string SecretKey { get; set; }

        public string[] AllowedEdgeLocations { get; set; }

        public NetType? ForceNetType { get; set; }

        public string? ObjectName { get; set; }

        public bool? UsePathStyle { get; set; }

    }

    public class UploadS3Job
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Endpoint { get; set; }

        public bool? UnsignedPayload { get; set; }

        public int? Size { get; set; }

        public string BucketName { get; set; }

        public string Region { get; set; }

        public string AccessKey { get; set; }

        public string SecretKey { get; set; }

        public string[] AllowedEdgeLocations { get; set; }

        public NetType? ForceNetType { get; set; }
        public bool? CheckUploadedContentHash { get; set; }

        public bool? KeepOldAndDumpToDiskOnMisMatch { get; set; }

        public bool? DeleteWithVersionId { get; set; }

        public bool? UsePathStyle { get; set; }
    }

    public class CertificateRenewalDelayJob : BaseConfig
    {
        public string API_Key { get; set; }

        public string ZoneId { get; set; }

        public string TargetHostname { get; set; }

        public string[] OtherCertificateHostnames { get; set; }

    }

    public class CustomHostnamesDelayJob : BaseConfig
    {
        public string API_Key { get; set; }

        public string ZoneId { get; set; }

        public string TargetHostname { get; set; }

    }

    public class WorkerAnalyticDelayJob : BaseConfig
    {
        public string API_Key { get; set; }

        public string ScriptName { get; set; }

        public string AccountId { get; set; }

    }

    public class WorkerLogsDelayJob : BaseConfig
    {
        public string API_Key { get; set; }

        public string ScriptName { get; set; }

        public string AccountId { get; set; }

    }


    public class AIConfig : BaseConfig
    {
        public string API_Key { get; set; }
        public string AccountId { get; set; }
        public string AIWorkerHostname { get; set; }
        public string AIWorkerSecret { get; set; }
        public List<string> Locations { get; set; }

    }

    public class PageRuleUpdateConfig : BaseConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string PageRuleId { get; set; }

        public string PageRuleHostname { get; set; }

    }

    public class ZoneAnalyticDelayJob : BaseConfig
    {
        public string API_Key { get; set; }

        public string ZoneId { get; set; }

    }
    public class WfPDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }

        public string AccountId { get; set; }

        public string ScriptName { get; set; }

        public string NamespaceName { get; set; }



        public string ScriptUrl { get; set; }

    }


    public class WorkerDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }

        public string AccountId { get; set; }

        public string ScriptName { get; set; }


        public string ScriptUrl { get; set; }

    }

    public class BunnyEdgeScriptDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }

        public string ScriptId { get; set; }

        public string ScriptUrl { get; set; }

    }

    public class BunnyEdgeRuleDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }

        public string ZoneId { get; set; }

        public string TargetBaseHostname { get; set; }


        public string EdgeRuleGuid { get; set; }

    }


    public class BunnyUploadReplicationDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }

        public string StorageAccount { get; set; }

        public string Url { get; set; }

    }

    public class DNSDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string RecordId { get; set; }
        public string Name { get; set; }
        public string NameServers { get; set; }

    }

    public class GoogleCloudDNSDelayJobConfig : BaseConfig
    {
        // Service-account JSON key (inline). Used to mint an OAuth2 bearer token for DNS record writes.
        public string ServiceAccountJson { get; set; }
        public string ProjectId { get; set; }
        public string ZoneName { get; set; }
        public string RecordName { get; set; }
        public string NameServers { get; set; }
    }

    public class GoogleCloudLoadBalancerDelayJobConfig : BaseConfig
    {
        // Service-account JSON key (inline). Used to mint an OAuth2 bearer token for compute writes.
        public string ServiceAccountJson { get; set; }
        public string ProjectId { get; set; }
        public string UrlMapName { get; set; }
        public string PathMatcherName { get; set; }

        // Full selfLink of the backend service the path matcher falls back to. Sent on every patch
        // because pathMatchers is replaced wholesale, and a path matcher must name a default.
        public string DefaultService { get; set; }

        // Fixed path the redirect rule matches on; only the redirect target changes per run.
        public string ProbePath { get; set; }

        // Hostname resolving to the load balancer's anycast VIP.
        public string LbHostname { get; set; }

        // Base hostname the probe path is redirected to; the per-run marker is prefixed onto it.
        public string TargetRedirectHostname { get; set; }
    }

    public class GoogleCloudArmorDelayJobConfig : BaseConfig
    {
        // Service-account JSON key (inline). Used to mint an OAuth2 bearer token for compute writes.
        public string ServiceAccountJson { get; set; }
        public string ProjectId { get; set; }
        public string SecurityPolicyName { get; set; }

        // Priority of the rule the job rewrites each run. The rule must already exist.
        public int RulePriority { get; set; }

        // Request header carrying the per-run marker the Cloud Armor rule matches on.
        public string ProbeHeaderName { get; set; }

        // A path the backend serves 200 for, so the pre-propagation state is unambiguous.
        public string ProbePath { get; set; }

        // Hostname resolving to the load balancer's anycast VIP.
        public string LbHostname { get; set; }
    }

    public class CustomRuleUpdateConfig : BaseConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string RuleSetId { get; set; }
        public string RuleId { get; set; }

        public string HostName { get; set; }

    }

    public class CacheDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string URL { get; set; }

        public string ProxyURL { get; set; }

        public string ProxyAPIKey { get; set; }

    }

    public class BunnyCacheDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }

        public string URL { get; set; }
    }

    public class BaseConfig
    {
        public bool? Enabled { get; set; }
    }
}
