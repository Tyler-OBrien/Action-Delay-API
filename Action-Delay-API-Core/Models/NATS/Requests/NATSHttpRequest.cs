using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
