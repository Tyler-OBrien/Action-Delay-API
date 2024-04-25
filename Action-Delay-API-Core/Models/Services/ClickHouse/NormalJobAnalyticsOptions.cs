using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    [Flags]
    public enum JobAnalyticsRequestOptions
    {

        None = 0,
        MinRunLength = 1 << 0,
        MaxRunLength = 1 << 1,
        AvgRunLength = 1 << 2,
        MedianRunLength = 1 << 3,
        MinResponseLatency = 1 << 4,
        MaxResponseLatency = 1 << 5,
        AvgResponseLatency = 1 << 6,
        MedianResponseLatency = 1 << 7,
    }
}
