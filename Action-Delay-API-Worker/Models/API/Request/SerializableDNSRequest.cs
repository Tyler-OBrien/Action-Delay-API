using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Deplay_API_Worker.Models.API.Request
{
    public class SerializableDNSRequest
    {
        public string QueryName { get; set; }
        public string QueryType { get; set; }
        public string DnsServer { get; set; }

        public int? TimeoutMs { get; set; }

        public NetType? NetType { get; set; }
    }


}
