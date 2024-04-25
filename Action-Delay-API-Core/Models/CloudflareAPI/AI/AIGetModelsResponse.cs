using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.AI
{
    public class AIGetModelsResponse
    {
        public partial class AIGetModelsResponseDTO
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("source")]
            public long Source { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("description")]
            public string Description { get; set; }

            [JsonPropertyName("task")]
            public Task Task { get; set; }

            [JsonPropertyName("tags")]
            public string[] Tags { get; set; }

            [JsonPropertyName("properties")]
            public Property[] Properties { get; set; }
        }

        public partial class Property
        {
            [JsonPropertyName("property_id")]
            public string PropertyId { get; set; }

            [JsonPropertyName("value")]
            public string Value { get; set; }
        }

        public partial class Task
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("description")]
            public string Description { get; set; }
        }
    }
}
