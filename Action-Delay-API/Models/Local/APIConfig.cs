namespace Action_Delay_API.Models.Local
{
    public class APIConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }

        public string PostgresConnectionString { get; set; }

        public string ClickhouseConnectionString { get; set; }

    }
}
