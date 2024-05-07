using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.SSL
{
    public class GetCertificatePacksResponse
    {
        public partial class CertificatePack
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("type")]
            public string Type { get; set; }

            [JsonPropertyName("hosts")]
            public string[] Hosts { get; set; }

            [JsonPropertyName("primary_certificate")]
            public string PrimaryCertificate { get; set; }

            [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
            public Certificate? GetPrimaryCertificate =>
                Certificates == null || String.IsNullOrWhiteSpace(PrimaryCertificate)
                    ? null
                    : Certificates.FirstOrDefault(cert => cert.Id.Equals(PrimaryCertificate, StringComparison.Ordinal));

            [JsonPropertyName("status")]
            public string Status { get; set; }

            [JsonPropertyName("certificates")]
            public Certificate[]? Certificates { get; set; }

            [JsonPropertyName("created_on")]
            public DateTimeOffset CreatedOn { get; set; }

            [JsonPropertyName("validity_days")]
            public long ValidityDays { get; set; }

            [JsonPropertyName("validation_method")]
            public string ValidationMethod { get; set; }

            [JsonPropertyName("certificate_authority")]
            public string CertificateAuthority { get; set; }
        }

        public partial class Certificate
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("hosts")]
            public string[] Hosts { get; set; }

            [JsonPropertyName("issuer")]
            public string Issuer { get; set; }

            [JsonPropertyName("signature")]
            public string Signature { get; set; }

            [JsonPropertyName("status")]
            public string Status { get; set; }

            [JsonPropertyName("bundle_method")]
            public string BundleMethod { get; set; }

            [JsonPropertyName("zone_id")]
            public string ZoneId { get; set; }

            [JsonPropertyName("uploaded_on")]
            public DateTimeOffset UploadedOn { get; set; }

            [JsonPropertyName("modified_on")]
            public DateTimeOffset ModifiedOn { get; set; }

            [JsonPropertyName("expires_on")]
            public DateTimeOffset ExpiresOn { get; set; }
        }
    }
}
