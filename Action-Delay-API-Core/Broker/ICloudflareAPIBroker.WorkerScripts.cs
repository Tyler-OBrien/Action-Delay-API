using Action_Delay_API_Core.Models.CloudflareAPI;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using FluentResults;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        Task<Result<ApiResponse<UploadWorkerScript>>> UploadWorkerScript(string workerScript, string metadata,
            string accountId, string scriptName, string apiToken, CancellationToken token);

        Task<Result<ApiResponse<UpdateCustomRuleResponse.UpdateCustomRuleResponseDto>>> UploadWorkerScriptNewVersioning(
            string workerScript, string metadata, string accountId, string scriptName, string apiToken,
            CancellationToken token);

    }
}
