using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Models.Database.Postgres;

[Index(nameof(InternalJobName))]
public class JobData
{

    public string JobName { get; set; }

    public string JobType { get; set; }

    public string JobDescription { get; set; }

    public string? Locations { get; set; }


    [Required]
    [Key]
    public string InternalJobName { get; set; }

    public DateTime? LastRunTime { get; set; }

    public UInt64? LastRunLengthMs { get; set; }

    public string? LastRunStatus { get; set; }


    public DateTime? CurrentRunTime { get; set; }

    public UInt64? CurrentRunLengthMs { get; set; }

    public string? CurrentRunStatus { get; set; }

    [NotMapped]
    [JsonIgnore]
    public double? APIResponseTimeUtc { get; set; }

    [NotMapped]
    [JsonIgnore]
    public int ColoId { get; set; }

    public void Update(JobData data)
    {
        this.LastRunTime = data.LastRunTime;
        this.LastRunLengthMs = data.LastRunLengthMs;
        this.LastRunStatus = data.LastRunStatus;
        this.CurrentRunTime = data.CurrentRunTime;
        this.CurrentRunLengthMs = data.CurrentRunLengthMs;
        this.CurrentRunStatus = data.CurrentRunStatus;
        this.APIResponseTimeUtc =  data.APIResponseTimeUtc;
        this.ColoId =  data.ColoId;
    }

}

[Index(nameof(InternalJobName))]
public class JobDataLocation
{
    public string JobName { get; set; }

    [Required]
    [Key]
    public string InternalJobName { get; set; }

    public string LocationName { get; set; }

    public DateTime? LastRunTime { get; set; }

    public UInt64? LastRunLengthMs { get; set; }

    public string? LastRunStatus { get; set; }


    public DateTime? CurrentRunTime { get; set; }

    public UInt64? CurrentRunLengthMs { get; set; }

    public string? CurrentRunStatus { get; set; }

    [NotMapped]
    [JsonIgnore]
    public double? ResponseTimeUtc { get; set; }

    [NotMapped]
    [JsonIgnore]
    public int ColoId { get; set; }


    public void Update(JobDataLocation data)
    {
        this.LastRunTime = data.LastRunTime;
        this.LastRunLengthMs = data.LastRunLengthMs;
        this.LastRunStatus = data.LastRunStatus;
        this.CurrentRunTime = data.CurrentRunTime;
        this.CurrentRunLengthMs = data.CurrentRunLengthMs;
        this.CurrentRunStatus = data.CurrentRunStatus;
        this.ResponseTimeUtc = data.ResponseTimeUtc;
        this.ColoId = data.ColoId;
    }

}