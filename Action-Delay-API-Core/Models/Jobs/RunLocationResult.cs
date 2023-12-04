namespace Action_Delay_API_Core.Models.Jobs
{
    public class RunLocationResult
    {
        public RunLocationResult(bool done, string reason, DateTime? resultUtc)
        {
            Done = done;
            Reason = reason;
            ResultUtc = resultUtc;
        }

        public RunLocationResult(string exception)
        {
            Errored = true;
            Done = false;
            Reason = exception;
        }

        public bool Done { get; set; }

        public string Reason { get; set; }

        public bool Errored { get; set; }

        public DateTime? ResultUtc { get; set; }
    }
}
