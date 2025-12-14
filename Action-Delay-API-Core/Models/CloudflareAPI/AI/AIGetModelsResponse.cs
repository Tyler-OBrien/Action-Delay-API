using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive;
using System.Text;
using System.Text.Json;
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


            [JsonPropertyName("name")]
            public string Name { get; set; }


            [JsonPropertyName("task")]
            public Task Task { get; set; }

            [JsonPropertyName("properties")]
            public AIModelResponseProperty[] Properties { get; set; }


        }

        public partial class AIModelResponseProperty
        {
            [JsonPropertyName("property_id")]
            public string PropertyId { get; set; }
            [JsonPropertyName("value")]
            public JsonElement Value { get; set; }

            // Helper to get string values only
            public string GetStringValue()
            {
                return Value.ValueKind == JsonValueKind.String ? Value.GetString() : null;
            }

        }




        public partial class Task
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

        }
    }
}
