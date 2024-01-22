using System.Net;

namespace Action_Delay_API_Core.Models.NATS.Responses
{
    public class SerializableHttpResponse
    {
        public bool WasSuccess { get; set; }
        public bool ProxyFailure { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public Dictionary<string, string> Headers { get; set; }
        public string Body { get; set; }
        public string? Info { get; set; }
        public DateTime? ResponseUTC { get; set; }

    }
}
