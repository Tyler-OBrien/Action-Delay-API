using Action_Delay_API_Core.Models.Local;

namespace Action_Delay_API.Extensions
{
    public static class StringEndpointExtensions
    {
        public static string ProcessEndpoint(this string endpoint, Location location)
        {
            return endpoint.Replace("{{ADP-LOCATION}}", location.Name);
        }
    }
}
