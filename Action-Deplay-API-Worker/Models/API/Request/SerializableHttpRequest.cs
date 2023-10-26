using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;

namespace Action_Deplay_API_Worker.Models.API.Request
{
    public class SerializableHttpRequest
    {
        public string URL { get; set; }

        public Dictionary<string, string> Headers
        {
            get;
            set;
        }
        public int? TimeoutMs { get; set; }

        public NetType? NetType { get; set; }
    }


}
