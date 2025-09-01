using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.API.ColoAPI;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class ColoData : BaseEntityClass
    {
        public ColoData()
        {

        }

        public ColoData(Colo apiData)
        {
            this.ColoId = apiData.Id;
            this.IATA = apiData.Iata;
            this.FriendlyName = apiData.NiceName ?? string.Empty;
            this.Country = apiData.Country ?? string.Empty;
            this.Latitude = apiData.Lat ?? 0;
            this.Longitude = apiData.Long ?? 0;
            this.CfRegionDo = apiData.CfRegionDo;
            this.CfRegionLb = apiData.CfRegionLb;
            DealWithFriendlyRegionName();
        }

        public void Update(Colo apiData)
        {
            this.ColoId = apiData.Id;
            this.IATA = apiData.Iata;
            this.FriendlyName = apiData.NiceName ?? string.Empty;
            this.Country = apiData.Country ?? string.Empty;
            this.Latitude = apiData.Lat ?? 0;
            this.Longitude = apiData.Long ?? 0;
            this.CfRegionDo = apiData.CfRegionDo;
            this.CfRegionLb = apiData.CfRegionLb;
            DealWithFriendlyRegionName();
        }

        public void DealWithFriendlyRegionName()
        {
            if (String.IsNullOrWhiteSpace(CfRegionLb) == false)
            {
                switch (CfRegionLb.ToLower())
                {
                    // North America
                    case "enam":  // Eastern North America
                    case "wnam":  // Western North America
                        this.FriendlyRegionName = "NA";
                        break;

                    // Europe
                    case "weu":   // Western Europe
                    case "eeu":   // Eastern Europe
                        this.FriendlyRegionName = "EU";
                        break;

                    // Asia
                    case "neas":  // Northeast Asia
                    case "seas":  // Southeast Asia
                    case "sas":   // Southern Asia
                        this.FriendlyRegionName = "AS";
                        break;

                    // Middle East
                    case "me":    // Middle East
                        this.FriendlyRegionName = "ME";
                        break;

                    // Africa
                    case "naf":   // Northern Africa
                    case "saf":   // Southern Africa
                        this.FriendlyRegionName = "AF";
                        break;

                    // South America
                    case "nsam":  // Northern South America
                    case "ssam":  // Southern South America
                        this.FriendlyRegionName = "SA";
                        break;

                    // Oceania
                    case "oc":    // Oceania
                        this.FriendlyRegionName = "OC";
                        break;

                    // Default case
                    default:
                        this.FriendlyRegionName = CfRegionDo;
                        break;
                }
            }
        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ColoId { get; set; }

        public string IATA { get; set; }

        public string FriendlyName { get; set; }

        public string FriendlyRegionName { get; set; }

        public string Country { get; set; }


        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string? CfRegionLb { get; set; }

        public string? CfRegionDo { get; set; }

    }
}
