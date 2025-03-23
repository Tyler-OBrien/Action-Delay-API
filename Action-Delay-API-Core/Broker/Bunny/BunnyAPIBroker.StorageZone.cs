using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.BunnyAPI.DNS;
using Action_Delay_API_Core.Models.BunnyAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial class BunnyAPIBroker
    {
        public async Task<Result<BunnyAPIResponse>> UploadFileStorageZone(string storageZone, string fileName, string data, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Put,
                $"https://storage.bunnycdn.com/{storageZone}/{fileName}");
            request.Headers.Add("ACCESSKEY", $"{apiToken}");
            request.Content = new StringContent(data);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
            var tryPut = await _httpClient.ProcessHttpRequestAsyncNoResponseBunny(request, $"Upload File Storage Zone",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
