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
            /// <summary>
            /// Statuses meaning an order is still in flight. These packs have no certificate yet, so they
            /// look identical to a broken pack from the outside - but they are certificates we are waiting
            /// on, and deleting one throws away an order that was about to succeed.
            /// </summary>
            private static readonly HashSet<string> PendingStatuses = new(StringComparer.OrdinalIgnoreCase)
            {
                "initializing", "pending_validation", "pending_issuance", "pending_deployment", "holding_deployment"
            };

            /// <summary>
            /// Statuses an order can never recover from. Listed explicitly rather than inferred, because
            /// "validation_timed_out" does not appear in Cloudflare's published status reference at all -
            /// the next undocumented status must fall through to "leave it alone", not "delete it".
            /// </summary>
            private static readonly HashSet<string> DeadStatuses = new(StringComparer.OrdinalIgnoreCase)
            {
                "validation_timed_out"
            };

            /// <summary>A live rung of the ladder: serving traffic and holding a certificate we can date.</summary>
            [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
            public bool IsActive =>
                "active".Equals(Status, StringComparison.OrdinalIgnoreCase) && GetPrimaryCertificate != null;

            /// <summary>An order still working its way to Active. Never delete these.</summary>
            [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
            public bool IsPending => Status != null && PendingStatuses.Contains(Status);

            /// <summary>
            /// An order that will never produce a certificate. Safe to clean up, but only behind an
            /// ownership check - see CertificateDelayJob.IsOurCertificatePack.
            /// </summary>
            [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
            public bool IsDead => Status != null && DeadStatuses.Contains(Status);

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
            public DateTime CreatedOn { get; set; }

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
            public DateTime UploadedOn { get; set; }

            [JsonPropertyName("modified_on")]
            public DateTime ModifiedOn { get; set; }

            [JsonPropertyName("expires_on")]
            public DateTime ExpiresOn { get; set; }
        }
    }
}
