namespace Action_Delay_API_Core.Models.NATS.Responses
{
    public class SerializableDNSResponse
    {
        public string QueryName { get; set; }
        public string QueryType { get; set; }
        public string ResponseCode { get; set; }
        public bool ProxyFailure { get; set; }
        public List<SerializableDnsAnswer> Answers { get; set; }

        public string? NSID { get; set; }
        public string? Info { get; set; }
        public DateTime? ResponseUTC { get; set; }
        public double? ResponseTimeMs { get; set; }

        /// <summary>
        /// Why the probe failed, from <see cref="ProbeFailureKind"/>. Null on success, and null from
        /// workers predating this field. A returned rcode lands in <see cref="ResponseCode"/>
        /// instead: that is an answer from the resolver, not a failure to reach it.
        /// </summary>
        public string? FailureKind { get; set; }

        /// <summary>
        /// True when the probe produced no usable observation. See the HTTP equivalent - timeouts no
        /// longer set <see cref="ProxyFailure"/>, so both have to be checked.
        /// </summary>
        public bool IsProbeAbort() => ProxyFailure || FailureKind == ProbeFailureKind.Timeout;

        public int? TryGetColoId()
        {
            if (String.IsNullOrEmpty(NSID)) return -1;
            var trimmedInput = NSID.Trim().Trim('"');
            if (trimmedInput.Contains("m") == false) return -1;
            var trySplit = trimmedInput.Split("m");
            if (trySplit.Any() && String.IsNullOrEmpty(trySplit.First()) == false &&
                int.TryParse(trySplit.First().Trim(), out var parsedColoId) && parsedColoId > 0)
                return parsedColoId;
            return -1;
        }


    }
    public class SerializableDnsAnswer
    {
        public string DomainName { get; set; }
        public int TTL { get; set; }
        public string RecordType { get; set; }
        public string RecordClass { get; set; }
        public string Value { get; set; }
        public string? Info { get; set; }
    }
}
