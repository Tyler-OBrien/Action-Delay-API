using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Worker.Models.API.Request.Jobs;

namespace Action_Delay_API_Worker.Models.Services
{
    public class InMemoryJob
    {

        public string JobName { get; set; }

        public JobStartRequest JobDetails { get; set; }

        public Task RunningTask { get; set; }

        public DateTime LastCheckUtc { get; set; }

        public bool Complete { get; set; }
        
        public bool Failed { get; set; }

        public string? Info { get; set; }

        public bool Cancelled { get; set; }

        public List<double> ResponseTimes = new List<double>();


    }
}
 