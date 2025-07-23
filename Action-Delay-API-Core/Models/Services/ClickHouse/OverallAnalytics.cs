using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    public class OverallAnalytics
    {
        public ulong NormalJobPerLocationRuns { get; set; }

        public ulong PerfJobPerLocationRuns { get; set; }
    }
}
