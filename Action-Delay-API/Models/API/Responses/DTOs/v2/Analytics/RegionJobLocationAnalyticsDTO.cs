using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Services.ClickHouse;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics
{
    public class RegionJobLocationAnalyticsDTO
    {
        public RegionJobLocationAnalyticsDTO()
        {

        }

        public RegionJobLocationAnalyticsDTO(RegionJobAnalytics analytics, string regionName, string jobName)
        {
            RegionName = regionName;
            JobName = jobName;
            GroupByMinutesInterval = analytics.GroupByMinutesInterval;
            Points = new List<RegionJobLocationAnalyticsPointDTO>(analytics.Points.Count);
            foreach (var normalJobAnalyticsPoint in analytics.Points)
            {
                Points.Add(new RegionJobLocationAnalyticsPointDTO()
                {
                    TimePeriod = normalJobAnalyticsPoint.TimePeriod,
                    EventCount = normalJobAnalyticsPoint.EventCount,
                    Region = normalJobAnalyticsPoint.FriendlyRegionName,
                });
            }
        }
        [JsonPropertyName("points")]
        public List<RegionJobLocationAnalyticsPointDTO> Points { get; set; }

        [JsonPropertyName("regionName")]
        public string RegionName { get; set; }


        [JsonPropertyName("jobName")]
        public string JobName { get; set; }

        [JsonPropertyName("groupByMinutesInterval")]
        public int GroupByMinutesInterval { get; set; }

    }
    public class RegionJobLocationAnalyticsPointDTO
    {
        [JsonPropertyName("timePeriod")]
        public DateTime TimePeriod { get; set; }

        [JsonPropertyName("region")]
        public string Region { get; set; }

        [JsonPropertyName("eventCount")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? EventCount { get; set; }

    }
}
