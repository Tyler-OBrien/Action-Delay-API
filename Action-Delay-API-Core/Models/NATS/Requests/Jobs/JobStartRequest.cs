using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.NATS.Requests.Jobs
{
    public class JobStartRequest
    {

        public string JobName { get; set; }

        public JobType JobType { get; set; }

        public DateTime StartUtc { get; set; }

        public Dictionary<double, double> FallBackSchedule { get; set; }

        public List<Validator> Validators { get; set; }

        public NATSHttpRequest? HttpRequest { get; set; }
        public NATSDNSRequest? DnsRequest { get; set; }

    }

    public class Validator
    {
        public ValidatorType ValidatorType { get; set; }

        public string? PropertyName { get; set; }

        public string Value { get; set; }

        public bool? ErrorIfTrue { get; set; }

        [JsonIgnore]
        public bool Result { get; set; }
    }

    public enum ValidatorType
    {
        Content,
        Header,
        ResponseCode
    }

    public enum JobType
    {
        HTTP, DNS
    }
}
