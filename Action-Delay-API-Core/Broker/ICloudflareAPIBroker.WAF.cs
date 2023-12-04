using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using static Action_Delay_API_Core.Models.CloudflareAPI.WAF.UpdateCustomRuleRequest;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        public Task<Result<ApiResponse<UpdateCustomRuleResponse.UpdateCustomRuleResponseDto>>> UpdateCustomRule(
            string ruleId, string ruleSetId, string zoneId, UpdateCustomRuleRequestDTO newUpdateRequest, string apiToken,
            CancellationToken token);
    }
}
