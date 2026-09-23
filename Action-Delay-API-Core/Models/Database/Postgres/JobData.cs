using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Models.Database.Postgres;

[Index(nameof(InternalJobName))]
public class JobData : BaseEntityClass
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
        this.JobType = data.JobType;
        this.JobDescription = data.JobDescription;
        this.ColoId =  data.ColoId;
    }

}

[Index(nameof(InternalJobName))]
public class JobDataLocation : BaseEntityClass
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

    /// <summary>
    /// What this run concluded, from <c>RunOutcome</c>. Sits beside <see cref="CurrentRunStatus"/>
    /// rather than replacing it: status only says "was it a success", and answers "Errored" for a
    /// dead edge worker, a timing-out origin and a location we cancelled while it was still
    /// propagating. This tells them apart.
    /// </summary>
    public string? Outcome { get; set; }

    /// <summary>Bounded sub-classification. Always a <c>FailureReason</c> value.</summary>
    public string? FailureReason { get; set; }

    [NotMapped]
    [JsonIgnore]
    public double? ResponseTimeUtc { get; set; }

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
        this.Outcome = data.Outcome;
        this.FailureReason = data.FailureReason;
        this.ResponseTimeUtc = data.ResponseTimeUtc;
        this.ColoId = data.ColoId;
    }

    public JobDataLocation Clone()
    {
        var newJobDataLocation = new JobDataLocation();
        newJobDataLocation.JobName = this.JobName;
        newJobDataLocation.InternalJobName = this.InternalJobName;
        newJobDataLocation.LocationName = this.LocationName;
        newJobDataLocation.LastRunTime = this.LastRunTime;
        newJobDataLocation.LastRunLengthMs = this.LastRunLengthMs;
        newJobDataLocation.LastRunStatus = this.LastRunStatus;
        newJobDataLocation.CurrentRunTime = this.CurrentRunTime;
        newJobDataLocation.CurrentRunLengthMs = this.CurrentRunLengthMs;
        newJobDataLocation.CurrentRunStatus = this.CurrentRunStatus;
        newJobDataLocation.Outcome = this.Outcome;
        newJobDataLocation.FailureReason = this.FailureReason;
        newJobDataLocation.ResponseTimeUtc = this.ResponseTimeUtc;
        newJobDataLocation.ColoId = this.ColoId;
        return newJobDataLocation;
    }

}