using Action_Deplay_API_Worker.Models.API.Request;
using System.Text.Json.Serialization;
using Action_Delay_API_Worker.Models.API.Request.Jobs;
using Action_Delay_API_Worker.Models.API.Response.Jobs;
using Action_Deplay_API_Worker.Models.API.Response;

namespace Action_Delay_API_Worker.Models.API
{
    [JsonSerializable(typeof(SerializableHttpRequest))]
    [JsonSerializable(typeof(SerializableDNSRequest))]
    [JsonSerializable(typeof(SerializableHttpResponse))]
    [JsonSerializable(typeof(SerializableDNSResponse))]
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
