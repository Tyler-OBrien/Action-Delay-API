using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    public class ErrorJobAnalytics
    {
        public List<ErrorJobAnalyticsPoint> Points { get; set; }

        public int GroupByMinutesInterval { get; set; }
    }

    public class ErrorJobAnalyticsPoint
    {
        public ErrorJobAnalyticsPoint()
        {

        }

        public DateTime TimePeriod { get; set; }

        public string JobName { get; set; }

        public string ErrorHash { get; set; }

        public ulong Count { get; set; }

       
    }
}
