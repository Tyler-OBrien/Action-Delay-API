using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.NATS.Requests
{
    public class NATSDNSRequest
    {
        public string Domain { get; set; }

        public string Type { get; set; }

        public string Resolver { get; set; }
    }
}
