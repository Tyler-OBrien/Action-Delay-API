using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using Action_Delay_API_Core.Models.CloudflareAPI.GraphQL;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        public Task<Result<ApiResponse<ZoneAnalyticsDateTime.Data>>> GetLastZoneAnalytic(string zoneId,
            string datetimeGreaterThen, string apiToken, CancellationToken token);

        public Task<Result<ApiResponse<WorkerAnalyticsDatetime.Data>>> GetLastWorkerAnalytic(string scriptName,
            string accountTag, string datetimeGreaterThen, string apiToken, CancellationToken token);


    }
}
