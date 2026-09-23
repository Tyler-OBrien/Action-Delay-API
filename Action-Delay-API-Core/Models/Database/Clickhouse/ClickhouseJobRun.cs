namespace Action_Delay_API_Core.Models.Database.Clickhouse
{
    public class ClickhouseJobRun
    {
        public string JobName { get; set; }

        public DateTime RunTime { get; set; }
        public UInt64 RunLength { get; set; }
        public string RunStatus { get; set; }

        public UInt32 ResponseLatency { get; set; }
        public UInt32 BindingResponseLatency { get; set; }

        public int ColoId { get; set; }

        /// <summary>
        /// What this run concluded, from <c>RunOutcome</c>. Rides alongside <see cref="RunStatus"/>
        /// rather than replacing it, because the status values are read verbatim by the dashboards,
        /// the website and the success-only materialized views.
        /// </summary>
        public string Outcome { get; set; } = string.Empty;

    }
}
