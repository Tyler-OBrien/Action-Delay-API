using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Local
{
    public class Location
    {
        public string Name { get; set; }

        public string? NATSName { get; set; }

        public string? DisplayName { get; set; }

        public bool Disabled { get; set; }
    }
}
