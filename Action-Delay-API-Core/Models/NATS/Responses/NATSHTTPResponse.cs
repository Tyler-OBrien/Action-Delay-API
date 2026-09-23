using System.Net;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.NATS.Responses
{
    public class SerializableHttpResponse
    {
        [JsonPropertyName("wasSuccess")]
        public bool WasSuccess { get; set; }
        [JsonPropertyName("proxyFailure")]
        public bool ProxyFailure { get; set; }

        [JsonPropertyName("statusCode")]
        public HttpStatusCode StatusCode { get; set; }

        [JsonPropertyName("headers")]
        public Dictionary<string, string> Headers { get; set; }

        [JsonPropertyName("body")]
        public string? Body { get; set; }

        [JsonPropertyName("bodysha256")]
        public string? BodySha256 { get; set; }

        [JsonPropertyName("info")]
        public string? Info { get; set; }

        [JsonPropertyName("responseUTC")]
        public DateTime? ResponseUTC { get; set; }

        [JsonPropertyName("responseTimeMs")]
        public double? ResponseTimeMs { get; set; }

        [JsonPropertyName("generatedRandomBytesSha256")]
        public string? GeneratedRandomBytesSha256 { get; set; }

        /// <summary>
        /// Why the probe failed, from <see cref="ProbeFailureKind"/>. Null means either success or a
        /// worker predating this field; <see cref="ProbeFailureKind.IsLegacy"/> distinguishes them.
        /// </summary>
        [JsonPropertyName("failureKind")]
        public string? FailureKind { get; set; }

        /// <summary>
        /// True when the probe produced no usable observation, so the caller should stop polling this
        /// location rather than treat the reply as "not propagated yet".
        /// </summary>
        /// <remarks>
        /// <see cref="ProxyFailure"/> alone used to answer this, because a timeout set it. Timeouts
        /// now report <see cref="ProbeFailureKind.Timeout"/> with the flag clear, so that they can be
        /// attributed to the target - which means callers have to ask for both, or a timing-out
        /// location would silently poll until the job cancelled it.
        /// </remarks>
        public bool IsProbeAbort() => ProxyFailure || FailureKind == ProbeFailureKind.Timeout;

        public int GetColoId()
        {
            if (Headers != null && Headers.TryGetValue("colo", out var coloStr) &&
                int.TryParse(coloStr, out var coloInt))
                return coloInt;
            return -1;
        }
    }
}
