using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.GraphQL
{
    public class ZoneAnalyticsDateTime
    {
        public partial class Data
        {
            [JsonPropertyName("viewer")]
            public Viewer Viewer { get; set; }
        }

        public partial class Viewer
        {
            [JsonPropertyName("zones")]
            public Zone[] Zones { get; set; }
        }

        public partial class Zone
        {
            [JsonPropertyName("httpRequestsAdaptive")]
            public HttpRequestsAdaptive[] HttpRequestsAdaptive { get; set; }
        }

        public partial class HttpRequestsAdaptive
        {
            [JsonPropertyName("datetime")]
            public DateTimeOffset Datetime { get; set; }
        }
    }
}
