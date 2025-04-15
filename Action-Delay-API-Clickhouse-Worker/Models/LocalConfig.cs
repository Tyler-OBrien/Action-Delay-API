using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Clickhouse_Worker.Models
{
    public class LocalConfig
    {
        public string RunnerName { get; set; }

        public string SENTRY_DSN { get; set; }


        public string NATSConnectionURL { get; set; }

        public bool NATSRequestCompression { get; set; }

        public string PostgresConnectionString { get; set; }

        public string ClickhouseConnectionString { get; set; }

        public List<string> TablesToSync { get; set; }

    }
}
