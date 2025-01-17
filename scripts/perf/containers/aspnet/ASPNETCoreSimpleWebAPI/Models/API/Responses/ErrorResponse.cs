using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Text.Json.Serialization;

namespace ASPNETCoreSimpleWebAPI.Models.API.Responses;


public class ErrorResponse :  IResponse
{
    private ErrorResponse()
    {
    }

    public ErrorResponse(HttpStatusCode code, string message, string type)
    {
        Error = new GenericError(code, message, type);
    }

    public ErrorResponse(int code, string message, string type)
    {
        Error = new GenericError(code, message, type);
    }

    [JsonPropertyName("error")] public GenericError? Error { get; set; }

    [NotMapped]
    [JsonIgnore]
    public string Message { get; }
    [NotMapped]
    [JsonIgnore]
    public Dictionary<string, object> Metadata { get; }
}

public class GenericError
{
    private GenericError()
    {
    }

    internal GenericError(HttpStatusCode code, string message, string type)
    {
        Code = (int)code;
        Message = message;
        Type = type;
    }

    internal GenericError(int code, string message, string type)
    {
        Code = code;
        Message = message;
        Type = type;
    }

    [JsonPropertyName("code")]
    // HTTP Status Code
    public int Code { get; set; }

    [JsonPropertyName("message")] public string Message { get; set; }


    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string Type { get; set; }
}