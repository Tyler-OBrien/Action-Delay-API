namespace Action_Delay_API_Worker.Models.API.Request
{
    public class SerializablePingRequest
    {

        public string Hostname { get; set; }
        public int? TimeoutMs { get; set; }
        public int? PingCount { get; set; }

        public NetType? NetType { get; set; }
        public string? CustomDNSServerOverride { get; set; }
    }
}
