using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics
{
    [ImmutableObject(true)]
    public class OverallAnalyticsResponseDTO
    {
        [JsonPropertyName("normalJobPerLocationRunsLast24H")]
        public ulong NormalJobPerLocationRunsLast24H { get; set; }

        [JsonPropertyName("perfJobPerLocationRunsLast24H")]
        public ulong PerfJobPerLocationRunsLast24H { get; set; }


        [JsonPropertyName("uniqueJobs")]
        public int UniqueJobs { get; set; }

        [JsonPropertyName("uniqueLocations")]
        public int UniqueLocations { get; set; }


        [JsonPropertyName("cacheDate")]
        public DateTime CacheDate { get; set; }
    }
}
