using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.BunnyAPI;
using Action_Delay_API_Core.Models.BunnyAPI.DNS;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial class BunnyAPIBroker
    {

        public async Task<Result<BunnyAPIResponse>> UpdateDNSRecord(string recordId, string zoneId, BunnyUpdateRecordRequest newUpdateRequest, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"dnszone/{zoneId}/records/{recordId}");
            request.Headers.Add("ACCESSKEY", $"{apiToken}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(newUpdateRequest));
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsyncNoResponseBunny(request, $"Updating Bunny DNS Record",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
