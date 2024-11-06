using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    public class JobAnalyticsConfiguration
    {
        public string NormalDataSet { get; set; }

        public string NormalDataSetRunStatusFilter { get; set; }


        public string ThirtyMinDataSet { get; set; }

        public string TwelthHourDataSet { get; set; }


        public Dictionary<JobAnalyticsRequestOptions, string> ColumnNames { get; set; } 

        public Dictionary<JobAnalyticsRequestOptions, string> ColumnNamesAgg { get; set; } 
    }
}
