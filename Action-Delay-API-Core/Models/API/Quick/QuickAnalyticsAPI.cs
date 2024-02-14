using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.API.Quick
{
    public class QuickAnalyticsAPI
    {
        [JsonPropertyName("period")]

        public string Period { get; set; }

        [JsonPropertyName("median_run_length")]

        public string MedianRunLength { get; set; }
    }
}
