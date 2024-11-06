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

        public int GetColoId()
        {
            if (Headers != null && Headers.TryGetValue("colo", out var coloStr) &&
                int.TryParse(coloStr, out var coloInt))
                return coloInt;
            return -1;
        }
    }
}
