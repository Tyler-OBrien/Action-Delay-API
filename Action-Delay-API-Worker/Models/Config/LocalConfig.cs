﻿namespace Action_Delay_API_Worker.Models.Config
{
    public class LocalConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public List<string> NATSConnectionURLs { get; set; }
        public Dictionary<string, string> CUSTOM_REQUEST_HEADERS_FOR_API { get; set; }

        public string Location { get; set; }

        public string NodeName { get; set; }

        public string HttpRequestSecret { get; set; }

        public bool DumpToDirectoryForDictionaryTraining { get; set; }

        public bool EnableLogsForAllRequests { get; set; }

        public bool DisableLogsForErrors { get; set; }

    }
}
