using System.Text.Json.Serialization;

namespace Action_Delay_Api_HealthChecks.Models
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
