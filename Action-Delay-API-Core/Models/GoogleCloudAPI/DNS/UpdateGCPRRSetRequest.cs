using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.GoogleCloudAPI.DNS
{
    public class UpdateGCPRRSetRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("ttl")]
        public int Ttl { get; set; }

        [JsonPropertyName("rrdatas")]
        public List<string> Rrdatas { get; set; }
    }
}
