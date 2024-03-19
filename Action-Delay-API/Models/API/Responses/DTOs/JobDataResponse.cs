using Action_Delay_API_Core.Models.Database.Postgres;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Jobs;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Responses.DTOs
{

    public class JobDataResponseExample : IExamplesProvider<DataResponse<JobDataResponse>>
    {
        public DataResponse<JobDataResponse> GetExamples()
        {
            return new DataResponse<JobDataResponse>(
                new JobDataResponse
                {
                    JobName = "DNS Delay Job",
                    LastRunTime = DateTime.Parse("2024-03-19T00:29:10.949354Z"),
                    LastRunLengthMs = 892,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:30:10.968972Z"),
                    CurrentRunLengthMs = 4343,
                    CurrentRunStatus = "Deployed"
                }
            );
        }
    }

    public class JobDataArrayResponseExample : IExamplesProvider<DataResponse<JobDataResponse[]>>
    {
        public DataResponse<JobDataResponse[]> GetExamples()
        {
            return new DataResponse<JobDataResponse[]>(new[]
            {
                new JobDataResponse
                {
                    JobName = "Single URL Purge Delay Job",
                    LastRunTime = DateTime.Parse("2024-03-19T00:29:40.959663Z"),
                    LastRunLengthMs = 331,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:30:40.980616Z"),
                    CurrentRunLengthMs = 280,
                    CurrentRunStatus = "Deployed"
                },
                new JobDataResponse
                {
                    JobName = "Custom Rule Block Delay Job",
                    LastRunTime = DateTime.Parse("2024-03-19T00:28:50.947987Z"),
                    LastRunLengthMs = 4499,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:29:50.963566Z"),
                    CurrentRunLengthMs = 3339,
                    CurrentRunStatus = "Deployed"
                },
                new JobDataResponse
                {
                    JobName = "WfP User Script Delay Job",
                    LastRunTime = DateTime.Parse("2024-03-19T00:29:20.951739Z"),
                    LastRunLengthMs = 588,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:30:20.97077Z"),
                    CurrentRunLengthMs = 561,
                    CurrentRunStatus = "Deployed"
                },
                new JobDataResponse
                {
                    JobName = "DNS Delay Job Free",
                    LastRunTime = DateTime.Parse("2024-03-19T00:28:55.947179Z"),
                    LastRunLengthMs = 738,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:29:55.965535Z"),
                    CurrentRunLengthMs = 5293,
                    CurrentRunStatus = "Deployed"
                },
                new JobDataResponse
                {
                    JobName = "Worker Script Delay Job",
                    LastRunTime = DateTime.Parse("2024-03-19T00:29:30.966729Z"),
                    LastRunLengthMs = 923,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:30:30.972108Z"),
                    CurrentRunLengthMs = 820,
                    CurrentRunStatus = "Deployed"
                },
                new JobDataResponse
                {
                    JobName = "DNS Delay Job",
                    LastRunTime = DateTime.Parse("2024-03-19T00:29:10.949354Z"),
                    LastRunLengthMs = 892,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T00:30:10.968972Z"),
                    CurrentRunLengthMs = 4343,
                    CurrentRunStatus = "Deployed"
                }
            });
        }
    }
    public class JobDataResponse
    {
        [JsonPropertyName("jobName")]

        /// <summary>
        /// This field is the Friendly Name of the Job.
        /// </summary>
        public string JobName { get; set; }

        [JsonPropertyName("internalJobName")]

        /// <summary>
        /// This field is the internal Name of the Job. For use in api endpoints.
        /// </summary>
        public string InternalJobName { get; set; }

        [JsonPropertyName("lastRunTime")]
        public DateTime? LastRunTime { get; set; }
        [JsonPropertyName("lastRunLengthMs")]
        public UInt64? LastRunLengthMs { get; set; }

        /// <summary>
        /// This is the Last Run Status. There is only 5 possible statuses.
        /// "Undeployed", meaning job in process.
        /// "Deployed", meaning the job succeeded, and the RunTime is final
        /// "Pending" meaning the job is starting soon.
        /// "Errored" meaning an internal error happened causing this job to fail in an unrecoverable way.
        /// "API_Error" meaning the CF API responded with an error, on trying to perform the job action.
        /// </summary>
        [JsonPropertyName("lastRunStatus")]
        public string? LastRunStatus { get; set; }

        [JsonPropertyName("currentRunTime")]
        public DateTime? CurrentRunTime { get; set; }
        [JsonPropertyName("currentRunLengthMs")]
        public UInt64? CurrentRunLengthMs { get; set; }


        /// <summary>
        /// This is the Current Run Status. There is only 5 possible statuses.
        /// "Undeployed", meaning job in process.
        /// "Deployed", meaning the job succeeded, and the RunTime is final
        /// "Pending" meaning the job is starting soon.
        /// "Errored" meaning an internal error happened causing this job to fail in an unrecoverable way.
        /// "API_Error" meaning the CF API responded with an error, on trying to perform the job action.
        /// It is recommended you grab the predicted properties rather then these.
        /// </summary>
        [JsonPropertyName("currentRunStatus")]
        public string? CurrentRunStatus { get; set; }

        /// <summary>
        /// These are fields automatically taken from the current or past run, based on the following logic:
        ///   If the current run is deployed
        ///    If the current run is undeployed and longer then 5s
        ///    Otherwise, take the past run.
        /// This is just trying to make it easier to build an application around this. You don't want the current length if it just started, or if the latest job errored out.
        /// </summary>
        [JsonPropertyName("predictedDelayLengthMs")]
        public UInt64? PredictedDelayLengthMs { get; set; }

        [JsonPropertyName("predictedRunTime")]
        public DateTime? PredictedRunTime { get; set; }

        [JsonPropertyName("predictedRunStatus")]
        public string? PredictedRunStatus { get; set; }


        public static JobDataResponse FromJobData(JobData data)
        {
            var newJobDataResponse = new JobDataResponse();
            newJobDataResponse.JobName = data.JobName;
            newJobDataResponse.InternalJobName = data.InternalJobName;
            newJobDataResponse.LastRunTime = data.LastRunTime;
            newJobDataResponse.LastRunLengthMs = data.LastRunLengthMs;
            newJobDataResponse.LastRunStatus = data.LastRunStatus;
            newJobDataResponse.CurrentRunTime = data.CurrentRunTime;
            newJobDataResponse.CurrentRunLengthMs = data.CurrentRunLengthMs;
            newJobDataResponse.CurrentRunStatus = data.CurrentRunStatus;

            if (data?.CurrentRunStatus?.Equals(Status.STATUS_DEPLOYED, StringComparison.OrdinalIgnoreCase) ?? false)
            {
                newJobDataResponse.PredictedDelayLengthMs = data.CurrentRunLengthMs;
                newJobDataResponse.PredictedRunTime = data.CurrentRunTime;
                newJobDataResponse.PredictedRunStatus = data.CurrentRunStatus;
            }
            else if ((data?.CurrentRunStatus?.Equals(Status.STATUS_UNDEPLOYED, StringComparison.OrdinalIgnoreCase) ??
                     false) && data.CurrentRunLengthMs > 5000)
            {
                newJobDataResponse.PredictedDelayLengthMs = data.CurrentRunLengthMs;
                newJobDataResponse.PredictedRunTime = data.CurrentRunTime;
                newJobDataResponse.PredictedRunStatus = data.CurrentRunStatus;
            }
            else
            {
                newJobDataResponse.PredictedDelayLengthMs = data.LastRunLengthMs;
                newJobDataResponse.PredictedRunTime = data.LastRunTime;
                newJobDataResponse.PredictedRunStatus = data.LastRunStatus;
            }

                return newJobDataResponse;
        }

    }
}
