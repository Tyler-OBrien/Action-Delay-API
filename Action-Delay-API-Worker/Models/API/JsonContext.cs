using Action_Deplay_API_Worker.Models.API.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Action_Deplay_API_Worker.Models.API.Response;

namespace Action_Delay_API_Worker.Models.API
{
    [JsonSerializable(typeof(SerializableHttpRequest))]
    [JsonSerializable(typeof(SerializableDNSRequest))]
    [JsonSerializable(typeof(SerializableHttpResponse))]
    [JsonSerializable(typeof(SerializableDNSResponse))]
    [JsonSerializable(typeof(byte[]))]
    [JsonSerializable(typeof(string))]
    internal partial class SerializableRequestJsonContext : JsonSerializerContext
    {
    }
}
