using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.NATS.Responses
{
    public class SerializableHttpResponse
    {
        public bool WasSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public Dictionary<string, string> Headers { get; set; }
        public string Body { get; set; }
    }
}
