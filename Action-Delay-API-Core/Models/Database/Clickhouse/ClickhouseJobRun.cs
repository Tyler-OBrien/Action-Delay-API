namespace Action_Delay_API_Core.Models.Database.Clickhouse
{
    public class ClickhouseJobRun
    {
        public string JobName { get; set; }

        public DateTime RunTime { get; set; }
        public UInt64 RunLength { get; set; }
        public string RunStatus { get; set; }

        public UInt64 ResponseLatency { get; set; }
        public UInt64 BindingResponseLatency { get; set; }

        public int ColoId { get; set; }
    }
}
