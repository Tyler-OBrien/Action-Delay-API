using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<UploadWorkerScript>>> UploadWFPScript(string workerScript, string metadata, string accountId, string namespaceName,string scriptName, string apiToken, CancellationToken token)
        {

            var formData = new MultipartFormDataContent();

            var workerScriptContent = new StringContent(workerScript);
            workerScriptContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/javascript+module");

            formData.Add(workerScriptContent, "worker.js", "worker.js");


            var metadataContent = new StringContent(metadata);
            metadataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            formData.Add(metadataContent, "metadata", "blob");



            var request = new HttpRequestMessage(HttpMethod.Put,
                $"{BasePath}/accounts/{accountId}/workers/dispatch/namespaces/{namespaceName}/scripts/{scriptName}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            request.Content = formData;
            var tryPut = await _httpClient.ProcessHttpRequestAsync<UploadWorkerScript>(request, $"Uploading WfP User Script",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse>> DeleteWFPScript(string accountId, string namespaceName, string scriptName, string apiToken, CancellationToken token)
        {

            var request = new HttpRequestMessage(HttpMethod.Delete,
                $"{BasePath}/accounts/{accountId}/workers/dispatch/namespaces/{namespaceName}/scripts/{scriptName}?force=true");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryPut = await _httpClient.ProcessHttpRequestAsyncNoResponse(request, $"Delete WfP User Script",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
