using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Database.Postgres;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Colos
{
    public class ColoDataAPI
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

        public static ColoDataAPI FromDB(ColoData data)
        {
            return new ColoDataAPI()
            {
                Id = data.ColoId,
                Iata = data.IATA,
                CfRegionLb = data.CfRegionLb,
                NiceName = data.FriendlyName,
                Country = data.Country,
                Lat = data.Latitude,
                Long = data.Longitude,
                CfRegionDo = data.CfRegionDo,
            };

        }
    }

    public class ColoDataAPISimple
    {
            
        [JsonPropertyName("ID")]
        public long Id { get; set; }

        [JsonPropertyName("IATA")]
        public string Iata { get; set; }

        public static ColoDataAPISimple FromDB(ColoData data)
        {
            return new ColoDataAPISimple()
            {
                Id = data.ColoId,
                Iata = data.IATA
            };

        }
    }


}
