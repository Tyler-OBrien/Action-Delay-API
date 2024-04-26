using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Database.Postgres;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    public class NormalJobAnalytics
    {
        public List<NormalJobAnalyticsPoint> Points { get; set; }

        public int GroupByMinutesInterval { get; set; }
    }

    public class NormalJobAnalyticsPoint
    {
        public NormalJobAnalyticsPoint()
        {

        }

        public DateTime TimePeriod { get; set; }

        public bool? Undeployed { get; set; }

        public ulong? MinRunLength { get; set; }
        public ulong? MaxRunLength { get; set; }
        public ulong? AvgRunLength { get; set; }
        public ulong? MedianRunLength { get; set; }

        public ulong? MinResponseLatency { get; set; }
        public ulong? MaxResponseLatency { get; set; }
        public ulong? AvgResponseLatency { get; set; }
        public ulong? MedianResponseLatency { get; set; }
    }
}
