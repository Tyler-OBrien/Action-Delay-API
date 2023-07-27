using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI;


public interface ApiResponseBase
{
    [JsonPropertyName("success")] public bool Success { get; set; }

    [JsonPropertyName("errors")] public APIMessage[] Errors { get; set; }

    [JsonPropertyName("messages")] public APIMessage[] Messages { get; set; }
}

public class ApiResponse<TResult> : ApiResponseBase
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("result")]
    public TResult? Result { get; set; }



    [JsonPropertyName("success")] public bool Success { get; set; }

    [JsonPropertyName("errors")] public APIMessage[] Errors { get; set; }

    [JsonPropertyName("messages")] public APIMessage[] Messages { get; set; }
}

public partial class APIMessage
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("code")]
    public long? Code { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("message")]
    public string Message { get; set; }

    public override string ToString()
    {
        return $"{Code}: {Message}";
    }
}


public class ApiResponse
{
    [JsonPropertyName("success")] public bool Success { get; set; }

    [JsonPropertyName("errors")] public APIMessage[] Errors { get; set; }

    [JsonPropertyName("messages")] public APIMessage[] Messages { get; set; }
}