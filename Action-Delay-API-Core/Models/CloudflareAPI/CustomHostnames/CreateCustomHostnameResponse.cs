using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI.CustomHostnames
{
    public class CloudflareAPICreateCustomHostnameResponse
    {
        public partial class CreateCustomHostnameResponse
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("hostname")]
            public string Hostname { get; set; }

            [JsonPropertyName("ssl")]
            public Ssl Ssl { get; set; }

            [JsonPropertyName("status")]
            public string Status { get; set; }

            [JsonPropertyName("ownership_verification")]
            public OwnershipVerification OwnershipVerification { get; set; }

            [JsonPropertyName("ownership_verification_http")]
            public OwnershipVerificationHttp OwnershipVerificationHttp { get; set; }

            [JsonPropertyName("created_at")]
            public DateTimeOffset CreatedAt { get; set; }
        }

        public partial class OwnershipVerification
        {
            [JsonPropertyName("type")]
            public string Type { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("value")]
            public string Value { get; set; }
        }

        public partial class OwnershipVerificationHttp
        {
            [JsonPropertyName("http_url")]
            public Uri HttpUrl { get; set; }

            [JsonPropertyName("http_body")]
            public string HttpBody { get; set; }
        }

        public partial class Ssl
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("type")]
            public string Type { get; set; }

            [JsonPropertyName("method")]
            public string Method { get; set; }

            [JsonPropertyName("status")]
            public string Status { get; set; }

            [JsonPropertyName("settings")]
            public Settings Settings { get; set; }

            [JsonPropertyName("wildcard")]
            public bool Wildcard { get; set; }

            [JsonPropertyName("certificate_authority")]
            public string CertificateAuthority { get; set; }
        }

        public partial class Settings
        {
            [JsonPropertyName("http2")]
            public string Http2 { get; set; }

            [JsonPropertyName("tls_1_3")]
            public string Tls1_3 { get; set; }

            [JsonPropertyName("min_tls_version")]
            public string MinTlsVersion { get; set; }

            [JsonPropertyName("early_hints")]
            public string EarlyHints { get; set; }
        }
    }
}