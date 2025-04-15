using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_Api_Worker_Cli.Models
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
