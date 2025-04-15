using Action_Delay_Api_Worker_Cli.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_Api_Worker_Cli
{
    public class LocalConfig
    {
        public string SENTRY_DSN { get; set; }

        public string API_ENDPOINT { get; set; }

        public string NATSConnectionURL { get; set; }

        public bool NATSRequestCompression { get; set; }

        public Dictionary<string, string> CUSTOM_REQUEST_HEADERS_FOR_API { get; set; }

        public List<Location> Locations { get; set; }

        public string HttpRequestSecret { get; set; }
    }

    public class Location
    {
        public string Name { get; set; }

        public string? NATSName { get; set; }

        public string? URL { get; set; }

        public string? DisplayName { get; set; }

        public bool Disabled { get; set; }


        public NetType? NetType { get; set; }
        public string? DNSResolveOverride { get; set; }

        public bool? Compression { get; set; }

    }
}
