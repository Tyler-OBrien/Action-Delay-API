namespace Action_Delay_API_Core.Models.Services.ClickHouse;

public class ColoLocationAnalytics
{
    public List<ColoLocationAnalyticsPoint> Points { get; set; } = new();
    public int GroupByMinutesInterval { get; set; }
}

public class ColoLocationAnalyticsPoint
{
    public DateTime TimePeriod { get; set; }
    public int ColoId { get; set; }
    public ulong RunCount { get; set; }
    public ulong MedianLatency { get; set; }
    public ulong AvgLatency { get; set; }
}
