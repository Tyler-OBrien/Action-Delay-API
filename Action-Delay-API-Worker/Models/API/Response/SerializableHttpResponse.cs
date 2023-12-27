using System.Net;

namespace Action_Deplay_API_Worker.Models.API.Response
{
    public class SerializableHttpResponse
    {
        public SerializableHttpResponse()
        {
            ResponseUTC = DateTime.UtcNow;
        }

        public bool WasSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public Dictionary<string, string> Headers { get; set; }
        public string Body { get; set; }
        public string? Info { get; set; }
        public DateTime? ResponseUTC { get; set; }
        public double? ResponseTimeMs { get; set; }

    }
}
