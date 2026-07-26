using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.DNS;
using FluentResults;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Action_Delay_API_Core.Broker.Google
{
    public partial class GoogleCloudAPIBroker
    {
        // OAuth2 scope required for Cloud DNS record mutations (rrsets.patch/create/delete).
        private const string GoogleDnsScope = "https://www.googleapis.com/auth/ndev.clouddns.readwrite";

        public async Task<Result<GoogleCloudAPIResponse>> UpdateDNSRecord(
            string projectId,
            string zoneName,
            string recordName,
            UpdateGCPRRSetRequest request,
            string serviceAccountJson,
            CancellationToken token)
        {
            // GCP DNS record names must end with a trailing dot
            var fqdn = recordName.EndsWith('.') ? recordName : recordName + ".";
            var url = $"dns/v1/projects/{projectId}/managedZones/{zoneName}/rrsets/{Uri.EscapeDataString(fqdn)}/TXT";

            // rrsets.patch is a mutating call; it requires an OAuth2 bearer token, not an API key.
            string accessToken;
            try
            {
                accessToken = await _tokenProvider.GetAccessTokenAsync(serviceAccountJson, GoogleDnsScope, token);
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failed to obtain Google Cloud access token");
                return Result.Fail(ex is CustomAPIError apiError
                    ? apiError
                    : new CustomAPIError($"Failed to obtain Google Cloud access token: {ex.Message}"));
            }

            var httpRequest = new HttpRequestMessage(HttpMethod.Patch, url);
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(request));
            httpRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var tryPatch = await _httpClient.ProcessHttpRequestAsyncGoogleCloud(
                httpRequest, "Updating Google Cloud DNS Record", _logger);
            if (tryPatch.IsFailed) return Result.Fail(tryPatch.Errors);
            return tryPatch.Value!;
        }
    }
}
