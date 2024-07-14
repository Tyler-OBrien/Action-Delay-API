using System.Net;
using System.Text.Json.Serialization;

namespace Action_Deplay_API_Worker.Models.API.Response
{
    public class SerializableHttpResponse
    {
        public SerializableHttpResponse()
        {
            ResponseUTC = DateTime.UtcNow;
        }

        public bool WasSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public bool ProxyFailure { get; set; }
        public Dictionary<string, string> Headers { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Body { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Info { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? BodySha256 { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DateTime? ResponseUTC { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public double? ResponseTimeMs { get; set; }

    }
}
