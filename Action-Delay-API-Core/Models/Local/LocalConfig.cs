namespace Action_Delay_API_Core.Models.Local
{
    public class LocalConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }

        public string PostgresConnectionString { get; set; }

        public string ClickhouseConnectionString { get; set; }




        public string Location { get; set; }

        public string NodeName { get; set; }

        public List<Location> Locations { get; set; }

        public int Min_Locations { get; set; }

        public WorkerDelayJobConfig DelayJob { get; set; }

        public WfPDelayJobConfig WfPJob { get; set; }


        public DNSDelayJobConfig DNSJob { get; set; }
        public DNSDelayJobConfig DNSJobFree { get; set; }

        public CustomRuleUpdateConfig WAFJob { get; set; }
        public CacheDelayJobConfig CacheJob { get; set; }
        public ZoneAnalyticDelayJob ZoneAnalyticsDelayJob { get; set; }
        public PageRuleUpdateConfig PageRuleJob { get; set; }

    }


    public class PageRuleUpdateConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string PageRuleId { get; set; }

        public string PageRuleHostname { get; set; }

    }

    public class ZoneAnalyticDelayJob
    {
        public string API_Key { get; set; }

        public string ZoneId { get; set; }

    }
    public class WfPDelayJobConfig
    {
        public string API_Key { get; set; }

        public string AccountId { get; set; }

        public string ScriptName { get; set; }

        public string NamespaceName { get; set; }



        public string ScriptUrl { get; set; }

    }


    public class WorkerDelayJobConfig
    {
        public string API_Key { get; set; }

        public string AccountId { get; set; }

        public string ScriptName { get; set; }


        public string ScriptUrl { get; set; }

    }

    public class DNSDelayJobConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }
        
        public string RecordId { get; set; }
        public string Name { get; set; }
        public string NameServers { get; set; }

    }

    public class CustomRuleUpdateConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string RuleSetId { get; set; }
        public string RuleId { get; set; }

        public string HostName { get; set; }

    }

    public class CacheDelayJobConfig
    {
        public string API_Key { get; set; }
        public string ZoneId { get; set; }

        public string URL { get; set; }

        public string ProxyURL { get; set; }

        public string ProxyAPIKey { get; set; }

    }
}
