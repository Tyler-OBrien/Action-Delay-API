using Action_Delay_API_Core.Models.Database.Postgres;
using Swashbuckle.AspNetCore.Filters;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2;

public class IncidentDataArrayResponseExample : IExamplesProvider<DataResponse<IncidentDataResponse[]>>
{
    public DataResponse<IncidentDataResponse[]> GetExamples()
    {
        return new DataResponse<IncidentDataResponse[]>(
            new[]
            {
                new IncidentDataResponse
                {
                    Id = new Guid("b2250a23b37e4f99a27d904196ff4c96"),
                    RuleId = "bunnyedgerule_runlength",
                    InternalRuleId = "bunnyedgerule_runlength_active",
                    Target = "bunnyedgerule",
                    TargetType = 0,
                    StartedAt = DateTime.Parse("2025-05-19 03:12:42"),
                    EndedAt = DateTime.Parse("2025-05-19 03:14:44"),
                    Active = false,
                    CurrentValue = "45692",
                    ThresholdValue = "44131",
                },

            }
        );
    }
}

public class IncidentDataResponse
{
    [JsonPropertyName("id")] public Guid Id { get; set; }


    [JsonPropertyName("ruleId")] public string RuleId { get; set; }

    [JsonPropertyName("internalRuleId")] public string InternalRuleId { get; set; }

    [JsonPropertyName("target")] public string Target { get; set; }

    [JsonPropertyName("targetType")] public TargetType TargetType { get; set; }

    [JsonPropertyName("startedAt")] public DateTime StartedAt { get; set; }
    [JsonPropertyName("endedAt")] public DateTime? EndedAt { get; set; }
    [JsonPropertyName("active")] public bool Active { get; set; }
    [JsonPropertyName("currentValue")] public string CurrentValue { get; set; }
    [JsonPropertyName("thresholdValue")] public string ThresholdValue { get; set; }



    public static IncidentDataResponse FromIncident(Incident data)
    {
        return new IncidentDataResponse
        {
           Id = data.Id,
           RuleId = data.RuleId,
           InternalRuleId = data.InternalRuleId,
           Target = data.Target,
           TargetType = data.TargetType,
           StartedAt = data.StartedAt,
           EndedAt = data.EndedAt,
           Active = data.Active,
           CurrentValue = data.CurrentValue,
           ThresholdValue = data.ThresholdValue,
        };

    }
}
