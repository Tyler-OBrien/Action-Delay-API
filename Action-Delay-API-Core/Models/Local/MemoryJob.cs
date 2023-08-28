using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Jobs;

namespace Action_Delay_API_Core.Models.Local
{
    public class MemoryJob
    {
        public Task? RunningTask { get; set; }

        public DateTime? NextExecutionTime { get; set; }

        public string JobName { get; set; }

        public Type JobType { get; set; }

        public IServiceScope Scope { get; set; }
    }
}
