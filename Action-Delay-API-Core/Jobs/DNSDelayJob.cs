using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.NATS.Requests;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System.Net;
using Action_Delay_API_Core.Models.Database.Postgres;

namespace Action_Delay_API_Core.Jobs
{
    public class DNSDelayJob : IBaseJob
    {

        private readonly ICloudflareAPIBroker _apiBroker;
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IQueue _queue;
        private string _valueToLookFor;

        public DNSDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<DNSDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue )
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
        }





        public override int TargetExecutionSecond => 10;
        public override string Name => "DNS Delay Job";


        public override async Task HandleCompletion()
        {
          _logger.LogInformation($"Completed {Name}..");
        }

        public  override async Task RunAction()
        {
            _valueToLookFor = $"Are Blobs Still Breaking Things? Yes - Last Updated: {DateTime.UtcNow:R}";
            var newUpdateRequest = new UpdateRecordRequest()
            {
                Comment = "Blame Walshy",
                Content = _valueToLookFor,
                Name = _config.DNSJob.Name,
                Proxied = false,
                Tags = new[] { "Blame-Blobs", "Free-Canadians", "If-your-reading-this-im-sorry" },
                Ttl = 1,
                Type = "TXT"
            };
            var tryPutAPI = await _apiBroker.UpdateDNSRecord(_config.DNSJob.RecordId, _config.DNSJob.ZoneId, newUpdateRequest, _config.DNSJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating worker script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                throw new InvalidOperationException(
                    $"Failure updating DNS Record, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
        }

        public async override Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var newRequest = new NATSDNSRequest()
            {
                QueryName = _config.DNSJob.Name,
                QueryType = "TXT",
                DnsServer = _config.DNSJob.NameServers
            };
            var tryGetResult = await _queue.DNS(newRequest, location.NATSName ?? location.Name, token);
            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}");
                return new RunLocationResult("Queue Error");
            }
            var getResponse = tryGetResult.Value;

            _logger.LogInformation($"One DNS Request returned from {location.NATSName} - Success {getResponse.ResponseCode}");
            string tryGetAnswer = getResponse.Answers.FirstOrDefault()?.Value ?? "";
            if (tryGetAnswer.Equals(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{location.Name} sees the change! Let's remove this and move on..");
                return new RunLocationResult(true, "Deployed");
            }
            else
            {
                _logger.LogInformation($"{location.DisplayName ?? location.Name} sees {tryGetAnswer} instead of {_valueToLookFor}! Let's try again...");
                return new RunLocationResult(false, "Undeployed");
            }
        }
    }
}
