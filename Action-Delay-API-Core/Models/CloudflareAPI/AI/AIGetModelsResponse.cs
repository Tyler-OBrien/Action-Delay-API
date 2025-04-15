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


            [JsonPropertyName("name")]
            public string Name { get; set; }


            [JsonPropertyName("task")]
            public Task Task { get; set; }


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
