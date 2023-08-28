using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache
{
    public class PurgeCacheByURLRequest
    {
        [JsonPropertyName("files")]
        public string[] Files { get; set; }
    }
}
