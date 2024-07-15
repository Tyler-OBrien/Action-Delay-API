using System.Text.Json.Serialization;

namespace Action_Delay_API_Worker.Models.API.Response
{
    public class SerializablePingResponse
    {

        public bool WasSuccess { get; set; }

        public bool ProxyFailure { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Info { get; set; }

        public double ResponseTimeMsAvg { get; set; }
    }
}
