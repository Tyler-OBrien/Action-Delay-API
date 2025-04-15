
namespace Action_Delay_Api_Incidient_Monitoring
{
    public class LocalConfig
    {
        public string PostgresConnectionString { get; set; }

        public string ClickhouseConnectionString { get; set; }
        public string SENTRY_DSN { get; set; }

        public string SLACK_WEBHOOK_URL { get; set; }


        public string CoreName { get; set; }
    }

    public class Location
    {
        public string Name { get; set; }

        public string? NATSName { get; set; }

        public string? URL { get; set; }

        public string? DisplayName { get; set; }

        public bool Disabled { get; set; }


        public string? DNSResolveOverride { get; set; }

        public bool? Compression { get; set; }

    }
}
