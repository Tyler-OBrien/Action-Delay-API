using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Services.ClickHouse;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics
{
    public class NormalJobLocationAnalyticsDTO
    {
        public NormalJobLocationAnalyticsDTO()
        {

        }

        public NormalJobLocationAnalyticsDTO(NormalJobAnalytics analytics, string locationName, string jobName)
        {
            LocationName = locationName;
            JobName = jobName;
            GroupByMinutesInterval = analytics.GroupByMinutesInterval;
            Points = new List<NormalJobLocationAnalyticsPointDTO>(analytics.Points.Count);
            foreach (var normalJobAnalyticsPoint in analytics.Points)
            {
                Points.Add(new NormalJobLocationAnalyticsPointDTO()
                {
                    TimePeriod = normalJobAnalyticsPoint.TimePeriod,
                    MinRunLength = normalJobAnalyticsPoint.MinRunLength,
                    MaxRunLength = normalJobAnalyticsPoint.MaxRunLength,
                    AvgRunLength = normalJobAnalyticsPoint.AvgRunLength,
                    MedianRunLength = normalJobAnalyticsPoint.MedianRunLength,

                    MinEdgeResponseLatency = normalJobAnalyticsPoint.MinResponseLatency,
                    MaxEdgeResponseLatency = normalJobAnalyticsPoint.MaxResponseLatency,
                    AvgEdgeResponseLatency = normalJobAnalyticsPoint.AvgResponseLatency,
                    MedianEdgeResponseLatency = normalJobAnalyticsPoint.MedianResponseLatency,
                });
            }
        }
        [JsonPropertyName("points")]
        public List<NormalJobLocationAnalyticsPointDTO> Points { get; set; }

        [JsonPropertyName("locationName")]
        public string LocationName { get; set; }


        [JsonPropertyName("jobName")]
        public string JobName { get; set; }

        [JsonPropertyName("groupByMinutesInterval")]
        public int GroupByMinutesInterval { get; set; }

    }
    public class NormalJobLocationAnalyticsPointDTO
    {
        [JsonPropertyName("timePeriod")]
        public DateTime TimePeriod { get; set; }

        [JsonPropertyName("minRunLength")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MinRunLength { get; set; }
        [JsonPropertyName("maxRunLength")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MaxRunLength { get; set; }
        [JsonPropertyName("avgRunLength")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? AvgRunLength { get; set; }
        [JsonPropertyName("medianRunLength")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MedianRunLength { get; set; }
        [JsonPropertyName("minEdgeResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MinEdgeResponseLatency { get; set; }
        [JsonPropertyName("maxEdgeResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MaxEdgeResponseLatency { get; set; }
        [JsonPropertyName("avgEdgeResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? AvgEdgeResponseLatency { get; set; }
        [JsonPropertyName("medianEdgeResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MedianEdgeResponseLatency { get; set; }
    }
}
