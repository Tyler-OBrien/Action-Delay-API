using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.GoogleCloudAPI.DNS;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Google
{
    public class GoogleCloudDNSDelayJob : BasePropagationJob
    {
        private readonly IGoogleCloudAPIBroker _apiBroker;
        internal GoogleCloudDNSDelayJobConfig _jobConfig;
        internal string _valueToLookFor;
        private int _repeatedRunCount = 1;

        public GoogleCloudDNSDelayJob(IGoogleCloudAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<GoogleCloudDNSDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            if (_jobConfig == null)
                _jobConfig = _config.GoogleCloudDNSJob;
            _apiBroker = apiBroker;
        }

        public override int TargetExecutionSecond => 20;
        public override bool Enabled => _config.GoogleCloudDNSJob != null && (_config.GoogleCloudDNSJob.Enabled.HasValue == false || _config.GoogleCloudDNSJob is { Enabled: true });

        public override string Name => "Google Cloud DNS Delay Job";
        public override string InternalName => "googledns";
        public override string JobType => "GoogleDelay";
        public override string JobDescription => "Delay of an updated DNS Record being reflected globally, updating a simple TXT Record via Google Cloud DNS";

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
            var fqdn = _jobConfig.RecordName.EndsWith('.') ? _jobConfig.RecordName : _jobConfig.RecordName + ".";
            var newUpdateRequest = new UpdateGCPRRSetRequest()
            {
                Name = fqdn,
                Type = "TXT",
                Ttl = 1,
                Rrdatas = [$"\"{_valueToLookFor} {_repeatedRunCount++}\""]
            };
            var tryPatchAPI = await _apiBroker.UpdateDNSRecord(
                _jobConfig.ProjectId,
                _jobConfig.ZoneName,
                _jobConfig.RecordName,
                newUpdateRequest,
                _jobConfig.ServiceAccountJson,
                CancellationToken.None);
            if (tryPatchAPI.IsFailed)
            {
                _logger.LogCritical($"Failure updating Google Cloud DNS record, logs: {tryPatchAPI.Errors?.FirstOrDefault()?.Message}");

                if (tryPatchAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure updating Google Cloud DNS Record, logs: {tryPatchAPI.Errors?.FirstOrDefault()?.Message}");
            }
            this.JobData.APIResponseTimeUtc = tryPatchAPI.Value.ResponseTimeMs;
        }

        public async Task<Result<SerializableDNSResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSDNSRequest()
            {
                QueryName = _jobConfig.RecordName,
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
                _logger.LogInformation($"{location.Name}: Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}");
                return new RunLocationResult("Queue Error", null, -1);
            }

            var getResponse = tryGetResult.Value;
            if (tryGetResult.Value.ProxyFailure)
            {
                _logger.LogInformation($"{location.Name}: Proxy Failure {getResponse.Info}, aborting loc");
                return new RunLocationResult("Proxy Failure", null, -1);
            }
            if (tryGetResult.Value.ResponseCode != "NoError" && (getResponse.Answers == null || getResponse.Answers.Any() == false))
            {
                _logger.LogInformation($"{location.Name}: Proxy Failure {getResponse.Info} based on response {getResponse.ResponseCode}, aborting loc");
                return new RunLocationResult("Proxy Failure", null, -1);
            }

            // GCP TXT records are returned with surrounding quotes — strip them before comparing
            string rawAnswer = getResponse.Answers.FirstOrDefault()?.Value ?? "";
            string tryGetAnswer = rawAnswer.Trim('"');

            if (tryGetAnswer.StartsWith(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
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
