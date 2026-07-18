using Action_Delay_API_Core.Models.Services.ClickHouse;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics
{
    public class JobSuccessRateDTO
    {
        public JobSuccessRateDTO()
        {
        }

        public JobSuccessRateDTO(JobSuccessRateAnalytics analytics, string jobName)
        {
            JobName = jobName;
            GroupByMinutesInterval = analytics.GroupByMinutesInterval;
            SuccessCount = analytics.SuccessCount;
            TotalCount = analytics.TotalCount;
            SuccessRate = analytics.TotalCount > 0
                ? Math.Round((double)analytics.SuccessCount / analytics.TotalCount * 100.0, 2)
                : (double?)null;

            Points = new List<JobSuccessRatePointDTO>(analytics.Points.Count);
            foreach (var point in analytics.Points)
            {
                Points.Add(new JobSuccessRatePointDTO()
                {
                    TimePeriod = point.TimePeriod,
                    SuccessCount = point.SuccessCount,
                    TotalCount = point.TotalCount,
                    SuccessRate = point.TotalCount > 0
                        ? Math.Round((double)point.SuccessCount / point.TotalCount * 100.0, 2)
                        : (double?)null,
                });
            }
        }

        [JsonPropertyName("jobName")]
        public string JobName { get; set; }

        [JsonPropertyName("groupByMinutesInterval")]
        public int GroupByMinutesInterval { get; set; }

        [JsonPropertyName("successCount")]
        public ulong SuccessCount { get; set; }

        [JsonPropertyName("totalCount")]
        public ulong TotalCount { get; set; }

        [JsonPropertyName("successRate")]
        public double? SuccessRate { get; set; }

        [JsonPropertyName("points")]
        public List<JobSuccessRatePointDTO> Points { get; set; }
    }

    public class JobSuccessRatePointDTO
    {
        [JsonPropertyName("timePeriod")]
        public DateTime TimePeriod { get; set; }

        [JsonPropertyName("successCount")]
        public ulong SuccessCount { get; set; }

        [JsonPropertyName("totalCount")]
        public ulong TotalCount { get; set; }

        [JsonPropertyName("successRate")]
        public double? SuccessRate { get; set; }
    }
}
