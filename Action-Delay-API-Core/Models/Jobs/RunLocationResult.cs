using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Jobs
{
    public class RunLocationResult
    {
        public RunLocationResult(bool done, string reason)
        {
            Done = done;
            Reason = reason;
        }

        public bool Done { get; set; }

        public string Reason { get; set; }
    }
}
