using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace Action_Delay_API_Clickhouse_Worker.Models
{
    public class ClickhouseRow
    {
        public string TableName { get; set; }

        public JsonNode Data { get; set; }
    }
}
