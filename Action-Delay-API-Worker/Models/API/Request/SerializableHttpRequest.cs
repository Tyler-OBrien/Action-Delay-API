using System.Text.Json.Serialization;

namespace Action_Delay_API_Worker.Models.API.Request
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
        public int? RetriesCount { get; set; }

        public NetType? NetType { get; set; }

        public int? HttpType { get; set; }

        public bool? EnableConnectionReuse { get; set; }

        public MethodType? Method { get; set; }

        public string? Base64Body { get; set; }

        public byte[]? Body { get; set; }

        public int? RandomBytesBody { get; set; }

        public int? RandomSeed { get; set; }

        public string? ContentType { get; set; }

        public bool? ReturnBody { get; set; }

        public bool? ReturnBodySha256 { get; set; }
        public bool? ReturnBodyOnError { get; set; }



        public string? DNSResolveOverride { get; set; }
        public string? CustomDNSServerOverride { get; set; }

        public bool? NoResponseHeaders { get; set; }

        public List<string>? ResponseHeaders { get; set; }


        public bool? AlwaysAllResponseHeadersOnNonSuccessStatusCode { get; set; }

        public bool? DisableAutomaticResponseDecompression { get; set; }

    }

}
