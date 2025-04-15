using System.Text.Json.Serialization;

namespace Action_Delay_Api_HealthChecks.Models
{
    public class NATSPingRequest
    {

        public string Hostname { get; set; }


        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? PingCount { get; set; }


        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? CustomDNSServerOverride { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? TimeoutMs { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]

        public NetType? NetType { get; set; }

        public void SetDefaultsFromLocation(Location location)
        {
            NetType = location.NetType ?? Models.NetType.Either;
        }
    }
}
