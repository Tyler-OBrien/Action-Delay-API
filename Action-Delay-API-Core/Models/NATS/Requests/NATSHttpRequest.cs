namespace Action_Delay_API_Core.Models.NATS.Requests
{
    public class NATSHttpRequest
    {
        public string URL { get; set; }

        public Dictionary<string, string> Headers
        {
            get;
            set;
        }

        public int? TimeoutMs { get; set; }

        public NetType? NetType { get; set; }

        public int? HttpType { get; set; }

        public bool? EnableConnectionReuse { get; set; }

    }
}
