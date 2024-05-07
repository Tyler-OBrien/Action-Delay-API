using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System.Net.Http.Headers;
using System.Text;
using Action_Delay_API_Core.Models.CloudflareAPI.PageRules;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<PageRuleUpdateResponse>>> UpdatePageRule(string pageRuleId, string zoneId, PageRuleUpdateRequest.PageRuleUpdateRequestDTO newUpdateRequest, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Put,
                $"{BasePath}/zones/{zoneId}/pagerules/{pageRuleId}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(newUpdateRequest), Encoding.UTF8);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<PageRuleUpdateResponse>(request, $"Updating Page Rule",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
