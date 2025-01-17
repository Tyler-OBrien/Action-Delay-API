using System.Text.Json.Serialization;

namespace ASPNETCoreSimpleWebAPI.Models.API.Responses;

/// <summary>
///     Abstraction for Rest API Responses, usually containing Error or Data Fields, see ErrorResponse or DataResponse for
///     implementations
/// </summary>
public interface IResponse
{
}

public class Response<T> : IResponse
{
    public Response()
    {
    }

    public Response(T data)
    {
        Data = data;
    }

    [JsonPropertyName("data")] public T? Data { get; set; }

    [JsonPropertyName("error")] public GenericError? Error { get; set; }
}