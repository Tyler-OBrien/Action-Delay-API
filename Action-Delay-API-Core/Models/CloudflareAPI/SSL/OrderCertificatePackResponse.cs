using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.SSL
{
    public class OrderCertificatePackResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("hosts")]
        public string[] Hosts { get; set; }

        [JsonPropertyName("validation_method")]
        public string ValidationMethod { get; set; }

        [JsonPropertyName("validity_days")]
        public long ValidityDays { get; set; }

        [JsonPropertyName("certificate_authority")]
        public string CertificateAuthority { get; set; }
    }
}
