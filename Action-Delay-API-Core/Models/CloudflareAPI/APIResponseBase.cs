using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.CloudflareAPI;




public class ApiResponse<TResult>
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("result")]
    public TResult? Result { get; set; }



    [JsonPropertyName("success")] public bool Success { get; set; }

    [JsonPropertyName("errors")] public APIError[] Errors { get; set; }

    [JsonPropertyName("messages")] public APIMessage[] Messages { get; set; }

    // Extensions making it easier to pass metadata around
    [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public double? ResponseTimeMs { get; set; }

    [NotMapped]
    [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public int ColoId { get; set; }


}

public class APIMessage
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

public class APIError
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("code")]
    public long? Code { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("error_chain")]
    public ErrorChain[] ErrorChain { get; set; }

    public override string ToString()
    {
        return $"{Code}: {Message}{String.Join(", ", (ErrorChain ?? Array.Empty<ErrorChain>()).Select(errorChain => errorChain.ToString()))}";
    }
}

public partial class ErrorChain
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

    [JsonPropertyName("errors")] public APIError[] Errors { get; set; }

    [JsonPropertyName("messages")] public APIMessage[] Messages { get; set; }

    // Extensions making it easier to pass metadata around
    [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public double? ResponseTimeMs { get; set; }

    [NotMapped]
    [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public int ColoId { get; set; }

}


public class ApiResponsePaginated<TResult>
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("result")]
    public TResult? Result { get; set; }



    [JsonPropertyName("success")] public bool Success { get; set; }

    [JsonPropertyName("errors")] public APIError[] Errors { get; set; }

    [JsonPropertyName("messages")] public APIMessage[] Messages { get; set; }

    [JsonPropertyName("result_info")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ResultInfo ResultInfo { get; set; }

    // Extensions making it easier to pass metadata around
    [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public double? ResponseTimeMs { get; set; }

    [NotMapped]
    [JsonIgnore(Condition = JsonIgnoreCondition.Always)] public int ColoId { get; set; }




}


public partial class ResultInfo
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("per_page")]
    public int PerPage { get; set; }

    [JsonPropertyName("total_count")]
    public int TotalCount { get; set; }
}