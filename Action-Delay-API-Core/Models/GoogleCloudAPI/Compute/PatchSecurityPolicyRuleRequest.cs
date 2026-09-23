using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.GoogleCloudAPI.Compute
{
    public class PatchSecurityPolicyRuleRequest
    {
        [JsonPropertyName("description")] public string Description { get; set; }
        [JsonPropertyName("match")] public SecurityPolicyRuleMatch Match { get; set; }

        /// <summary>REST spells the deny action <c>deny(403)</c>; gcloud spells the same thing <c>deny-403</c>.</summary>
        [JsonPropertyName("action")] public string Action { get; set; }

        [JsonPropertyName("preview")] public bool Preview { get; set; }
    }

    public class SecurityPolicyRuleMatch
    {
        [JsonPropertyName("expr")] public SecurityPolicyRuleExpr Expr { get; set; }
    }

    public class SecurityPolicyRuleExpr
    {
        [JsonPropertyName("expression")] public string Expression { get; set; }
    }
}
