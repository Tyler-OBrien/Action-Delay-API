using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.BunnyAPI;
using FluentResults;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial class BunnyAPIBroker
    {
        // https://docs.bunny.net/reference/purgepublic_indexpost - purges a single URL across all pull zones.
        public async Task<Result<BunnyAPIResponse>> PurgeSingleURLCache(string url, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"purge?url={Uri.EscapeDataString(url)}&async=false");
            request.Headers.Add("ACCESSKEY", $"{apiToken}");
            var tryPurge = await _httpClient.ProcessHttpRequestAsyncNoResponseBunny(request, $"Purge Single URL Cache",
                _logger);
            if (tryPurge.IsFailed) return Result.Fail(tryPurge.Errors);
            return tryPurge.Value!;
        }
    }
}
