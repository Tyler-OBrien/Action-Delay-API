using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        Task<Result<ApiResponse<UploadWorkerScript>>> UploadWFPScript(string workerScript, string metadata, string accountId, string namespaceName, string scriptName, string apiToken, CancellationToken token);

        Task<Result<ApiResponse>> DeleteWFPScript(string accountId, string namespaceName, string scriptName,
            string apiToken, CancellationToken token);
    }
}
