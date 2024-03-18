using Action_Delay_API_Core.Models.Database.Postgres;
using Swashbuckle.AspNetCore.Filters;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Action_Delay_API.Models.API.Responses.DTOs
{


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
