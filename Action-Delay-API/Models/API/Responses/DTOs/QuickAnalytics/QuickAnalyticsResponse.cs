using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs.QuickAnalytics
{
    public class QuickAnalyticsResponse
    {
        [JsonPropertyName("period")]

        public string Period { get; set; }

        [JsonPropertyName("median_run_length")]

        public string MedianRunLength { get; set; }
    }
}
