using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs.QuickAnalytics
{
    public class QuickAnalyticsResponse
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [JsonPropertyName("job_name")]

        public string JobName { get; set; }


        [JsonPropertyName("period")]

        public string Period { get; set; }

        [JsonPropertyName("median_run_length")]

        public string MedianRunLength { get; set; }
    }
}
