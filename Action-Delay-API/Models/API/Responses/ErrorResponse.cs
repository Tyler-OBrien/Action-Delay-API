using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Text.Json.Serialization;
using FluentResults;

namespace Action_Delay_API.Models.API.Responses;


public class ErrorResponse : IError, IResponse
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
    [NotMapped]
    [JsonIgnore]
    public List<IError> Reasons { get; }
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

    [JsonPropertyName("Message")] public string Message { get; set; }


    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string Type { get; set; }
}