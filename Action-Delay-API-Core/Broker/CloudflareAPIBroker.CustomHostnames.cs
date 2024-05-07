using Action_Delay_API_Core.Models.CloudflareAPI.CustomHostnames;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System.Text;
using Action_Delay_API_Core.Extensions;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<CloudflareAPICreateCustomHostnameResponse.CreateCustomHostnameResponse>>> CreateCustomHostname(string zoneId, string hostname, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"{BasePath}/zones/{zoneId}/custom_hostnames");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var json = System.Text.Json.JsonSerializer.Serialize(new CloudflareAPICreateCustomHostnameRequest.CreateCustomHostname(hostname));
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<CloudflareAPICreateCustomHostnameResponse.CreateCustomHostnameResponse>(request, $"Creating Custom Hostname for {hostname}",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse<CloudflareAPIGetCustomHostnameResponse.GetCustomHostnameResponse>>> GetCustomHostname(string customHostnameId, string zoneId, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"{BasePath}/zones/{zoneId}/custom_hostnames/{customHostnameId}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryPut =
                await _httpClient
                    .ProcessHttpRequestAsync<CloudflareAPIGetCustomHostnameResponse.GetCustomHostnameResponse>(request,
                        $"Getting Custom Hostname {customHostnameId}",
                        _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse<ListCustomHostnameResponse.CustomHostname[]>>> ListCustomHostname(string hostname, string zoneId, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"{BasePath}/zones/{zoneId}/custom_hostnames?hostname={hostname}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryPut =
                await _httpClient
                    .ProcessHttpRequestAsync<ListCustomHostnameResponse.CustomHostname[]>(request,
                        $"Listing Custom Hostname {hostname}",
                        _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse<CloudflareAPIDeleteCustomHostnameResponse.DeleteCustomHostnameResponse>>> DeleteCustomHostname(string customHostnameId, string zoneId, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete,
                $"{BasePath}/zones/{zoneId}/custom_hostnames/{customHostnameId}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<CloudflareAPIDeleteCustomHostnameResponse.DeleteCustomHostnameResponse>(request, $"Deleting Custom Hostname {customHostnameId}",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
