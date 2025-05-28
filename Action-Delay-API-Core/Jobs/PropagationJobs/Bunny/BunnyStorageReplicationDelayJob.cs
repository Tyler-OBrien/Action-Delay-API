using System.Net;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Jobs.PropagationJobs;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Jobs
{
    public class BunnyStorageReplicationDelayJob : BasePropagationJob
    {
        private readonly IBunnyAPIBroker _apiBroker;

        private string _generatedValue { get; set; }
        private readonly string fileName = "ADPFile.txt";
        private int _repeatedRunCount = 1;

        internal BunnyUploadReplicationDelayJobConfig? _jobConfig;

        public override bool Enabled => _jobConfig != null && (_jobConfig.Enabled.HasValue == false || _jobConfig is { Enabled: true });


        public override int TargetExecutionSecond => 35;



        public BunnyStorageReplicationDelayJob(IBunnyAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<BunnyStorageReplicationDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(config, logger, clickHouse, dbContext, queue)
        {
            if (_jobConfig == null)
                _jobConfig = _config.BunnyUploadReplicationJob;
            _apiBroker = apiBroker;
        }

        public override string Name => "Bunny Edge Storage Replication Delay Job";
        public override string InternalName => "bunnystoragereplication";

        public override string JobType => "BunnyDelay";

        public override string JobDescription => "Delay of an edge storage update being reflected on Edge, using SSD Storage with all regions on standard tier. Upload a small ~20 KB file with random values, and check until updated on edge, no caching.";

        public override async Task PreWarmRunLocation(Location location)
        {
            await SendLocation(location, CancellationToken.None);
        }

        public override async Task RunAction()
        {
            _logger.LogInformation("Running Storage Replication Delay Job");
            _generatedValue = $"{Guid.NewGuid()}-Cookies-Uploaded At {DateTime.UtcNow.ToString("R")} by Action-Delay-API {Program.VERSION} {_config.Location} ";
            await RunRepeatableAction();
        }
        public override async Task RunRepeatableAction()
        {

            var uploadText = $"{_generatedValue} {_repeatedRunCount++}";

            var tryPutAPI = await _apiBroker.UploadFileStorageZone(_jobConfig.StorageAccount, fileName, uploadText, _jobConfig.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure uploading storage file, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure uploading storage file, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            this.JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
            _logger.LogInformation("Uploaded Storage File...");
        }

        private async Task<Result<SerializableHttpResponse>> SendLocation(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                },
                URL = _jobConfig.Url + $"/{fileName}",
                TimeoutMs = 10_000,
                EnableConnectionReuse = false,
                NoResponseHeaders = true,
            };
            newRequest.SetDefaultsFromLocation(location);

            return await _queue.HTTP(newRequest, location, token);
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {

            var tryGetResult = await SendLocation(location, token);

            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult("Queue Error", null, -1);
            }
            var getResponse = tryGetResult.Value;

            //_logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess} - Response UTC: {getResponse.ResponseUTC}");

            if (getResponse.Body.StartsWith(_generatedValue, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} see change.");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
            else
            {
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees {getResponse.Body} instead of {_generatedValue}! Status Code: {getResponse.StatusCode}");
                if (getResponse is { WasSuccess: false, ProxyFailure: true })
                {
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING!!!!! Headers: {String.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                    return new RunLocationResult("Proxy Error", null, getResponse.GetColoId());
                }
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
        }

        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

    }
}
