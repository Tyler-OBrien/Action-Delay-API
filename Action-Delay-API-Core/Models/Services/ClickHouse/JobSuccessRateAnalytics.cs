namespace Action_Delay_API_Core.Models.Services.ClickHouse;

public class JobSuccessRateAnalytics
{
    public List<JobSuccessRateAnalyticsPoint> Points { get; set; } = new();
    public int GroupByMinutesInterval { get; set; }

    /// <summary>Total successful runs across the whole requested window.</summary>
    public ulong SuccessCount { get; set; }

    /// <summary>Total runs (any status) across the whole requested window.</summary>
    public ulong TotalCount { get; set; }
}

public class JobSuccessRateAnalyticsPoint
{
    public DateTime TimePeriod { get; set; }
    public ulong SuccessCount { get; set; }
    public ulong TotalCount { get; set; }
}
