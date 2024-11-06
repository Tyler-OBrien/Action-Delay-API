using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.WorkersObs
{
    public partial class TelemetryQueryRequestDto
    {
        [JsonPropertyName("timeframe")]
        public TelemetryQueryRequestDtoTimeframe Timeframe { get; set; }

        [JsonPropertyName("view")]
        public string View { get; set; }

        [JsonPropertyName("limit")]
        public long Limit { get; set; }

        [JsonPropertyName("dry")]
        public bool Dry { get; set; }

        [JsonPropertyName("queryId")]
        public string QueryId { get; set; }

        [JsonPropertyName("parameters")]
        public TelemetryQueryRequestDtoParameters Parameters { get; set; }
    }

    public partial class TelemetryQueryRequestDtoParameters
    {
        [JsonPropertyName("datasets")]
        public string[] Datasets { get; set; }

        [JsonPropertyName("filters")]
        public TelemetryQueryRequestDtoFilter[] Filters { get; set; }
    }

    public partial class TelemetryQueryRequestDtoFilter
    {
        [JsonPropertyName("key")]
        public string Key { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("value")]
        public string Value { get; set; }

        [JsonPropertyName("operation")]
        public string Operation { get; set; }
    }

    public partial class TelemetryQueryRequestDtoTimeframe
    {
        [JsonPropertyName("to")]
        public long To { get; set; }

        [JsonPropertyName("from")]
        public long From { get; set; }
    }
}
