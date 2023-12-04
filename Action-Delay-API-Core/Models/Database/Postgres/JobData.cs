using System.ComponentModel.DataAnnotations;

namespace Action_Delay_API_Core.Models.Database.Postgres;

public class JobData
{
    [Required]
    [Key]
    public string JobName { get; set; }

    public DateTime? LastRunTime { get; set; }

    public UInt64? LastRunLengthMs { get; set; }

    public string? LastRunStatus { get; set; }


    public DateTime? CurrentRunTime { get; set; }

    public UInt64? CurrentRunLengthMs { get; set; }

    public string? CurrentRunStatus { get; set; }

    public void Update(JobData data)
    {
        this.LastRunTime = data.LastRunTime;
        this.LastRunLengthMs = data.LastRunLengthMs;
        this.LastRunStatus = data.LastRunStatus;
        this.CurrentRunTime = data.CurrentRunTime;
        this.CurrentRunLengthMs = data.CurrentRunLengthMs;
        this.CurrentRunStatus = data.CurrentRunStatus;
    }

}

public class JobDataLocation
{
    public string JobName { get; set; }

    public string LocationName { get; set; }

    public DateTime? LastRunTime { get; set; }

    public UInt64? LastRunLengthMs { get; set; }

    public string? LastRunStatus { get; set; }


    public DateTime? CurrentRunTime { get; set; }

    public UInt64? CurrentRunLengthMs { get; set; }

    public string? CurrentRunStatus { get; set; }

    public void Update(JobDataLocation data)
    {
        this.LastRunTime = data.LastRunTime;
        this.LastRunLengthMs = data.LastRunLengthMs;
        this.LastRunStatus = data.LastRunStatus;
        this.CurrentRunTime = data.CurrentRunTime;
        this.CurrentRunLengthMs = data.CurrentRunLengthMs;
        this.CurrentRunStatus = data.CurrentRunStatus;
    }

}