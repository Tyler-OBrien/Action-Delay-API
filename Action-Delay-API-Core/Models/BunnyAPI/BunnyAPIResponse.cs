using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.BunnyAPI
{
    public class BunnyAPIResponse
    {
        [JsonPropertyName("ErrorKey")]
        public string? ErrorKey { get; set; }

        [JsonPropertyName("Field")]
        public string? Field { get; set; }

        [JsonPropertyName("Message")]
        public string? Message { get; set; }



        // Extensions making it easier to pass metadata around
        [JsonIgnore(Condition = JsonIgnoreCondition.Always)] 
        [JsonPropertyName("success")] public bool Success { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public double? ResponseTimeMs { get; set; }

        [NotMapped]
        [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public int ColoId { get; set; }
    }
}
