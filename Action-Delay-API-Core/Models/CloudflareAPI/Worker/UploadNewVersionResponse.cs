using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.Worker
{
    public class UploadNewWorkerVersionResponseDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
    }
}
