using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Text.Json.Serialization;
using Action_Delay_API.Models.API.Responses.DTOs;
using FluentResults;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Responses;

public class ErrorResponseExample404 : IExamplesProvider<ErrorResponse>
{
    public ErrorResponse GetExamples()
    {
        return (new ErrorResponse(404,
            "Could not find job", "job_not_found"));
    }
}

public class ErrorResponseExample500 : IExamplesProvider<ErrorResponse>
{
    public ErrorResponse GetExamples()
    {
        return (new ErrorResponse(500,
            "Internal server error", "internal_server_error"));
    }
}
public class ErrorResponseExample405 : IExamplesProvider<ErrorResponse>
{
    public ErrorResponse GetExamples()
    {
        return (new ErrorResponse(405,
            "Method not allowed: (PUT: /v/yourpath)", "method_not_allowed"));
    }
}
public class ErrorResponseExample429 : IExamplesProvider<ErrorResponse>
{
    public ErrorResponse GetExamples()
    {
        return (new ErrorResponse(429,
            "Rate limiting: Try again in a bit. Slow down", "rate_limit_hit"));
    }
}
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