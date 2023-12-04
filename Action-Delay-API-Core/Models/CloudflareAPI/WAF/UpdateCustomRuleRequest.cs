using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.WAF
{
    public class UpdateCustomRuleRequest
    {
        public partial class UpdateCustomRuleRequestDTO
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("action")]
            public string Action { get; set; }

            [JsonPropertyName("expression")]
            public string Expression { get; set; }

            [JsonPropertyName("description")]
            public string Description { get; set; }

            [JsonPropertyName("ref")]
            public string Ref { get; set; }

            [JsonPropertyName("enabled")]
            public bool Enabled { get; set; }

            [JsonPropertyName("action_parameters")]
            public ActionParameters ActionParameters { get; set; }
        }

        public partial class ActionParameters
        {
            [JsonPropertyName("response")]
            public Response Response { get; set; }
        }

        public partial class Response
        {
            [JsonPropertyName("status_code")]
            public long StatusCode { get; set; }

            [JsonPropertyName("content")]
            public string Content { get; set; }

            [JsonPropertyName("content_type")]
            public string ContentType { get; set; }
        }
    }
}
