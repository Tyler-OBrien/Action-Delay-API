using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Action_Deplay_API_Worker.Models.API.Response
{
    public class SerializableHttpResponse
    {
        public bool WasSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string Headers { get; set; }
        public string Body { get; set; }
    }
}
