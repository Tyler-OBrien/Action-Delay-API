using Action_Delay_API_Core.Models.BunnyAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial interface IBunnyAPIBroker
    {
        public Task<Result<BunnyAPIResponse>> PurgeSingleURLCache(string url, string apiToken, CancellationToken token);
    }
}
