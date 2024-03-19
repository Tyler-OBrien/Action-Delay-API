using Action_Delay_API_Core.Models.Database.Postgres;
using Swashbuckle.AspNetCore.Filters;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs
{

    public class LocationDataResponseExample : IExamplesProvider<DataResponse<LocationDataResponse>>
    {
        public DataResponse<LocationDataResponse> GetExamples()
        {
            return new DataResponse<LocationDataResponse>(
                new LocationDataResponse
                {
                    LocationName = "EWR",
                    FriendlyLocationName = "Newark, New Jersey, United States",
                    Provider = "BuyVM",
                    ASN = 205398,
                    CfLatency = 1.732,
                    PathToCF = "IX",
                    LocationLatitude = 40.6925010681,
                    LocationLongitude = -74.1687011719,
                    ColoFriendlyLocationName = "Newark, New Jersey, United States",
                    ColoId = 649,
                    IATA = "EWR",
                    LastUpdate = DateTime.Parse("2024-03-19T02:28:28.256713Z"),
                    LastChange = DateTime.Parse("2024-02-12T03:46:32.353923Z"),
                    Enabled = true,
                    ColoLatitude = 40.6925010681,
                    ColoLongitude = -74.1687011719
                }
            );
        }
    }

    public class LocationArrayDataResponseExample : IExamplesProvider<DataResponse<LocationDataResponse[]>>
    {
        public DataResponse<LocationDataResponse[]> GetExamples()
        {
            return new DataResponse<LocationDataResponse[]>(new[]
                {
                    new LocationDataResponse
                    {
                        LocationName = "EWR",
                        FriendlyLocationName = "Newark, New Jersey, United States",
                        Provider = "BuyVM",
                        ASN = 205398,
                        CfLatency = 1.732,
                        PathToCF = "IX",
                        LocationLatitude = 40.6925010681,
                        LocationLongitude = -74.1687011719,
                        ColoFriendlyLocationName = "Newark, New Jersey, United States",
                        ColoId = 649,
                        IATA = "EWR",
                        LastUpdate = DateTime.Parse("2024-03-19T02:28:28.256713Z"),
                        LastChange = DateTime.Parse("2024-02-12T03:46:32.353923Z"),
                        Enabled = true,
                        ColoLatitude = 40.6925010681,
                        ColoLongitude = -74.1687011719
                    },
                    new LocationDataResponse
                    {
                        LocationName = "AMS",
                        FriendlyLocationName = "Amsterdam, Netherlands",
                        Provider = "Bakker IT",
                        ASN = 205398,
                        CfLatency = 2.87,
                        PathToCF = "IX",
                        LocationLatitude = 52.3086013794,
                        LocationLongitude = 4.7638897896,
                        ColoFriendlyLocationName = "Amsterdam, Netherlands",
                        ColoId = 522,
                        IATA = "AMS",
                        LastUpdate = DateTime.Parse("2024-03-19T02:28:26.108868Z"),
                        LastChange = DateTime.Parse("2024-02-12T03:46:30.047329Z"),
                        Enabled = true,
                        ColoLatitude = 52.3086013794,
                        ColoLongitude = 4.7638897896
                    },
                    new LocationDataResponse
                    {
                        LocationName = "DFW",
                        FriendlyLocationName = "Dallas-Fort Worth, Texas, United States",
                        Provider = "GreenCloudVPS",
                        ASN = 20278,
                        CfLatency = 1.3,
                        PathToCF = "IX",
                        LocationLatitude = 32.8968009949,
                        LocationLongitude = -97.0380020142,
                        ColoFriendlyLocationName = "Dallas-Fort Worth, Texas, United States",
                        ColoId = 724,
                        IATA = "DFW",
                        LastUpdate = DateTime.Parse("2024-03-19T02:28:28.009813Z"),
                        LastChange = DateTime.Parse("2024-02-12T03:46:32.258317Z"),
                        Enabled = true,
                        ColoLatitude = 32.8968009949,
                        ColoLongitude = -97.0380020142
                    },
                }
            );
        }
    }


    public class LocationDataResponse
    {
        [JsonPropertyName("locationName")]
        public string LocationName { get; set; }

        [JsonPropertyName("friendlyLocationName")]
        public string FriendlyLocationName { get; set; }

        [JsonPropertyName("provider")]
        public string Provider { get; set; }

        [JsonPropertyName("asn")]
        public int ASN { get; set; }

        [JsonPropertyName("cfLatency")]
        public double CfLatency { get; set; }

        [JsonPropertyName("pathToCf")]
        // either IX, Peering, or Transit
        public string PathToCF { get; set; }

        [JsonPropertyName("locationLatitude")]
        public double LocationLatitude { get; set; }

        [JsonPropertyName("locationLongitude")]
        public double LocationLongitude { get; set; }

        [JsonPropertyName("coloFriendlyLocationName")]
        public string ColoFriendlyLocationName { get; set; }

        [JsonPropertyName("coloId")]
        public int ColoId { get; set; }
        [JsonPropertyName("iata")]
        public string IATA { get; set; }

        [JsonPropertyName("lastUpdate")]
        public DateTime LastUpdate { get; set; }
        [JsonPropertyName("lastChange")]
        public DateTime LastChange { get; set; }
        [JsonPropertyName("enabled")]
        public bool Enabled { get; set; }
        [JsonPropertyName("coloLatitude")]
        public double ColoLatitude { get; set; }
        [JsonPropertyName("coloLongitude")]
        public double ColoLongitude { get; set; }

        public static LocationDataResponse FromLocationData(LocationData data)
        {
            var locationDataResponse = new LocationDataResponse();
            locationDataResponse.LocationName = data.LocationName;
            locationDataResponse.FriendlyLocationName = data.FriendlyLocationName;
            locationDataResponse.Provider = data.Provider;
            locationDataResponse.ASN = data.ASN;
            locationDataResponse.CfLatency = data.CfLatency;
            locationDataResponse.PathToCF = data.PathToCF;
            locationDataResponse.LocationLatitude = data.LocationLatitude;
            locationDataResponse.LocationLongitude = data.LocationLongitude;
            locationDataResponse.ColoFriendlyLocationName = data.ColoFriendlyLocationName;
            locationDataResponse.ColoId = data.ColoId;
            locationDataResponse.IATA = data.IATA;
            locationDataResponse.LastUpdate = data.LastUpdate;
            locationDataResponse.LastChange = data.LastChange;
            locationDataResponse.Enabled = data.Enabled;
            locationDataResponse.ColoLatitude = data.ColoLatitude;
            locationDataResponse.ColoLongitude = data.ColoLongitude;
            return locationDataResponse;
        }

    }
}
