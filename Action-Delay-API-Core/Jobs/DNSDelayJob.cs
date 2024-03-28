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

namespace Action_Delay_API_Core.Jobs
{
    public class DNSDelayJob : IBaseJob
    {

        internal readonly ICloudflareAPIBroker _apiBroker;
        internal readonly LocalConfig _config;
        internal readonly ILogger _logger;
        internal readonly IQueue _queue;
        internal DNSDelayJobConfig _jobConfig;
        internal string _valueToLookFor;

        public DNSDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<DNSDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue )
        {
            _apiBroker = apiBroker;
            _config = config.Value;
            _logger = logger;
            _queue = queue;
            if (_jobConfig == null)
                _jobConfig = _config.DNSJob;
        }


        



        public override int TargetExecutionSecond => 10;
        public override string Name => "DNS Delay Job";
        public override string InternalName => "dns";



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
            _valueToLookFor = $"Are Blobs Still Breaking Things? Yes - Last Updated: {DateTime.UtcNow:R} - {Name} - Action Delay API {Program.VERSION} {_config.Location}";
            var newUpdateRequest = new UpdateRecordRequest()
            {
                Comment = "Blame Walshy",
                Content = _valueToLookFor,
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
                NetType = location.NetType ?? NetType.Either,
                TimeoutMs = 5000
            }; 
            return await _queue.DNS(newRequest, location.NATSName ?? location.Name, token);
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



            //_logger.LogInformation($"{Name}: One DNS Request returned from {location.NATSName} - Success {getResponse.ResponseCode}");
            string tryGetAnswer = getResponse.Answers.FirstOrDefault()?.Value ?? "";
            if (tryGetAnswer.Equals(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                _logger.LogInformation($"{Name}: {location.Name} sees the change!");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, -1 );
            }
            else
            {
                _logger.LogInformation($"{Name}: {location.DisplayName ?? location.Name} sees {tryGetAnswer} instead of {_valueToLookFor}!");
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, -1);
            }
        }
    }
}
