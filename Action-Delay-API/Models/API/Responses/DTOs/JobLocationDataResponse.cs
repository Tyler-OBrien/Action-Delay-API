using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Database.Postgres;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Responses.DTOs;


public class JobLocationDataResponseExample : IExamplesProvider<DataResponse<JobLocationDataResponse>>
{
    public DataResponse<JobLocationDataResponse> GetExamples()
    {
        return new DataResponse<JobLocationDataResponse>(
            new JobLocationDataResponse
            {
                JobName = "Single URL Purge Delay Job",
                LocationName = "FRA",
                LastRunTime = DateTime.Parse("2024-03-19T02:30:40.642133Z"),
                LastRunLengthMs = 280,
                LastRunStatus = "Deployed",
                CurrentRunTime = DateTime.Parse("2024-03-19T02:31:40.647007Z"),
                CurrentRunLengthMs = 277,
                CurrentRunStatus = "Deployed"
            }
        );
    }
}

public class JobLocationDataArrayResponseExample : IExamplesProvider<DataResponse<JobLocationDataResponse[]>>
{
    public DataResponse<JobLocationDataResponse[]> GetExamples()
    {
        return new DataResponse<JobLocationDataResponse[]>(
            new[]
            {
                new JobLocationDataResponse
                {
                    JobName = "Single URL Purge Delay Job",
                    LocationName = "FRA",
                    LastRunTime = DateTime.Parse("2024-03-19T02:30:40.642133Z"),
                    LastRunLengthMs = 280,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T02:31:40.647007Z"),
                    CurrentRunLengthMs = 277,
                    CurrentRunStatus = "Deployed"
                },
                new JobLocationDataResponse
                {
                    JobName = "Single URL Purge Delay Job",
                    LocationName = "SIN",
                    LastRunTime = DateTime.Parse("2024-03-19T02:30:40.645017Z"),
                    LastRunLengthMs = 305,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T02:31:40.648633Z"),
                    CurrentRunLengthMs = 301,
                    CurrentRunStatus = "Deployed"
                },
                new JobLocationDataResponse
                {
                    JobName = "Single URL Purge Delay Job",
                    LocationName = "BOM",
                    LastRunTime = DateTime.Parse("2024-03-19T02:30:40.635725Z"),
                    LastRunLengthMs = 377,
                    LastRunStatus = "Deployed",
                    CurrentRunTime = DateTime.Parse("2024-03-19T02:31:40.64271Z"),
                    CurrentRunLengthMs = 369,
                    CurrentRunStatus = "Deployed"
                }

            }
        );
    }
}

public class JobLocationDataResponse
{
    [JsonPropertyName("locationName")] public string LocationName { get; set; }

    [JsonPropertyName("responseTimeUtc")] public double? ResponseTimeUtc { get; set; }

    [JsonPropertyName("jobName")] public string JobName { get; set; }
    [JsonPropertyName("internalJobName")] public string InternalJobName { get; set; }

    [JsonPropertyName("lastRunTime")] public DateTime? LastRunTime { get; set; }

    [JsonPropertyName("lastRunLengthMs")] public ulong? LastRunLengthMs { get; set; }


    /// <summary>
    /// This is the Last Run Status. There is only 5 possible statuses.
    /// "Undeployed", meaning job in process.
    /// "Deployed", meaning the job succeeded, and the RunTime is final
    /// "Pending" meaning the job is starting soon.
    /// "Errored" meaning an internal error happened causing this job to fail in an unrecoverable way.
    /// "API_Error" meaning the CF API responded with an error, on trying to perform the job action.
    /// It is recommended you grab the predicted properties rather then these.
    /// </summary>
    [JsonPropertyName("lastRunStatus")] public string? LastRunStatus { get; set; }

    [JsonPropertyName("currentRunTime")] public DateTime? CurrentRunTime { get; set; }

    [JsonPropertyName("currentRunLengthMs")] public ulong? CurrentRunLengthMs { get; set; }



    /// <summary>
    /// This is the Current Run Status. There is only 5 possible statuses.
    /// "Undeployed", meaning job in process.
    /// "Deployed", meaning the job succeeded, and the RunTime is final
    /// "Pending" meaning the job is starting soon.
    /// "Errored" meaning an internal error happened causing this job to fail in an unrecoverable way.
    /// "API_Error" meaning the CF API responded with an error, on trying to perform the job action.
    /// It is recommended you grab the predicted properties rather then these.
    /// </summary>
    [JsonPropertyName("currentRunStatus")] public string? CurrentRunStatus { get; set; }


    public static JobLocationDataResponse FromJobLocationData(JobDataLocation data)
    {
        return new JobLocationDataResponse
        {
            JobName = data.JobName,
            InternalJobName = data.InternalJobName,
            LastRunTime = data.LastRunTime,
            LastRunLengthMs = data.LastRunLengthMs,
            LastRunStatus = data.LastRunStatus,
            CurrentRunTime = data.CurrentRunTime,
            CurrentRunLengthMs = data.CurrentRunLengthMs,
            CurrentRunStatus = data.CurrentRunStatus,
            ResponseTimeUtc = data.ResponseTimeUtc,
            LocationName = data.LocationName
        };
        
    }
}