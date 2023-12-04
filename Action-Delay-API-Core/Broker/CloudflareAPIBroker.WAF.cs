using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using static Action_Delay_API_Core.Models.CloudflareAPI.WAF.UpdateCustomRuleResponse;
using static Action_Delay_API_Core.Models.CloudflareAPI.WAF.UpdateCustomRuleRequest;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {

        public async Task<Result<ApiResponse<UpdateCustomRuleResponse.UpdateCustomRuleResponseDto>>> UpdateCustomRule(string ruleId, string ruleSetId, string zoneId, UpdateCustomRuleRequestDTO newUpdateRequest, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Patch,
                $"{BasePath}/zones/{zoneId}/rulesets/{ruleSetId}/rules/{ruleId}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(newUpdateRequest));
            var tryPut = await _httpClient.ProcessHttpRequestAsync<UpdateCustomRuleResponseDto>(request, $"Updating Custom Rule",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

    }
}
