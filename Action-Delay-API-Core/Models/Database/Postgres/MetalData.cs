using Action_Delay_API_Core.Models.API.ColoAPI;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class MetalData : BaseEntityClass
    {
        public MetalData()
        {

        }

        public MetalData(APIMachine apiData, int coloId)
        {
            this.ColoId = coloId;
            this.MachineID = apiData.MachineId;
            if (DateTime.TryParse(apiData.DateFound, out var parsedDateFound))
                this.DateFound = parsedDateFound;
            else 
                this.DateFound = DateTime.MinValue;

            if (DateTime.TryParse(apiData.LastUpdated, out var parsedLastUpdated))
                this.LastUpdated = parsedLastUpdated;
            else
                this.LastUpdated = DateTime.MinValue;
            this.DateFound = DateTime.SpecifyKind(this.DateFound, DateTimeKind.Utc);
            this.LastUpdated = DateTime.SpecifyKind(this.LastUpdated, DateTimeKind.Utc);
        }

        public void Update(APIMachine apiData, int coloId)
        {
            this.ColoId = coloId;
            this.MachineID = apiData.MachineId;
            if (DateTime.TryParse(apiData.DateFound, out var parsedDateFound))
                this.DateFound = parsedDateFound;
            else
                this.DateFound = DateTime.MinValue;

            if (DateTime.TryParse(apiData.LastUpdated, out var parsedLastUpdated))
                this.LastUpdated = parsedLastUpdated;
            else
                this.LastUpdated = DateTime.MinValue;
            this.DateFound = DateTime.SpecifyKind(this.DateFound, DateTimeKind.Utc);
            this.LastUpdated = DateTime.SpecifyKind(this.LastUpdated, DateTimeKind.Utc);
        }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ColoId { get; set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int MachineID { get; set; }

        public DateTime DateFound { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
