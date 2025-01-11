using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Event;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;

namespace Action_Delay_API_Core.Models.NATS
{
    [JsonSerializable(typeof(NATSJobUpdate))]
    [JsonSerializable(typeof(NATSJobLocationUpdate))]
    [JsonSerializable(typeof(NATSHttpRequest))]
    [JsonSerializable(typeof(NATSDNSRequest))]
    [JsonSerializable(typeof(NATSPingRequest))]
    [JsonSerializable(typeof(SerializableHttpResponse))]
    [JsonSerializable(typeof(SerializableDNSResponse))]
    [JsonSerializable(typeof(SerializablePingResponse))]
    [JsonSerializable(typeof(string))]
    [JsonSourceGenerationOptions(PropertyNameCaseInsensitive = true, AllowTrailingCommas = true, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault)]

    public partial class SerializableRequestJsonContext : JsonSerializerContext
    {
    }
}
