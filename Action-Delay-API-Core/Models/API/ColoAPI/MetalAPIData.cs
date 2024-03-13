using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.API.ColoAPI
{
    public partial class MetalAPIData
    {
        [JsonPropertyName("coloId")]
        public int ColoId { get; set; }

        [JsonPropertyName("latestUpdate")]
        public string LatestUpdate { get; set; }

        [JsonPropertyName("dateFound")]
        public string DateFound { get; set; }

        [JsonPropertyName("activeMachinesCount")]
        public int ActiveMachinesCount { get; set; }

        [JsonPropertyName("machines")]
        public APIMachine[] Machines { get; set; }
    }

    public partial class APIMachine
    {
        [JsonPropertyName("machineId")]
        public int MachineId { get; set; }

        [JsonPropertyName("lastUpdated")]
        public string LastUpdated { get; set; }

        [JsonPropertyName("dateFound")]
        public string DateFound { get; set; }
    }

}
