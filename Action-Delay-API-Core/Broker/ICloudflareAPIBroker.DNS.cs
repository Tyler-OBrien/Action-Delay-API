using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker
{
    public partial interface ICloudflareAPIBroker
    {
        Task<Result<ApiResponse<UpdateRecordResponse>>> UpdateDNSRecord(string recordId, string zoneId,
            UpdateRecordRequest newUpdateRequest, string apiToken, CancellationToken token);
    }
}
