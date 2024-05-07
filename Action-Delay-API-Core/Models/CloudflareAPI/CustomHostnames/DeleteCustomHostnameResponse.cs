using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.CustomHostnames
{
    public class CloudflareAPIDeleteCustomHostnameResponse
    {
        public partial class DeleteCustomHostnameResponse
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("ssl")]
            public object Ssl { get; set; }

            [JsonPropertyName("created_at")]
            public DateTimeOffset CreatedAt { get; set; }
        }
    }
}
