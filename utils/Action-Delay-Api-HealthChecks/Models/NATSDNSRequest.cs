using System.Text.Json.Serialization;

namespace Action_Delay_Api_HealthChecks.Models
{
    public class NATSDNSRequest
    {
        public string QueryName { get; set; }
        public string QueryType { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string DnsServer { get; set; }
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
