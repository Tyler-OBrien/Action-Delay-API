using Action_Delay_API_Core.Models.NATS;

namespace Action_Delay_API_Core.Models.Local
{
    public class Location
    {
        public string Name { get; set; }

        public string? NATSName { get; set; }

        public string? URL { get; set; }

        public string? DisplayName { get; set; }

        public bool Disabled { get; set; }


        public NetType? NetType { get; set; }
    }
}
