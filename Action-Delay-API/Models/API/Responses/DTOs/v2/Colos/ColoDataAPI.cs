using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Database.Postgres;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Models.API.Responses.DTOs.v2.Colos
{
    public class ColoDataAPIExample : IExamplesProvider<DataResponse<ColoDataAPI[]>>
    {
        public DataResponse<ColoDataAPI[]> GetExamples()
        {
            return new DataResponse<ColoDataAPI[]>(new []
                {
                    new ColoDataAPI
                    {
                        Id = 16,
                        Iata = "IAD",
                        CfRegionLb = "ENAM",
                        NiceName = "Dulles, Virginia, United States",
                        Country = "United States",
                        Lat = 38.94449997,
                        Long = -77.45580292,
                        CfRegionDo = "enam"
                    },
                    new ColoDataAPI
                    {
                        Id = 19,
                        Iata = "CDG",
                        CfRegionLb = "WEU",
                        NiceName = "Paris, France",
                        Country = "France",
                        Lat = 49.0127983093,
                        Long = 2.5499999523,
                        CfRegionDo = "weur"
                    },
                    new ColoDataAPI
                    {
                        Id = 41,
                        Iata = "MDE",
                        CfRegionLb = "NSAM",
                        NiceName = "Rionegro, Colombia",
                        Country = "Colombia",
                        Lat = 6.16454,
                        Long = -75.4231,
                        CfRegionDo = "enam"
                    },
                }
            );
        }
    }
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


    public class ColoDataAPISimpleExample : IExamplesProvider<DataResponse<ColoDataAPISimple[]>>
    {
        public DataResponse<ColoDataAPISimple[]> GetExamples()
        {
            return new DataResponse<ColoDataAPISimple[]>(new[]
                {
                    new ColoDataAPISimple
                    {
                        Iata = "IAD",
                        Id = 16
                    },
                    new ColoDataAPISimple
                    {
                        Iata = "CDG",
                        Id = 19
                    },
                    new ColoDataAPISimple
                    {
                        Iata = "MDE",
                        Id = 41
                    },
                }
            );
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

    public class ColoIataRegionSample : IExamplesProvider<DataResponse<Dictionary<string, string>>>
    {
        public DataResponse<Dictionary<string, string>> GetExamples()
        {
            return new DataResponse<Dictionary<string, string>>(new Dictionary<string, string>()
            {
                { "SJC", "wnam" },
                { "EWR", "enam" },
                { "LAX", "wnam" },
                { "ORD", "enam" },
            });
        }
    }

    public class ColoIDRegionSample : IExamplesProvider<DataResponse<Dictionary<int, string>>>
    {
        public DataResponse<Dictionary<int, string>> GetExamples()
        {
            return new DataResponse<Dictionary<int, string>>(new Dictionary<int, string>()
            {
                { 4, "wnam" },
                { 11, "enam" },
                { 12, "wnam" },
                { 14, "enam" },
            });
        }
    }


}
