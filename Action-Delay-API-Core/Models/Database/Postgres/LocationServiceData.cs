using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class LocationServiceData : BaseEntityClass
    {
        [Required]
        [Key]
        public string LocationName { get; set; }


        public double ServiceLatitude { get; set; }

        public double ServiceLongitude { get; set; }

        public string ServiceFriendlyLocationName { get; set; }

        public string ServiceLocationId { get; set; }

        public DateTime LastUpdate { get; set; }

        public DateTime LastChange { get; set; }
    }
}
