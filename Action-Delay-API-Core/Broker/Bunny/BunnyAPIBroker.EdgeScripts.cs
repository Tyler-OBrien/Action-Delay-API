using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using Action_Delay_API_Core.Models.CloudflareAPI.Worker;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.BunnyAPI;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial class BunnyAPIBroker
    {

        public async Task<Result<BunnyAPIResponse>> UploadEdgeScript(string workerScript, string scriptId, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"compute/script/{scriptId}/code");
            request.Headers.Add("ACCESSKEY", $"{apiToken}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(new
            {
                Code = workerScript 
            }));
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var tryPostNewVersion = await _httpClient.ProcessHttpRequestAsyncNoResponseBunny(request, $"Upload new Edge Script Version",
                _logger);
            if (tryPostNewVersion.IsFailed) return Result.Fail(tryPostNewVersion.Errors);




            var requestNewDeployment = new HttpRequestMessage(HttpMethod.Post,
                $"compute/script/{scriptId}/publish");
            requestNewDeployment.Headers.Add("ACCESSKEY", $"{apiToken}");

            requestNewDeployment.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(new
            {
                Code = "Automatic Deploy"
            }));
            requestNewDeployment.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            
            var tryPut = await _httpClient.ProcessHttpRequestAsyncNoResponseBunny(requestNewDeployment, $"Deploy new Edge Script",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            tryPut.Value.ResponseTimeMs += tryPostNewVersion.Value.ResponseTimeMs; // make it return all time
            return tryPut.Value!;

        }
    }
}
