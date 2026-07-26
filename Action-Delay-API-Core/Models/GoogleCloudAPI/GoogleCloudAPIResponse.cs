using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.GoogleCloudAPI
{
    public class GoogleCloudAPIResponse
    {
        [JsonPropertyName("error")]
        public GoogleCloudAPIError? Error { get; set; }

        [JsonIgnore]
        public double? ResponseTimeMs { get; set; }

        [JsonIgnore]
        public int ColoId { get; set; }
    }

    public class GoogleCloudAPIError
    {
        [JsonPropertyName("code")]
        public int Code { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }
    }
}
