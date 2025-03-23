namespace Action_Delay_API_Core.Models.Database.Clickhouse
{
    public class ClickhouseJobRunPerf
    {
        public string JobName { get; set; }

        public DateTime RunTime { get; set; }
        public UInt64 RunLength { get; set; }
        public string RunStatus { get; set; }

        public UInt32 ResponseLatency { get; set; }
        public UInt32 BindingResponseLatency { get; set; }

        public string LocationId { get; set; }
    }
}
