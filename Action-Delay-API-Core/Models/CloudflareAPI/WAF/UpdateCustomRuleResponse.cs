using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.WAF
{
    public class UpdateCustomRuleResponse
    {
        public partial class UpdateCustomRuleResponseDto
        {
            [JsonPropertyName("result")]
            public Result Result { get; set; }

            [JsonPropertyName("success")]
            public bool Success { get; set; }

            [JsonPropertyName("errors")]
            public object[] Errors { get; set; }

            [JsonPropertyName("messages")]
            public object[] Messages { get; set; }
        }

        public partial class Result
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("description")]
            public string Description { get; set; }

            [JsonPropertyName("source")]
            public string Source { get; set; }

            [JsonPropertyName("kind")]
            public string Kind { get; set; }

            [JsonPropertyName("version")]
            public string Version { get; set; }

            [JsonPropertyName("rules")]
            public Rule[] Rules { get; set; }

            [JsonPropertyName("last_updated")]
            public DateTimeOffset LastUpdated { get; set; }

            [JsonPropertyName("phase")]
            public string Phase { get; set; }
        }

        public partial class Rule
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("version")]
            public string Version { get; set; }

            [JsonPropertyName("action")]
            public string Action { get; set; }

            [JsonPropertyName("expression")]
            public string Expression { get; set; }

            [JsonPropertyName("description")]
            public string Description { get; set; }

            [JsonPropertyName("last_updated")]
            public DateTimeOffset LastUpdated { get; set; }

            [JsonPropertyName("ref")]
            public string Ref { get; set; }

            [JsonPropertyName("enabled")]
            public bool Enabled { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            [JsonPropertyName("action_parameters")]
            public ActionParameters ActionParameters { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            [JsonPropertyName("logging")]
            public Logging Logging { get; set; }
        }

        public partial class ActionParameters
        {
            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            [JsonPropertyName("response")]
            public Response Response { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            [JsonPropertyName("ruleset")]
            public string Ruleset { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            [JsonPropertyName("phases")]
            public string[] Phases { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            [JsonPropertyName("products")]
            public string[] Products { get; set; }
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

        public partial class Logging
        {
            [JsonPropertyName("enabled")]
            public bool Enabled { get; set; }
        }
    }
}
