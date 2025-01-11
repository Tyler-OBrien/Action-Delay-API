using ClickHouse.Client.Types.Grammar;
using Serilog.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
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
        [JsonConverter(typeof(StringOrNumberConverter))]
        public string Timestamp { get; set; }
    }

    public class StringOrNumberConverter : JsonConverter<string>
    {
        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                return reader.GetString();
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                if (reader.TryGetInt64(out var int64))
                    return int64.ToString();
                if (reader.TryGetUInt64(out var uint64))
                    return uint64.ToString();
                if (reader.TryGetUInt32(out var uint32))
                    return uint32.ToString();
                if (reader.TryGetInt32(out var int32))
                    return int32.ToString();


                return reader.GetInt64().ToString();
            }
            else
            {
                throw new JsonException("Unexpected token type.");
            }
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value);
        }
    }
}
