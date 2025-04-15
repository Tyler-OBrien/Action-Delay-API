using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.BunnyAPI.EdgeRules
{
    public partial class BunnyEdgeRuleDto
    {
        [JsonPropertyName("ActionType")]
        public int ActionType { get; set; }

        [JsonPropertyName("Description")]
        public string Description { get; set; }

        [JsonPropertyName("TriggerMatchingType")]
        public int TriggerMatchingType { get; set; }

        [JsonPropertyName("Enabled")]
        public bool Enabled { get; set; }


        [JsonPropertyName("Guid")]
        public string Guid { get; set; }

        [JsonPropertyName("ActionParameter1")]
        public string ActionParameter1 { get; set; }

        [JsonPropertyName("ActionParameter2")]
        public string ActionParameter2 { get; set; }

        [JsonPropertyName("Triggers")]
        public BunnyEdgeRuleDtoTrigger[] Triggers { get; set; }
    }

    public partial class BunnyEdgeRuleDtoTrigger
    {
        [JsonPropertyName("Type")]
        public int Type { get; set; }

        [JsonPropertyName("PatternMatchingType")]
        public int PatternMatchingType { get; set; }

        [JsonPropertyName("PatternMatches")]
        public string[] PatternMatches { get; set; }
    }
}
