namespace Action_Delay_API_Core.Models.NATS.Requests
{
    public class NATSDNSRequest
    {
        public string QueryName { get; set; }
        public string QueryType { get; set; }
        public string DnsServer { get; set; }

        public int? TimeoutMs { get; set; }

        public NetType? NetType { get; set; }
    }
}
