using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Local;

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
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? TimeoutMs { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? RetriesCount { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public NetType? NetType { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? HttpType { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]

        public bool? EnableConnectionReuse { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public MethodType? Method { get; set; }

        /// <summary>
        /// This only works with NATS, use BodyStream or BodyBytes for HTTP Proxy
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Base64Body { get; set; }

        /// <summary>
        /// Http proxy only
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Stream? BodyStream { get; set; }

        /// <summary>
        /// http proxy only
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public byte[]? BodyBytes { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ContentType { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? ReturnBody { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? ReturnBodySha256 { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? ReturnBodyOnError { get; set; }



        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? DNSResolveOverride { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? CustomDNSServerOverride { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? RandomBytesBody { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? RandomSeed { get; set; }



        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? NoResponseHeaders { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<string>? ResponseHeaders { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? AlwaysAllResponseHeadersOnNonSuccessStatusCode { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? DisableAutomaticResponseDecompression { get; set; }

        public void SetDefaultsFromLocation(Location location)
        {
            NetType = location.NetType ?? NATS.NetType.Either;
            if (String.IsNullOrWhiteSpace(location.DNSResolveOverride) == false)
                DNSResolveOverride = location.DNSResolveOverride;
        }

        public static HashSet<string> FORCED_HEADERS = new HashSet<string>() { "Colo" };

        public static List<string> STATIC_EMPTY_HEADERS = new List<string>() { "Colo" };

        public void HandleNoResponseHeadersOverride()
        {
            // it's silly but we want some sane defaults always
            if (NoResponseHeaders != null && NoResponseHeaders.Value && ResponseHeaders == null)
            {
                ResponseHeaders = new List<string>();
            }

            if (ResponseHeaders != null)
            {
                // silly optimization
                if (ResponseHeaders.Count == 0)
                {
                    ResponseHeaders = STATIC_EMPTY_HEADERS;
                }
                else
                {
                    foreach (var headerToAdd in FORCED_HEADERS.Except(ResponseHeaders))
                    {
                        ResponseHeaders.Add(headerToAdd);
                    }
                }
            }
        }

   


    }
}
