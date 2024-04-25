using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Services.ClickHouse
{
    public enum DataSet
    {
        Minutely,
        Per30Minutes,
        Per12Hours
    }

    public class IntervalDataSet
    {
        public int Interval { get; set; }
        public DataSet DataSet { get; set; }

        // Is this an Aggregated Dataset
        public bool Agg { get; set; }

        public override string ToString()
        {
            return $"{Interval} - {DataSet}";
        }
    }

    public struct IntervalToUse
    {
        public IntervalToUse(DataSet dataset, int interval, bool agg)
        {
            Dataset = dataset;
            Interval = interval;
            Agg = agg;
        }

        public DataSet Dataset { get; set; }

        public int Interval { get; set; }

        // Is this an Aggregated Dataset
        public bool Agg { get; set; }

    }
}
