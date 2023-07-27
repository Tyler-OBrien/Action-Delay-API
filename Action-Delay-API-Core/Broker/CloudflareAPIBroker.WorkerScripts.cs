using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<UploadWorkerScript>>> UploadWorkerScript(string workerScript, string metadata, string accountId, string scriptName, string apiToken, CancellationToken token)
        {

            var formData = new MultipartFormDataContent();

            var workerScriptContent = new StringContent(workerScript);
            workerScriptContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/javascript+module");

            formData.Add(workerScriptContent, "worker.js", "worker.js");


            var metadataContent = new StringContent(metadata);
            metadataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            formData.Add(metadataContent, "metadata", "blob");



            var request = new HttpRequestMessage(HttpMethod.Put,
                $"{BasePath}/accounts/{accountId}/workers/services/{scriptName}/environments/production");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            request.Content = formData;
            var response = await _httpClient.SendAsync(request, token);
            var tryPut =  await response.ProcessHttpResponseAsync<UploadWorkerScript, object>($"Uploading Worker Script",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

 
    }
}
