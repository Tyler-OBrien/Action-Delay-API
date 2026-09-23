namespace Action_Delay_API_Core.Models.Database.Clickhouse
{
    public class ClickhouseJobLocationRun
    {
        public string JobName { get; set; }

        public string LocationName { get; set; }

        public DateTime RunTime { get; set; }
        public UInt64 RunLength { get; set; }
        public string RunStatus { get; set; }

        public UInt32 ResponseLatency { get; set; }
        public UInt32 BindingResponseLatency { get; set; }
        public int ColoId { get; set; }

        /// <summary>
        /// What this run concluded about this location, from <c>RunOutcome</c>. This is the column
        /// that separates a failure of the monitored system from a failure of our own probes.
        /// </summary>
        public string Outcome { get; set; } = string.Empty;

        /// <summary>Bounded sub-classification, from <c>FailureReason</c>. Empty on success.</summary>
        public string FailureReason { get; set; } = string.Empty;


    }
}
