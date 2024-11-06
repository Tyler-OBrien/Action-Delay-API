using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public class JobError
    {
        [Required]
        [Key]
        public string ErrorHash { get; set; }

        public string ErrorDescription { get; set; }

        public string ErrorType { get; set; }

        public DateTime FirstSeen { get; set; }

        public string FirstService { get; set; }

    }
}
