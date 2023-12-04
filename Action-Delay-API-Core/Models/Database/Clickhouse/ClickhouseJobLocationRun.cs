namespace Action_Delay_API_Core.Models.Database.Clickhouse
{
    public class ClickhouseJobLocationRun
    {
        public string JobName { get; set; }

        public string LocationName { get; set; }

        public DateTime RunTime { get; set; }
        public UInt64 RunLength { get; set; }
        public string RunStatus { get; set; }
    }
}
