using Action_Delay_API_Core.Models.CloudflareAPI.PageRules;
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
        public Task<Result<ApiResponse<PageRuleUpdateResponse>>> UpdatePageRule(string pageRuleId,
            string zoneId, PageRuleUpdateRequest.PageRuleUpdateRequestDTO newUpdateRequest, string apiToken,
            CancellationToken token);
    }
}
