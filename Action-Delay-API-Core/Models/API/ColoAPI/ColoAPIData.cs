using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.API.ColoAPI
{
    public partial class ColoApiData
    {
        [JsonPropertyName("results")]
        public Colo[] Results { get; set; }
    }

    public partial class Colo
    {
        [JsonPropertyName("ID")]
        public int Id { get; set; }

        [JsonPropertyName("IATA")]
        public string Iata { get; set; }

        [JsonPropertyName("cfRegionLB")]
        public string? CfRegionLb { get; set; }

        [JsonPropertyName("niceName")]
        public string? NiceName { get; set; }

        [JsonPropertyName("country")]
        public string? Country { get; set; }

        [JsonPropertyName("lat")]
        public double? Lat { get; set; }

        [JsonPropertyName("long")]
        public double? Long { get; set; }

        [JsonPropertyName("cfRegionDO")]
        public string? CfRegionDo { get; set; }
    }
}
