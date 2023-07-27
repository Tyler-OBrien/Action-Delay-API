using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Action_Delay_API_Core.Models.CloudflareAPI.DNS
{
    public class UpdateRecordRequest
    {
        public string Content { get; set; }
        public string Name { get; set; }
        public bool Proxied { get; set; }
        public long Ttl { get; set; }
        public string Type { get; set; }
        public string Comment { get; set; }
        public string[] Tags { get; set; }
    }
}
