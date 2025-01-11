using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.NATS.Event
{
    public class NATSJobUpdate
    {
        public string JobName { get; set; }

        public string? Status { get; set; }

        public ulong? RunLength { get; set; }

        public DateTime? RunTime { get; set; }
    }
}
