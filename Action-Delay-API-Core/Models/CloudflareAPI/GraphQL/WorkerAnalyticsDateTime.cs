using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.CloudflareAPI.GraphQL
{
    public class WorkerAnalyticsDatetime
    {
        public partial class Data
        {
            [JsonPropertyName("viewer")]
            public Viewer Viewer { get; set; }
        }

        public partial class Viewer
        {
            [JsonPropertyName("accounts")]
            public Account[] Accounts { get; set; }
        }

        public partial class Account
        {
            [JsonPropertyName("workersInvocationsAdaptive")]
            public WorkersInvocationsAdaptive[] WorkersInvocationsAdaptive { get; set; }
        }

        public partial class WorkersInvocationsAdaptive
        {
            [JsonPropertyName("dimensions")]
            public Dimensions Dimensions { get; set; }
        }

        public partial class Dimensions
        {
            [JsonPropertyName("datetime")]
            public DateTimeOffset Datetime { get; set; }
        }
    }
}
