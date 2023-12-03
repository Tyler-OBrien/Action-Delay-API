using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {

        public async Task<Result<ApiResponse<UpdateRecordResponse>>> UpdateDNSRecord(string recordId, string zoneId, UpdateRecordRequest newUpdateRequest, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Put,
                $"{BasePath}/zones/{zoneId}/dns_records/{recordId}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(newUpdateRequest));
            var tryPut = await _httpClient.ProcessHttpRequestAsync<UpdateRecordResponse>(request, $"Updating DNS Record",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

    }
}