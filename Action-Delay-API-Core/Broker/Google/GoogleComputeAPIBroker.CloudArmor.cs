using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
using FluentResults;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Action_Delay_API_Core.Broker.Google
{
    public partial class GoogleComputeAPIBroker
    {
        public async Task<Result<GoogleCloudAPIResponse>> PatchSecurityPolicyRule(
            string projectId,
            string securityPolicyName,
            int priority,
            PatchSecurityPolicyRuleRequest request,
            string serviceAccountJson,
            CancellationToken token)
        {
            var tryGetToken = await TryGetAccessToken(serviceAccountJson, token);
            if (tryGetToken.IsFailed) return Result.Fail(tryGetToken.Errors);

            // patchRule identifies the rule by priority in the query string, not the path, and is a POST.
            var httpRequest = new HttpRequestMessage(HttpMethod.Post,
                $"compute/v1/projects/{projectId}/global/securityPolicies/{securityPolicyName}/patchRule?priority={priority}");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tryGetToken.Value);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(request));
            httpRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var tryPatch = await _httpClient.ProcessHttpRequestAsyncGoogleCloud(
                httpRequest, "Updating Google Cloud Armor Rule", _logger);
            if (tryPatch.IsFailed) return Result.Fail(tryPatch.Errors);
            return tryPatch.Value!;
        }
    }
}
