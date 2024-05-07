using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.CustomHostnames
{
    public class CloudflareAPICreateCustomHostnameRequest
    {
        public class CreateCustomHostname
        {
            public CreateCustomHostname(string hostName)
            {
                Ssl = null;
                Hostname = hostName;
            }

            [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
            [JsonPropertyName("ssl")]
            public Ssl Ssl { get; set; }

            [JsonPropertyName("hostname")] public string Hostname { get; set; }
        }


        public class Ssl
        {
            public Ssl()
            {
                Method = "http";
                Type = "dv";
                Wildcard = false;
                CertificateAuthority = "lets_encrypt";
            }

            [JsonPropertyName("method")] public string Method { get; set; }

            [JsonPropertyName("type")] public string Type { get; set; }

            [JsonPropertyName("wildcard")] public bool Wildcard { get; set; }

            [JsonPropertyName("certificate_authority")]
            public string CertificateAuthority { get; set; }

        }
    }
}
