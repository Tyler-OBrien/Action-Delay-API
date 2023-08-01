
using System;

public class JobData
{
    [Required]
    [Key]
    public string JobName { get; set; }

    public float LastRunTime { get; set; }

    public bool LastRunStatus { get; set; }

}

public class JobDataLocation
{

    public string JobName { get; set; }

    public string LocationName { get; set; }


    public float LastRunTime { get; set; }

    public bool LastRunStatus { get; set; }

}