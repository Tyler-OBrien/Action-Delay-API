using Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        public Task<Result<ApiResponse<PurgeCacheByURLResponse>>> PurgeSingleURLCache(string zoneId,
            PurgeCacheByURLRequest newUpdateRequest, string apiToken, CancellationToken token);

    }
}
