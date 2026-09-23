using System.Text.Json;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.GoogleCloudAPI.Compute
{
    /// <summary>
    /// A urlMaps.get response. The fingerprint is the concurrency token urlMaps.patch requires, so every
    /// patch has to be preceded by a read. Path matchers come back opaque: the job replaces only its own
    /// and hands the rest straight back, which a partial DTO would silently strip fields from.
    /// </summary>
    public class UrlMapResponse : GoogleCloudAPIResponse
    {
        [JsonPropertyName("fingerprint")] public string? Fingerprint { get; set; }
        [JsonPropertyName("pathMatchers")] public List<JsonElement>? PathMatchers { get; set; }
    }

    /// <summary>
    /// Only the fields the job owns. Compute PATCH leaves absent fields alone, so hostRules and the rest
    /// of the URL map survive untouched - but it *replaces* arrays it is given, hence the merge.
    /// </summary>
    public class PatchUrlMapRequest
    {
        [JsonPropertyName("fingerprint")] public string? Fingerprint { get; set; }
        [JsonPropertyName("pathMatchers")] public List<JsonElement> PathMatchers { get; set; }
    }

    public class UrlMapPathMatcher
    {
        [JsonPropertyName("name")] public string Name { get; set; }
        [JsonPropertyName("defaultService")] public string DefaultService { get; set; }
        [JsonPropertyName("pathRules")] public List<UrlMapPathRule> PathRules { get; set; }
    }

    public class UrlMapPathRule
    {
        [JsonPropertyName("paths")] public List<string> Paths { get; set; }
        [JsonPropertyName("urlRedirect")] public UrlMapUrlRedirect UrlRedirect { get; set; }
    }

    public class UrlMapUrlRedirect
    {
        [JsonPropertyName("hostRedirect")] public string HostRedirect { get; set; }
        [JsonPropertyName("pathRedirect")] public string PathRedirect { get; set; }
        [JsonPropertyName("redirectResponseCode")] public string RedirectResponseCode { get; set; }
        [JsonPropertyName("stripQuery")] public bool StripQuery { get; set; }
    }
}
