using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.DNS;
using FluentResults;

namespace Action_Delay_API_Core.Broker.Google
{
    public partial interface IGoogleCloudAPIBroker
    {
        Task<Result<GoogleCloudAPIResponse>> UpdateDNSRecord(
            string projectId,
            string zoneName,
            string recordName,
            UpdateGCPRRSetRequest request,
            string serviceAccountJson,
            CancellationToken token);
    }
}
