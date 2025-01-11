using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Models.BunnyAPI;
using Action_Delay_API_Core.Models.BunnyAPI.DNS;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Bunny
{
    public class BunnyDNSDelayJob : BasePropagationJob
    {

        private readonly IBunnyAPIBroker _apiBroker;
        internal DNSDelayJobConfig _jobConfig;
        internal string _valueToLookFor;
        private int _repeatedRunCount = 1;

        public BunnyDNSDelayJob(IBunnyAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<BunnyDNSDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(config, logger, clickHouse, dbContext, queue)
        {
            if (_jobConfig == null)
                _jobConfig = _config.BunnyDNSJob;
            _apiBroker = apiBroker;
        }






        public override int TargetExecutionSecond => 13;
        public override bool Enabled => _config.BunnyDNSJob != null && (_config.BunnyDNSJob.Enabled.HasValue == false || _config.BunnyDNSJob is { Enabled: true });

        public override string Name => "Bunny DNS Delay Job";
        public override string InternalName => "bunnydns";

        public override string JobType => "BunnyDelay";

        public override string JobDescription => "Delay of an updated DNS Record being reflected on Edge";




        // This job is always slow, so doing tons of requests in the first second when it's never been that fast in its entire life is just a waste.
        public override TimeSpan CalculateBackoff(double totalWaitTimeInSeconds)
        {
            double secondsUntilNextAlarm = totalWaitTimeInSeconds switch
            {
                > 1800 => 30,
                > 600 => 15,
                > 120 => 10,
                > 60 => 4,
                > 30 => 2,
                > 5 => 0.5,
                > 2 => 0.5,
                _ => 0.5,
            };
            return TimeSpan.FromSeconds(secondsUntilNextAlarm);
        }


        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

        public override async Task PreWarmRunLocation(Location location)
        {
            await SendRequest(location, CancellationToken.None);
        }

        public override async Task RunAction()
        {
            _valueToLookFor = $"Automagically Updating DNS Record - Last Updated: {DateTime.UtcNow:R} - {Name} - Action Delay API {Program.VERSION} {_config.Location}";
            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            var newUpdateRequest = new BunnyUpdateRecordRequest()
            {
                Value = _valueToLookFor + $" {_repeatedRunCount++}",
            };
            var tryPutAPI = await _apiBroker.UpdateDNSRecord(_jobConfig.RecordId, _jobConfig.ZoneId, newUpdateRequest, _jobConfig.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating dns record, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");

                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating DNS Record, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            this.JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
        }

        public async Task<Result<SerializableDNSResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSDNSRequest()
            {
                QueryName = _jobConfig.Name,
                QueryType = "TXT",
                DnsServer = _jobConfig.NameServers,
                TimeoutMs = 5000
            };
            newRequest.SetDefaultsFromLocation(location);
            return await _queue.DNS(newRequest, location, token);
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var tryGetResult = await SendRequest(location, token);
            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}");
                return new RunLocationResult("Queue Error", null, -1);
            }

            var getResponse = tryGetResult.Value;
            if (tryGetResult.Value.ProxyFailure)
            {

                _logger.LogInformation($"Proxy Failure {getResponse.Info}, aborting loc");
                return new RunLocationResult("Proxy Failure", null, -1);
            }
            if (tryGetResult.Value.ResponseCode != "NoError" && (getResponse.Answers == null || getResponse.Answers.Any() == false ) )
            {
                _logger.LogInformation($"Proxy Failure {getResponse.Info} based on response {getResponse.ResponseCode}, aborting loc");
                return new RunLocationResult("Proxy Failure", null, -1);
            }



            //_logger.LogInformation($"{Name}: One DNS Request returned from {location.NATSName} - Success {getResponse.ResponseCode}");
            string tryGetAnswer = getResponse.Answers.FirstOrDefault()?.Value ?? "";
            if (tryGetAnswer.StartsWith(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{Name}: {location.Name}:{getResponse.TryGetColoId()} sees the change!");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.TryGetColoId() ?? -1);
            }
            else
            {
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{Name}: {location.DisplayName ?? location.Name}:{getResponse.TryGetColoId()} sees {tryGetAnswer} instead of {_valueToLookFor}!");
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.TryGetColoId() ?? -1);
            }
        }
    }
}
