using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres
{
    public abstract class BaseEntityClass
    {
        public DateTime LastEditDate { get; set; }
    }
}
