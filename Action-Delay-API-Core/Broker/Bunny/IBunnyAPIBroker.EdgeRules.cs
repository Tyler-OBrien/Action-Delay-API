using Action_Delay_API_Core.Models.BunnyAPI.EdgeRules;
using Action_Delay_API_Core.Models.BunnyAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker.Bunny
{
    partial interface IBunnyAPIBroker
    {
        public Task<Result<BunnyAPIResponse>> UpdateEdgeRule(string zoneId, BunnyEdgeRuleDto edgeRule, string apiToken,
            CancellationToken token);

    }
}
