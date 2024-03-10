using System.Net;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses;

public class ErrorResponseDetails<T> : ErrorResponse
{
    private ErrorResponseDetails() : base(0, null, null)
    {
    }

    public ErrorResponseDetails(HttpStatusCode code, string message, string type, T details) : base(code, message, type)
    {
        Error = new ErrorDetails<T>((int)code, message, type, details);
    }

    public ErrorResponseDetails(int code, string message, string type, T details) : base(code, message, type)
    {
        Error = new ErrorDetails<T>(code, message, type, details);
    }

    [JsonPropertyName("error")] public ErrorDetails<T>? Error { get; set; }
}

public class ErrorDetails<T>
{
    private ErrorDetails()
    {
    }


    internal ErrorDetails(int code, string message, string type, T details)
    {
        Code = code;
        Message = message;
        Details = details;
        Type = type;
    }

    [JsonPropertyName("code")]
    // HTTP Status Code
    public int Code { get; set; }

    [JsonPropertyName("Message")] public string Message { get; set; }

    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Type { get; set; }

    public T Details { get; set; }
}