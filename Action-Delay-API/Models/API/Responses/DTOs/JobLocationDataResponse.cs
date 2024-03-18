using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Database.Postgres;

namespace Action_Delay_API.Models.API.Responses.DTOs;

public class JobLocationDataResponse
{
    [JsonPropertyName("locationName")] public string LocationName { get; set; }

    [JsonPropertyName("responseTimeUtc")] public double? ResponseTimeUtc { get; set; }

    [JsonPropertyName("coloId")] public int ColoId { get; set; }

    [JsonPropertyName("jobName")] public string JobName { get; set; }

    [JsonPropertyName("lastRunTime")] public DateTime? LastRunTime { get; set; }

    [JsonPropertyName("lastRunLengthMs")] public ulong? LastRunLengthMs { get; set; }

    [JsonPropertyName("lastRunStatus")] public string? LastRunStatus { get; set; }

    [JsonPropertyName("currentRunTime")] public DateTime? CurrentRunTime { get; set; }

    [JsonPropertyName("currentRunLengthMs")] public ulong? CurrentRunLengthMs { get; set; }

    [JsonPropertyName("currentRunStatus")] public string? CurrentRunStatus { get; set; }


    public static JobLocationDataResponse FromJobLocationData(JobDataLocation data)
    {
        return new JobLocationDataResponse
        {
            JobName = data.JobName,
            ColoId = data.ColoId,
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