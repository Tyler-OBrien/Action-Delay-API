using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Requests.DTOs;

public class JobResultRequestDTO
{
    [JsonPropertyName("jobName")]
    public string JobName { get; set; }

    [JsonPropertyName("internalJobName")]
    public string InternalJobName { get; set; }

    [JsonPropertyName("runTime")]
    public DateTime RunTime { get; set; }


    [JsonPropertyName("runLengthMs")]
    public UInt64 RunLengthMs { get; set; }

    [JsonPropertyName("coloId")]
    public int? ColoId { get; set; }


    [JsonPropertyName("runStatus")]
    public string RunStatus { get; set; }

    [JsonPropertyName("calculateRunLengthFromLastTime")]
    public bool CalculateRunLengthFromLastTime { get; set; }

    [JsonPropertyName("calculateColoIdFromRequestHeader")]
    public bool CalculateColoIdFromRequestHeader { get; set; }

    [JsonPropertyName("apiResponseLatency")]
    public uint? APIResponseLatency { get; set; }
}