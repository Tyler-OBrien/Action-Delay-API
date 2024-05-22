using Action_Delay_API_Core.Models.Local;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Models.NATS.Requests
{
    public class NATSDNSRequest
    {
        public string QueryName { get; set; }
        public string QueryType { get; set; }
        public string DnsServer { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? TimeoutMs { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]

        public NetType? NetType { get; set; }

        public void SetDefaultsFromLocation(Location location)
        {
            NetType = location.NetType ?? NATS.NetType.Either;
        }
    }
}
