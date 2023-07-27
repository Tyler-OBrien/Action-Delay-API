using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.NATS.Requests
{
    public class NATSDNSRequest
    {
        public string QueryName { get; set; }
        public string QueryType { get; set; }
        public string DnsServer { get; set; }
    }
}
