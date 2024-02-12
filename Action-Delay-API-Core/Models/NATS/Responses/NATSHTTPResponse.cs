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
        public double? ResponseTimeMs { get; set; }

        public int GetColoId()
        {
            if (Headers != null && Headers.TryGetValue("colo", out var coloStr) &&
                int.TryParse(coloStr, out var coloInt))
                return coloInt;
            return -1;
        }
    }
}
