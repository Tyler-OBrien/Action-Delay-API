using System.Net;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses;

public class DataResponse<T> : IResponse
{
    public DataResponse()
    {
    }

    public DataResponse(T data)
    {
        Data = data;
    }

    [JsonPropertyName("data")] public T? Data { get; set; }
}