using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

}