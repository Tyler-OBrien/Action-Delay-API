using Action_Delay_API_Core.Models.BunnyAPI.DNS;
using Action_Delay_API_Core.Models.BunnyAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker.Bunny
{
    public partial interface IBunnyAPIBroker
    {

        public Task<Result<BunnyAPIResponse>> UpdateDNSRecord(string recordId, string zoneId,
            BunnyUpdateRecordRequest newUpdateRequest, string apiToken, CancellationToken token);

    }
}
