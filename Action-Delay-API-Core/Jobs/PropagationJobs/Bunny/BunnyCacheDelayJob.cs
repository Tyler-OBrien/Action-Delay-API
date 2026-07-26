using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Bunny
{
    public class BunnyCacheDelayJob : BasePropagationJob
    {
        private readonly IBunnyAPIBroker _apiBroker;

        private string _valueToLookFor;

        public BunnyCacheDelayJob(IBunnyAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<BunnyCacheDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            _apiBroker = apiBroker;
        }

        public override string Name => "Bunny Single URL Purge Delay Job";

        public override string InternalName => "bunnypurge";

        public override string JobType => "BunnyDelay";

        public override string JobDescription => "Warm up an endpoint until all locations see cache response headers, update the endpoint's response text, call the Bunny Purge URL API and check until the new text is being served on edge";

        public override int TargetExecutionSecond => 45;

        public override bool Enabled => _config.BunnyCacheJob != null && (_config.BunnyCacheJob.Enabled.HasValue == false || _config.BunnyCacheJob is { Enabled: true });

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
            foreach (var location in RunLocations)
            {
                int retries = 5;
                try
                {
                    for (int i = 0; i < retries; i++)
                    {
                        var tryGetResult = await SendRequest(location, CancellationToken.None);
                        if (tryGetResult.IsFailed)
                        {
                            _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, retrying..");
                            continue;
                        }

                        string tryGetCacheStatus = "";

                        var result = tryGetResult.Value;

                        var tryGetCacheStatusHeader = result.Headers.FirstOrDefault(header => header.Key.Equals(
                            "CDN-Cache", StringComparison.OrdinalIgnoreCase));

                        if (String.IsNullOrWhiteSpace(tryGetCacheStatusHeader.Key) == false)
                        {
                            tryGetCacheStatus = tryGetCacheStatusHeader.Value;
                        }

                        var tryGetCacheAgeHeader = result.Headers.FirstOrDefault(header => header.Key.Equals(
                            "Age", StringComparison.OrdinalIgnoreCase));

                        if (String.IsNullOrWhiteSpace(tryGetCacheAgeHeader.Key) == false)
                        {
                            var cacheAge = tryGetCacheAgeHeader.Value;
                            if (String.IsNullOrEmpty(cacheAge) || int.TryParse(cacheAge, out var cacheAgeInt) == false || cacheAgeInt < 10)
                            {
                                if (RateLimitedEventLogger.ShouldLog())
                                    _logger.LogInformation($"Error, cache is too new or missing, cache value {cacheAge}, Cache Status: {tryGetCacheStatus}, location: {location.Name}");
                                continue;
                            }
                            else
                            {
                                if (RateLimitedEventLogger.ShouldLog())
                                    _logger.LogInformation($"{location.Name} pre-warmed, cache age: {cacheAge}, Cache Status: {tryGetCacheStatus}");
                                break;
                            }
                        }
                        else
                        {
                            if (RateLimitedEventLogger.ShouldLog())
                                _logger.LogInformation($"Error, cache is missing, Cache Status: {tryGetCacheStatus}, location: {location.Name}, http status: {result.StatusCode}");
                            continue;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, $"Failure warming location {location.Name}");
                }
            }

            try
            {
                _valueToLookFor = $"Date: {DateTime.UtcNow.ToString("R")} GUID: {Guid.NewGuid().ToString("D")} By Action-Delay-API {Program.VERSION} {_config.Location}";
                var tryFindData = await _dbContext.GenericJobData.FirstOrDefaultAsync(data => data.JobName == InternalName);
                if (tryFindData == null)
                {
                    tryFindData = new GenericJobData()
                    {
                        JobName = InternalName
                    };
                    _dbContext.GenericJobData.Add(tryFindData);
                }
                tryFindData.LastUpdated = DateTime.UtcNow;
                tryFindData.Value = _valueToLookFor;
                tryFindData.Metadata = "Updated";
                await TrySave(true);
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Failure updating Generic Job Data");
                throw;
            }

            await RunRepeatableAction();
        }

        public override async Task RunRepeatableAction()
        {
            var tryPurgeAPI = await _apiBroker.PurgeSingleURLCache(_config.BunnyCacheJob.URL, _config.BunnyCacheJob.API_Key, CancellationToken.None);
            if (tryPurgeAPI.IsFailed)
            {
                _logger.LogCritical($"Failure purging cache, logs: {tryPurgeAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPurgeAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure purging cache, logs: {tryPurgeAPI.Errors?.FirstOrDefault()?.Message}");
            }
            this.JobData.APIResponseTimeUtc = tryPurgeAPI.Value.ResponseTimeMs;
        }

        public Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                },
                URL = _config.BunnyCacheJob.URL,
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
                ResponseHeaders = new List<string>()
                {
                    "CDN-Cache",
                    "Age"
                },
            };
            newRequest.SetDefaultsFromLocation(location);
            return _queue.HTTP(newRequest, location, token);
        }

        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {
            var tryGetResult = await SendRequest(location, token);
            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return new RunLocationResult("Queue Error", null, -1);
            }
            var getResponse = tryGetResult.Value;

            if (getResponse.StatusCode == HttpStatusCode.OK && getResponse.Body.Equals(_valueToLookFor, StringComparison.OrdinalIgnoreCase))
            {
                // We got the right value!
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees change");
                return new RunLocationResult(true, "Deployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
            else
            {
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees {getResponse.Body} instead of {_valueToLookFor}, and {getResponse.StatusCode} instead of 200 / OK!");
                if (getResponse is { WasSuccess: false, ProxyFailure: true })
                {
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING!!!!! Headers: {String.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                    return new RunLocationResult("Proxy Error", null, getResponse.GetColoId());
                }
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
        }
    }
}
