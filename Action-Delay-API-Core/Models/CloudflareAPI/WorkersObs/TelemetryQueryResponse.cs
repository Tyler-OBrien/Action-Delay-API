using ClickHouse.Client.Types.Grammar;
using Serilog.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using static Action_Delay_API_Core.Jobs.AI.AIJobConfigs;

namespace Action_Delay_API_Core.Models.CloudflareAPI.WorkersObs
{
    public partial class TelemetryQueryResponseDto
    {
        [JsonPropertyName("events")]
        public Events Events { get; set; }
    }

    public partial class Events
    {
        [JsonPropertyName("events")]
        public EventElement[] EventsEvents { get; set; }
    }

    public partial class EventElement
    {
        [JsonPropertyName("_timestamp")]
        public string Timestamp { get; set; }

        [JsonPropertyName("_now")]
        public string Now { get; set; }
    }
}
