namespace Action_Delay_API_Core.Models.NATS.Responses.Jobs
{
    public class JobStatusRequestResponse
    {
        public DateTime LastCheckUtc { get; set; }

        public bool Complete { get; set; }

        public bool Failed { get; set; }

        public string? Info { get; set; }

        public double? AverageResponseLatency { get; set; }
    }
}
