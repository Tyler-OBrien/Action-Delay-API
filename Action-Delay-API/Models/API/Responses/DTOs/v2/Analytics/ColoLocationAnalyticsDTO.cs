using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Services.ClickHouse;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics;

public class ColoLocationAnalyticsDTO
{
    public ColoLocationAnalyticsDTO() { }

    public ColoLocationAnalyticsDTO(ColoLocationAnalytics analytics, string locationName, string jobName)
    {
        LocationName = locationName;
        JobName = jobName;
        GroupByMinutesInterval = analytics.GroupByMinutesInterval;
        Points = new List<ColoLocationAnalyticsPointDTO>(analytics.Points.Count);
        foreach (var point in analytics.Points)
        {
            Points.Add(new ColoLocationAnalyticsPointDTO
            {
                TimePeriod = point.TimePeriod,
                ColoId = point.ColoId,
                RunCount = point.RunCount,
                MedianLatency = point.MedianLatency,
                AvgLatency = point.AvgLatency,
            });
        }
    }

    [JsonPropertyName("points")]
    public List<ColoLocationAnalyticsPointDTO> Points { get; set; }

    [JsonPropertyName("locationName")]
    public string LocationName { get; set; }

    [JsonPropertyName("jobName")]
    public string JobName { get; set; }

    [JsonPropertyName("groupByMinutesInterval")]
    public int GroupByMinutesInterval { get; set; }
}

public class ColoLocationAnalyticsPointDTO
{
    [JsonPropertyName("timePeriod")]
    public DateTime TimePeriod { get; set; }

    [JsonPropertyName("coloId")]
    public int ColoId { get; set; }

    [JsonPropertyName("runCount")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public ulong RunCount { get; set; }

    [JsonPropertyName("medianLatency")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public ulong MedianLatency { get; set; }

    [JsonPropertyName("avgLatency")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public ulong AvgLatency { get; set; }
}
