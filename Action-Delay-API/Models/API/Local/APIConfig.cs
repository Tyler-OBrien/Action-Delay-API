namespace Action_Delay_API.Models.API.Local
{
    public class APIConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }

        public string PostgresConnectionString { get; set; }

        public string ClickhouseConnectionString { get; set; }

        public string ExternalJobAPIKey { get; set; }

        public string CoreName { get; set; }

    }
}
