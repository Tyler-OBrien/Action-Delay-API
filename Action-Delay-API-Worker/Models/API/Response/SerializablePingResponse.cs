using System.Text.Json.Serialization;

namespace Action_Delay_API_Worker.Models.API.Response
{
    public class SerializablePingResponse
    {

        public bool WasSuccess { get; set; }

        public bool ProxyFailure { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Info { get; set; }

        /// <summary>
        /// Why the probe failed, from <see cref="ProbeFailureKind"/>. Null on success, and null from
        /// workers predating this field - Core treats absent as "fall back to ProxyFailure".
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? FailureKind { get; set; }

        public double ResponseTimeMsAvg { get; set; }
    }
}
