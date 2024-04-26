using Action_Delay_API_Core.Models.Services.ClickHouse;
using Swashbuckle.AspNetCore.Filters;
using System.Text.Json.Serialization;
using Action_Delay_API.Models.API.Requests.DTOs.v2.Analytics;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics
{
    public class NormalJobAnalyticsRequestExample : IExamplesProvider<AnalyticsQueryParams>
    {
        public AnalyticsQueryParams GetExamples()
        {
            return new AnalyticsQueryParams()
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                MaxPoints = 100,
                Metrics =
                    "MinRunLength,MaxRunLength,AvgRunLength,MedianRunLength,MinApiResponseLatency,MaxApiResponseLatency,AvgApiResponseLatency,MedianApiResponseLatency"
            };
        }
    }


    public class NormalJobAnalyticsDTO
    {
        public NormalJobAnalyticsDTO()
        {

        }
        public NormalJobAnalyticsDTO(NormalJobAnalytics analytics, string jobName)
        {
            JobName = jobName;
            GroupByMinutesInterval = analytics.GroupByMinutesInterval;
            Points = new List<NormalJobAnalyticsPointDTO>(analytics.Points.Count);
            foreach (var normalJobAnalyticsPoint in analytics.Points)
            {
                Points.Add(new NormalJobAnalyticsPointDTO()
                {
                    TimePeriod = normalJobAnalyticsPoint.TimePeriod,
                    MinRunLength = normalJobAnalyticsPoint.MinRunLength,
                    MaxRunLength = normalJobAnalyticsPoint.MaxRunLength,
                    AvgRunLength = normalJobAnalyticsPoint.AvgRunLength,
                    MedianRunLength = normalJobAnalyticsPoint.MedianRunLength,

                    MinApiResponseLatency = normalJobAnalyticsPoint.MinResponseLatency,
                    MaxApiResponseLatency = normalJobAnalyticsPoint.MaxResponseLatency,
                    AvgApiResponseLatency = normalJobAnalyticsPoint.AvgResponseLatency,
                    MedianApiResponseLatency = normalJobAnalyticsPoint.MedianResponseLatency,
                    Undeployed = normalJobAnalyticsPoint.Undeployed,
                });
            }
        }
        [JsonPropertyName("points")]
        public List<NormalJobAnalyticsPointDTO> Points { get; set; }

        [JsonPropertyName("jobName")]
        public string JobName { get; set; }

        [JsonPropertyName("groupByMinutesInterval")]
        public int GroupByMinutesInterval { get; set; }
    }

    public class NormalJobAnalyticsPointDTO
    {
        [JsonPropertyName("timePeriod")]
        public DateTime TimePeriod { get; set; }

        [JsonPropertyName("undeployed")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? Undeployed { get; set; }


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
        [JsonPropertyName("minApiResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MinApiResponseLatency { get; set; }
        [JsonPropertyName("maxApiResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MaxApiResponseLatency { get; set; }
        [JsonPropertyName("avgApiResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? AvgApiResponseLatency { get; set; }
        [JsonPropertyName("medianApiResponseLatency")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ulong? MedianApiResponseLatency { get; set; }
    }
}
