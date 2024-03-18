using Action_Delay_API_Core.Models.Database.Postgres;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Responses.DTOs
{

    public class JobDataResponseExample : IExamplesProvider<DataResponse<JobDataResponse>>
    {
        public DataResponse<JobDataResponse> GetExamples()
        {
            return new DataResponse<JobDataResponse>(
                new JobDataResponse()
                {
                   JobName = "DNS Delay Job",
                   CurrentRunLengthMs = 5000,
                   CurrentRunStatus = "Undeployed",
                   CurrentRunTime = DateTime.UtcNow,
                   LastRunLengthMs = 50,
                   LastRunStatus = "Deployed",
                   LastRunTime = DateTime.UtcNow - TimeSpan.FromMinutes(2),
                }
            );
        }
    }
    public class JobDataResponse
    {
        [JsonPropertyName("jobName")]

        public string JobName { get; set; }

        [JsonPropertyName("lastRunTime")]
        public DateTime? LastRunTime { get; set; }
        [JsonPropertyName("lastRunLengthMs")]
        public UInt64? LastRunLengthMs { get; set; }
        [JsonPropertyName("lastRunStatus")]
        public string? LastRunStatus { get; set; }

        [JsonPropertyName("currentRunTime")]
        public DateTime? CurrentRunTime { get; set; }
        [JsonPropertyName("currentRunLengthMs")]
        public UInt64? CurrentRunLengthMs { get; set; }
        [JsonPropertyName("currentRunStatus")]
        public string? CurrentRunStatus { get; set; }


        public static JobDataResponse FromJobData(JobData data)
        {
            var newJobDataResponse = new JobDataResponse();
            newJobDataResponse.JobName = data.JobName;
            newJobDataResponse.LastRunTime = data.LastRunTime;
            newJobDataResponse.LastRunLengthMs = data.LastRunLengthMs;
            newJobDataResponse.LastRunStatus = data.LastRunStatus;
            newJobDataResponse.CurrentRunTime = data.CurrentRunTime;
            newJobDataResponse.CurrentRunLengthMs = data.CurrentRunLengthMs;
            newJobDataResponse.CurrentRunStatus = data.CurrentRunStatus;
            return newJobDataResponse;
        }

    }
}
