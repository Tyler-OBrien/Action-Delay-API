using System.Net.Http.Headers;
using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using Action_Delay_API_Core.Models.CloudflareAPI.Worker;
using Action_Delay_API_Core.Models.Local;
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
            var tryPut =  await _httpClient.ProcessHttpRequestAsync<UploadWorkerScript>(request, $"Uploading Worker Script",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse<UpdateCustomRuleResponse.UpdateCustomRuleResponseDto>>> UploadWorkerScriptNewVersioning(string workerScript, string metadata, string accountId, string scriptName, string apiToken, CancellationToken token)
        {

            var formData = new MultipartFormDataContent();

            var workerScriptContent = new StringContent(workerScript);
            workerScriptContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/javascript+module");

            formData.Add(workerScriptContent, "worker.js", "worker.js");


            var metadataContent = new StringContent(metadata);
            metadataContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            formData.Add(metadataContent, "metadata", "blob");



            var request = new HttpRequestMessage(HttpMethod.Post,
                $"{BasePath}/accounts/{accountId}/workers/scripts/{scriptName}/versions");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            request.Content = formData;
            var tryPostNewVersion = await _httpClient.ProcessHttpRequestAsync<UploadNewWorkerVersionResponseDto>(request, $"Upload new Worker Script Version",
                _logger);
            if (tryPostNewVersion.IsFailed) return Result.Fail(tryPostNewVersion.Errors);



            var newDeploymentRequest = new WorkerDeploymentRequestDto.WorkerDeploymentRequest()
            {
                Versions = new WorkerDeploymentRequestDto.WorkerDeploymentVersion[]
                {
                    new WorkerDeploymentRequestDto.WorkerDeploymentVersion()
                    {
                        VersionId = tryPostNewVersion.Value.Result.Id,
                        Percentage = 100
                    },
                },
                Annotations = new WorkerDeploymentRequestDto.WorkerDeploymentAnnotations()
                {
                    WorkersMessage =
                        $"Uploaded At {DateTime.UtcNow.ToString("R")} by Action-Delay-API {Program.VERSION}"
                }
            };
            var requestNewDeployment = new HttpRequestMessage(HttpMethod.Post,
                $"{BasePath}/accounts/{accountId}/workers/scripts/{scriptName}/deployments");
            requestNewDeployment.Headers.Add("Authorization", $"Bearer {apiToken}");
            requestNewDeployment.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(newDeploymentRequest));
            requestNewDeployment.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<UpdateCustomRuleResponse.UpdateCustomRuleResponseDto>(requestNewDeployment, $"Deploy new Worker Script",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            tryPut.Value.ResponseTimeMs += tryPostNewVersion.Value.ResponseTimeMs; // make it return all time
            return tryPut.Value!;

        }



    }
}
