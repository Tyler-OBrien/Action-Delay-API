using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache
{
    public partial class PurgeCacheByURLResponse
    {
        [JsonPropertyName("result")]
        public PurgeCacheByURLResponseResult Result { get; set; }

        [JsonPropertyName("success")]
        public bool Success { get; set; }
    }

    public partial class PurgeCacheByURLResponseResult
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
    }
}
