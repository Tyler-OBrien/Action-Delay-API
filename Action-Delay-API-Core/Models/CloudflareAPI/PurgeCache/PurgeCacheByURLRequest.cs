using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache
{
    public class PurgeCacheByURLRequest
    {
        [JsonPropertyName("files")]
        public string[] Files { get; set; }
    }
}
