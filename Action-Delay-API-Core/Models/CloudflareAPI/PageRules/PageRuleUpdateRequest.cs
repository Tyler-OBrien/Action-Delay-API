using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.PageRules
{
    public class PageRuleUpdateRequest
    {
        public partial class PageRuleUpdateRequestDTO
        {
            
            [JsonPropertyName("targets")]
            public Target[] Targets { get; set; }

            [JsonPropertyName("actions")]
            public Action[] Actions { get; set; }

            [JsonPropertyName("priority")]
            public long Priority { get; set; }

            [JsonPropertyName("status")]
            public string Status { get; set; }


        }

        public partial class Action
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("value")]
            public Value Value { get; set; }
        }

        public partial class Value
        {
            [JsonPropertyName("url")]
            public string Url { get; set; }

            [JsonPropertyName("status_code")]
            public long StatusCode { get; set; }
        }

        public partial class Target
        {
            [JsonPropertyName("target")]
            public string TargetTarget { get; set; }

            [JsonPropertyName("constraint")]
            public Constraint Constraint { get; set; }
        }

        public partial class Constraint
        {
            [JsonPropertyName("operator")]
            public string Operator { get; set; }

            [JsonPropertyName("value")]
            public string Value { get; set; }
        }
    }
}
