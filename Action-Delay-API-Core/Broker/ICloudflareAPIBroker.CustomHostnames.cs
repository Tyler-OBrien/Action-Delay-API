using Action_Delay_API_Core.Models.CloudflareAPI.CustomHostnames;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        public  Task<Result<ApiResponse<CloudflareAPICreateCustomHostnameResponse.CreateCustomHostnameResponse>>>
            CreateCustomHostname(string zoneId, string hostname, string apiToken, CancellationToken token);

        public  Task<Result<ApiResponse<CloudflareAPIGetCustomHostnameResponse.GetCustomHostnameResponse>>> GetCustomHostname(string customHostnameId, string zoneId, string apiToken, CancellationToken token);

        public Task<Result<ApiResponse<ListCustomHostnameResponse.CustomHostname[]>>> ListCustomHostname(
            string hostname, string zoneId, string apiToken, CancellationToken token);

        public Task<Result<ApiResponse<CloudflareAPIDeleteCustomHostnameResponse.DeleteCustomHostnameResponse>>>
            DeleteCustomHostname(string customHostnameId, string zoneId, string apiToken, CancellationToken token);
    }
}
