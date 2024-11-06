using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.NATS.Requests;
using FluentResults;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI.DNS;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Jobs.PropagationJobs;

namespace Action_Delay_API_Core.Jobs
{
    public class DNSDelayJob : BasePropagationJob
    {


        internal DNSDelayJobConfig _jobConfig;
        internal string _valueToLookFor;
        private int _repeatedRunCount = 1;

        public DNSDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<DNSDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue )
        {
            if (_jobConfig == null)
                _jobConfig = _config.DNSJob;
        }


        



        public override int TargetExecutionSecond => 10;
        public override bool Enabled => _config.DNSJob != null && (_config.DNSJob.Enabled.HasValue == false || _config.DNSJob is { Enabled: true });

        public override string Name => "DNS Delay Job";
        public override string InternalName => "dns";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "Delay of an updated DNS Record being reflected on Edge on a paid zone";




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

        public  override async Task RunAction()
        {
            _valueToLookFor = $"Automagically Updating DNS Record - Last Updated: {DateTime.UtcNow:R} - {Name} - Action Delay API {Program.VERSION} {_config.Location}";
            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            var newUpdateRequest = new UpdateRecordRequest()
            {
                Comment = "Automagically Updating DNS Record",
                Content = _valueToLookFor + $" {_repeatedRunCount++}",
                Name = _jobConfig.Name,
                Proxied = false,
                Ttl = 1,
                Type = "TXT"
            };
            var tryPutAPI = await _apiBroker.UpdateDNSRecord(_jobConfig.RecordId, _jobConfig.ZoneId, newUpdateRequest, _jobConfig.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating worker script, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");

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



            //_logger.LogInformation($"{Name}: One DNS Request returned from {location.NATSName} - Success {getResponse.ResponseCode}");
            string tryGetAnswer = getResponse.Answers.FirstOrDefault()?.Value ?? "";
            if (tryGetAnswer.StartsWith(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{Name}: {location.Name}:{getResponse.TryGetColoId()} sees the change!");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.TryGetColoId() ?? -1);
            }
            else
            {
                _logger.LogInformation($"{Name}: {location.DisplayName ?? location.Name}:{getResponse.TryGetColoId()} sees {tryGetAnswer} instead of {_valueToLookFor}!");
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.TryGetColoId() ?? -1);
            }
        }
    }
}
