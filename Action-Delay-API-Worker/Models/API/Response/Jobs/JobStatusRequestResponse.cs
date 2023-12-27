using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Worker.Models.API.Response.Jobs
{
    public class JobStatusRequestResponse
    {
        public DateTime LastCheckUtc { get; set; }

        public bool Complete { get; set; }

        public bool Failed { get; set; }

        public string? Info { get; set; }

        public double? AverageResponseLatency { get; set; }
    }
}
