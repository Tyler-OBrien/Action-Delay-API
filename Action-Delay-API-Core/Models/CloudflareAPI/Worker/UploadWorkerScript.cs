using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI
{
    public class UploadWorkerScript
    {
        [JsonPropertyName("created_on")]
        public DateTimeOffset CreatedOn { get; set; }

        [JsonPropertyName("modified_on")]
        public DateTimeOffset ModifiedOn { get; set; }

        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("tag")]
        public string Tag { get; set; }

        [JsonPropertyName("tags")]
        public object Tags { get; set; }

        [JsonPropertyName("deployment_id")]
        public string DeploymentId { get; set; }

        [JsonPropertyName("tail_consumers")]
        public object TailConsumers { get; set; }

        [JsonPropertyName("logpush")]
        public bool Logpush { get; set; }

        [JsonPropertyName("etag")]
        public string Etag { get; set; }

        [JsonPropertyName("handlers")]
        public List<string> Handlers { get; set; }

        [JsonPropertyName("last_deployed_from")]
        public string LastDeployedFrom { get; set; }

        [JsonPropertyName("compatibility_date")]
        public DateTimeOffset CompatibilityDate { get; set; }

        [JsonPropertyName("usage_model")]
        public string UsageModel { get; set; }

        [JsonPropertyName("available_on_subdomain")]
        public bool AvailableOnSubdomain { get; set; }
    }
}
