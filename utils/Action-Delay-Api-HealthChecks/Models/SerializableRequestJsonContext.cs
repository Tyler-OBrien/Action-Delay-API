using System.Text.Json.Serialization;

namespace Action_Delay_Api_HealthChecks.Models
{
    [JsonSerializable(typeof(NATSHttpRequest))]
    [JsonSerializable(typeof(NATSDNSRequest))]
    [JsonSerializable(typeof(NATSPingRequest))]
    [JsonSerializable(typeof(SerializableHttpResponse))]
    [JsonSerializable(typeof(SerializableHttpResponse))]
    [JsonSerializable(typeof(SerializableDNSResponse))]
    [JsonSerializable(typeof(SerializablePingResponse))]
    [JsonSerializable(typeof(LocalConfig))]
    [JsonSourceGenerationOptions(PropertyNameCaseInsensitive = true, AllowTrailingCommas = true, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault)]

    public partial class SerializableRequestJsonContext : JsonSerializerContext
    {
    }
}
