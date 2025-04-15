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
        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ColoId { get; set; }

        public string IATA { get; set; }

        public string FriendlyName { get; set; }

        public string Country { get; set; }


        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string? CfRegionLb { get; set; }

        public string? CfRegionDo { get; set; }

    }
}
