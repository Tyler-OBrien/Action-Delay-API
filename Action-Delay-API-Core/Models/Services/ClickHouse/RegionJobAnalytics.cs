using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    public class RegionJobAnalytics
    {
        public List<RegionJobAnalyticsPoint> Points { get; set; }

        public int GroupByMinutesInterval { get; set; }
    }

    public class RegionJobAnalyticsPoint
    {
        public RegionJobAnalyticsPoint()
        {

        }

        public string FriendlyRegionName { get; set; }

        public DateTime TimePeriod { get; set; }

        public ulong EventCount { get; set; }
    }
}
