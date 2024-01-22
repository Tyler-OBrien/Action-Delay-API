namespace Action_Delay_API_Core.Models.Jobs
{
    public class RunLocationResult
    {
        public RunLocationResult(bool done, string reason, DateTime? resultUtc, double? responseTimeMs)
        {
            Done = done;
            Reason = reason;
            ResultUtc = resultUtc;
            ResponseTimeMs = responseTimeMs;
        }

        public RunLocationResult(string exception, double? responseTimeMs)
        {
            Errored = true;
            Done = false;
            Reason = exception;
            ResponseTimeMs = responseTimeMs;
        }

        public bool Done { get; set; }

        public string Reason { get; set; }

        public bool Errored { get; set; }

        public DateTime? ResultUtc { get; set; }

        public double? ResponseTimeMs { get; set; }
    }
}
