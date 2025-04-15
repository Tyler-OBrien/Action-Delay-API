using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_Api_Worker_Cli.Models
{
    public class SerializablePingResponse
    {
        [JsonPropertyName("wasSuccess")]
        public bool WasSuccess { get; set; }

        [JsonPropertyName("proxyFailure")]
        public bool ProxyFailure { get; set; }

        [JsonPropertyName("info")]
        public string? Info { get; set; }

        [JsonPropertyName("responseTimeMsAvg")]
        public double ResponseTimeMsAvg { get; set; }
    }
}
