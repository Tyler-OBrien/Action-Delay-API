using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
using FluentResults;

namespace Action_Delay_API_Core.Broker.Google
{
    public partial interface IGoogleComputeAPIBroker
    {
        Task<Result<GoogleCloudAPIResponse>> PatchSecurityPolicyRule(string projectId, string securityPolicyName,
            int priority, PatchSecurityPolicyRuleRequest request, string serviceAccountJson, CancellationToken token);
    }
}
