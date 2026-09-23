using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
using FluentResults;

namespace Action_Delay_API_Core.Broker.Google
{
    public partial interface IGoogleComputeAPIBroker
    {
        /// <summary>Reads a URL map, purely for the fingerprint that <see cref="PatchUrlMap"/> requires.</summary>
        Task<Result<UrlMapResponse>> GetUrlMap(string projectId, string urlMapName, string serviceAccountJson,
            CancellationToken token);

        Task<Result<GoogleCloudAPIResponse>> PatchUrlMap(string projectId, string urlMapName,
            PatchUrlMapRequest request, string serviceAccountJson, CancellationToken token);
    }
}
