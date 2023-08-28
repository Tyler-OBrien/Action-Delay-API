using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class GenericJobData
    {
        [Required]
        [Key]
        public string JobName { get; set; }

        public string Value { get; set; }

        public string Metadata { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
