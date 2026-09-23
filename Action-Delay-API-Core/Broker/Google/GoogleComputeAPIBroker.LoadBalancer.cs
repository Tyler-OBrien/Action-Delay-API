using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
using FluentResults;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Action_Delay_API_Core.Broker.Google
{
    public partial class GoogleComputeAPIBroker
    {
        public async Task<Result<UrlMapResponse>> GetUrlMap(
            string projectId,
            string urlMapName,
            string serviceAccountJson,
            CancellationToken token)
        {
            var tryGetToken = await TryGetAccessToken(serviceAccountJson, token);
            if (tryGetToken.IsFailed) return Result.Fail(tryGetToken.Errors);

            var httpRequest = new HttpRequestMessage(HttpMethod.Get,
                $"compute/v1/projects/{projectId}/global/urlMaps/{urlMapName}");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tryGetToken.Value);

            var tryGet = await _httpClient.ProcessHttpRequestAsyncGoogleCloud<UrlMapResponse>(
                httpRequest, "Getting Google Cloud URL Map", _logger);
            if (tryGet.IsFailed) return Result.Fail(tryGet.Errors);

            if (string.IsNullOrWhiteSpace(tryGet.Value?.Fingerprint))
                return Result.Fail(new CustomAPIError(
                    $"Google Cloud URL Map {urlMapName} returned no fingerprint, cannot patch it"));

            return tryGet.Value!;
        }

        public async Task<Result<GoogleCloudAPIResponse>> PatchUrlMap(
            string projectId,
            string urlMapName,
            PatchUrlMapRequest request,
            string serviceAccountJson,
            CancellationToken token)
        {
            var tryGetToken = await TryGetAccessToken(serviceAccountJson, token);
            if (tryGetToken.IsFailed) return Result.Fail(tryGetToken.Errors);

            var httpRequest = new HttpRequestMessage(HttpMethod.Patch,
                $"compute/v1/projects/{projectId}/global/urlMaps/{urlMapName}");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tryGetToken.Value);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(request));
            httpRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            // Returns a PENDING global Operation; we deliberately do not wait for it to reach DONE, so the
            // measurement stays end-to-end from "the API accepted the change".
            var tryPatch = await _httpClient.ProcessHttpRequestAsyncGoogleCloud(
                httpRequest, "Updating Google Cloud URL Map", _logger);
            if (tryPatch.IsFailed) return Result.Fail(tryPatch.Errors);
            return tryPatch.Value!;
        }
    }
}
