using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Jobs
{
    public abstract class IBaseJob
    {
        public abstract TimeSpan Interval { get; }

        public DateTime LastExecutedUtc { get; set; }

        public bool IsExecuting;

        public abstract string Name { get; }

        public abstract Task Execute();

    }
}
