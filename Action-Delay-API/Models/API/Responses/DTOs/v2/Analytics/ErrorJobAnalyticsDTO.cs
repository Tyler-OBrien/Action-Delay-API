using Action_Delay_API.Models.API.Requests.DTOs.v2.Analytics;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using Swashbuckle.AspNetCore.Filters;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics
{
    public class ErrorJobAnalyticsDTORequestExample : IExamplesProvider<AnalyticsQueryParams>
    {
        public AnalyticsQueryParams GetExamples()
        {
            return new AnalyticsQueryParams()
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                MaxPoints = 100,
            };
        }
    }


    public class ErrorJobAnalyticsDTO
    {
        public ErrorJobAnalyticsDTO()
        {

        }
        public ErrorJobAnalyticsDTO(ErrorJobAnalytics analytics, string jobName, Dictionary<string, string> errorHashesToNames)
        {
            JobName = jobName;
            GroupByMinutesInterval = analytics.GroupByMinutesInterval;
            Points = new List<ErrorJobAnalyticsPointDTO>(analytics.Points.Count);
            foreach (var normalJobAnalyticsPoint in analytics.Points)
            {
                var newPoint = new ErrorJobAnalyticsPointDTO()
                {
                    TimePeriod = normalJobAnalyticsPoint.TimePeriod,
                    JobName = normalJobAnalyticsPoint.JobName,

                    Count = normalJobAnalyticsPoint.Count,
                };
                if (errorHashesToNames.TryGetValue(normalJobAnalyticsPoint.ErrorHash, out var errorInfo))
                    newPoint.Error = errorInfo;
                else
                    newPoint.Error = $"Unable to Resolve, Error Hash: {normalJobAnalyticsPoint.ErrorHash}";
                Points.Add(newPoint);
            }
        }
        [JsonPropertyName("points")]
        public List<ErrorJobAnalyticsPointDTO> Points { get; set; }



        [JsonPropertyName("jobName")]
        public string JobName { get; set; }

        [JsonPropertyName("groupByMinutesInterval")]
        public int GroupByMinutesInterval { get; set; }
    }

    public class ErrorJobAnalyticsPointDTO
    {
        [JsonPropertyName("timePeriod")]
        public DateTime TimePeriod { get; set; }


        [JsonPropertyName("jobName")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string JobName { get; set; }

        [JsonPropertyName("error")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Error { get; set; }

        [JsonPropertyName("count")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public ulong Count { get; set; }


    }
}
