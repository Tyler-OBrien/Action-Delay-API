namespace Action_Deplay_API_Worker.Models.API.Response
{
    public class SerializableDNSResponse
    {
        public SerializableDNSResponse()
        {
            ResponseUTC = DateTime.UtcNow;
        }

        public string QueryName { get; set; }
        public string QueryType { get; set; }
        public string ResponseCode { get; set; }
        public bool ProxyFailure { get; set; }
        public List<SerializableDnsAnswer> Answers { get; set; }

        public string? NSID { get; set; }
        public string? Info { get; set; }
        public DateTime? ResponseUTC { get; set; }
        public double? ResponseTimeMs { get; set; }

    }
    public class SerializableDnsAnswer
    {
        public string DomainName { get; set; }
        public int TTL { get; set; }
        public string RecordType { get; set; }
        public string RecordClass { get; set; }
        public string Value { get; set; }


    }
}
