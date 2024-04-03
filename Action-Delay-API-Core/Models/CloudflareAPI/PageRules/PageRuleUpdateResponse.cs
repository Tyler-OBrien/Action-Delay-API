using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using static Action_Delay_API_Core.Models.CloudflareAPI.PageRules.PageRuleUpdateRequest;

namespace Action_Delay_API_Core.Models.CloudflareAPI.PageRules
{
    public class PageRuleUpdateResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }


        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("created_on")]
        public DateTimeOffset CreatedOn { get; set; }

        [JsonPropertyName("modified_on")]
        public DateTimeOffset ModifiedOn { get; set; }
    }
}
