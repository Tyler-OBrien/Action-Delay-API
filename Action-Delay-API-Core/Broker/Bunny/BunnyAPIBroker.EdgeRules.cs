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
using Action_Delay_API_Core.Models.BunnyAPI.EdgeRules;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial class BunnyAPIBroker
    {
        public async Task<Result<BunnyAPIResponse>> UpdateEdgeRule(string zoneId, BunnyEdgeRuleDto edgeRule, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"pullzone/{zoneId}/edgerules/addOrUpdate");
            request.Headers.Add("ACCESSKEY", $"{apiToken}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(edgeRule));
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsyncNoResponseBunny(request, $"Updating Bunny Edge Rule",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
