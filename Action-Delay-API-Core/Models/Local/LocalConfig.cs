namespace Action_Delay_API_Core.Models.Local
{
    public class LocalConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }

        public bool UsingNATS { get; set; }

        public string PostgresConnectionString { get; set; }

        public string ClickhouseConnectionString { get; set; }

        public string ActionDelayProxySecret { get; set; }





        public string Location { get; set; }

        public string NodeName { get; set; }

        public List<Location> Locations { get; set; }

        public int Min_Locations { get; set; }

        public WorkerDelayJobConfig? DelayJob { get; set; }
        public WorkerDelayJobConfig? WorkerDelayJobTesting { get; set; }

        public WfPDelayJobConfig? WfPJob { get; set; }


        public DNSDelayJobConfig? DNSJob { get; set; }
        public DNSDelayJobConfig? DNSJobFree { get; set; }

        public CustomRuleUpdateConfig? WAFJob { get; set; }
        public CacheDelayJobConfig? CacheJob { get; set; }
        public ZoneAnalyticDelayJob? ZoneAnalyticsDelayJob { get; set; }
        public PageRuleUpdateConfig? PageRuleJob { get; set; }
        public AIConfig? AI { get; set; }


        public WorkerAnalyticDelayJob? WorkerAnalyticsDelayJob { get; set; }

        public CustomHostnamesDelayJob? CustomHostnamesDelayJob { get; set; }
        public CertificateRenewalDelayJob? CertRenewalDelayJob { get; set; }


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

    public class DNSDelayJobConfig : BaseConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }
        
        public string RecordId { get; set; }
        public string Name { get; set; }
        public string NameServers { get; set; }

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

    public class BaseConfig
    {
        public bool? Enabled { get; set; }
    }
}
