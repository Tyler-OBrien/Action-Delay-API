using System.Text.Json.Serialization;

namespace ASPNETCoreSimpleWebAPI.Models.API.Responses;

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