﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_Api_Worker_Cli.Models
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
