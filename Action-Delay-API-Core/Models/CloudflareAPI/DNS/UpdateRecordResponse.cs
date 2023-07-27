using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.DNS
{
    public class UpdateRecordResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("zone_id")]
        public string ZoneId { get; set; }

        [JsonPropertyName("zone_name")]
        public string ZoneName { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; }

        [JsonPropertyName("proxiable")]
        public bool Proxiable { get; set; }

        [JsonPropertyName("proxied")]
        public bool Proxied { get; set; }

        [JsonPropertyName("ttl")]
        public long Ttl { get; set; }

        [JsonPropertyName("locked")]
        public bool Locked { get; set; }

        [JsonPropertyName("meta")]
        public DNSRecordMeta Meta { get; set; }

        [JsonPropertyName("comment")]
        public string Comment { get; set; }

        [JsonPropertyName("tags")]
        public List<string> Tags { get; set; }

        [JsonPropertyName("created_on")]
        public DateTimeOffset CreatedOn { get; set; }

        [JsonPropertyName("modified_on")]
        public DateTimeOffset ModifiedOn { get; set; }
    }

    public class DNSRecordMeta
    {
        [JsonPropertyName("auto_added")]
        public bool AutoAdded { get; set; }

        [JsonPropertyName("managed_by_apps")]
        public bool ManagedByApps { get; set; }

        [JsonPropertyName("managed_by_argo_tunnel")]
        public bool ManagedByArgoTunnel { get; set; }

        [JsonPropertyName("source")]
        public string Source { get; set; }
    }
}
