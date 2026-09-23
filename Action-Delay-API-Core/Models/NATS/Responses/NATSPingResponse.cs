using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.NATS.Responses
{
    public class SerializablePingResponse
    {
        [JsonPropertyName("wasSuccess")]
        public bool WasSuccess { get; set; }

        [JsonPropertyName("proxyFailure")]
        public bool ProxyFailure { get; set; }

        [JsonPropertyName("info")]
        public string? Info { get; set; }

        /// <summary>
        /// Why the probe failed, from <see cref="ProbeFailureKind"/>. Null on success, and null from
        /// workers predating this field.
        /// </summary>
        [JsonPropertyName("failureKind")]
        public string? FailureKind { get; set; }

        [JsonPropertyName("responseTimeMsAvg")]
        public double ResponseTimeMsAvg { get; set; }
    }
}
