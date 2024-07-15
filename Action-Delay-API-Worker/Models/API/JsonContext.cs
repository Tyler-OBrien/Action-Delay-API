using System.Text.Json.Serialization;
using Action_Delay_API_Worker.Models.API.Request;
using Action_Delay_API_Worker.Models.API.Request.Jobs;
using Action_Delay_API_Worker.Models.API.Response;
using Action_Delay_API_Worker.Models.API.Response.Jobs;

namespace Action_Delay_API_Worker.Models.API
{
    [JsonSerializable(typeof(SerializableHttpRequest))]
    [JsonSerializable(typeof(SerializableDNSRequest))]
    [JsonSerializable(typeof(SerializablePingRequest))]
    [JsonSerializable(typeof(SerializableHttpResponse))]
    [JsonSerializable(typeof(SerializableDNSResponse))]
    [JsonSerializable(typeof(SerializablePingResponse))]

    [JsonSerializable(typeof(byte[]))]
    [JsonSerializable(typeof(string))]

    [JsonSerializable(typeof(JobStartRequest))]
    [JsonSerializable(typeof(JobStatusRequest))]
    [JsonSerializable(typeof(JobEndRequest))]

    [JsonSerializable(typeof(JobStartRequestResponse))]
    [JsonSerializable(typeof(JobStatusRequestResponse))]
    [JsonSerializable(typeof(JobEndRequestResponse))]
    [JsonSourceGenerationOptions(PropertyNameCaseInsensitive = true, AllowTrailingCommas = true)]
    internal partial class SerializableRequestJsonContext : JsonSerializerContext
    {
    }
}
