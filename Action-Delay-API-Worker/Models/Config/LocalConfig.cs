namespace Action_Deplay_API_Worker.Models.Config
{
    public class LocalConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }
        public Dictionary<string, string> CUSTOM_REQUEST_HEADERS_FOR_API { get; set; }

        public string Location { get; set; }

        public string NodeName { get; set; }

        public string HttpRequestSecret { get; set; }
    }
}
