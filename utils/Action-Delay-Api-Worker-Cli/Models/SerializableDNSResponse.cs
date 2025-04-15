using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_Api_Worker_Cli.Models
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
