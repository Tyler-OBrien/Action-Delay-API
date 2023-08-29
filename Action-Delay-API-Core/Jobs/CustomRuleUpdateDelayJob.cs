using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs
{
    public class CustomRuleUpdateDelayJob : IBaseJob
    {

        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IQueue _queue;
        private string _valueToLookFor;
        private string _specialPath;

        public CustomRuleUpdateDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CustomRuleUpdateDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext)
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
        }





        public override int TargetExecutionSecond => 50;
        public override string Name => "Custom Rule Block Delay Job";


        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

        public override async Task RunAction()
        {
            _valueToLookFor = $"You've been blocked - Last Updated: {DateTime.UtcNow:R}";
            _specialPath = DateTime.UtcNow.ToFileTime().ToString();
            var newUpdateRequest = new UpdateCustomRuleRequest.UpdateCustomRuleRequestDTO()
            {
               Action = "Block",
               ActionParameters = new UpdateCustomRuleRequest.ActionParameters()
               {
                   Response = new UpdateCustomRuleRequest.Response()
                   {
                       Content = _valueToLookFor,
                       StatusCode = 415,
                       ContentType = "text/html"
                   }
               },
               Description = "Auto updating block me pls rule",
               Enabled = true,
               Expression = $"(http.host eq \"{_config.WAFJob.HostName}\" and http.request.uri.path in {{\"/\" \"/{_specialPath}\" \"/hii\"}})",
               Id = _config.WAFJob.RuleId,
               Ref = _config.WAFJob.RuleId,
            };
            var tryPutAPI = await _apiBroker.UpdateCustomRule(_config.WAFJob.RuleId, _config.WAFJob.RuleSetId, _config.WAFJob.ZoneId, newUpdateRequest, _config.WAFJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating custom rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                throw new InvalidOperationException(
                    $"Failure updating custom rule, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>(),
                URL = "https://" + _config.WAFJob.HostName + $"/{_specialPath}",
            };
            var tryGetResult = await _queue.HTTP(newRequest, location.NATSName ?? location.Name, token);

            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult(false, "Queue Error");
            }
            var getResponse = tryGetResult.Value;

            _logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

            if (getResponse.StatusCode == HttpStatusCode.UnsupportedMediaType && getResponse.Body.Equals(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed");
            }
            else
            {
                _logger.LogInformation($"{location.Name} sees {getResponse.Body} instead of {_valueToLookFor}, and {getResponse.StatusCode} instead of {HttpStatusCode.UnsupportedMediaType.ToString()}! Let's try again...");
                return new RunLocationResult(false, "Undeployed");
            }
        }
    }
}
