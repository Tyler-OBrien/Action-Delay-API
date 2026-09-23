using System.Text.Json.Serialization;

namespace Action_Delay_API_Worker.Models.API.Response
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
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? NSID { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Info { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DateTime? ResponseUTC { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public double? ResponseTimeMs { get; set; }

        /// <summary>
        /// Why the probe failed, from <see cref="ProbeFailureKind"/>. Null on success, and null from
        /// workers predating this field - Core treats absent as "fall back to ProxyFailure".
        /// A returned rcode is carried by <see cref="ResponseCode"/> instead: that is an answer from
        /// the resolver, not a failure to reach it.
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? FailureKind { get; set; }

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
