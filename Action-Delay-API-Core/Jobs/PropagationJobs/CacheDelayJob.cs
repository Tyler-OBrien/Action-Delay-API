using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System.Net;
using Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Responses;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Jobs.PropagationJobs;

namespace Action_Delay_API_Core.Jobs
{
    public class CacheDelayJob : BasePropagationJob
    {
        private readonly ICloudflareAPIBroker _apiBroker;

        private string _valueToLookFor;



        public CacheDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CacheDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            _apiBroker = apiBroker;
        }





        public override string Name => "Single URL Purge Delay Job";

        public override string InternalName => "purge";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "Warm up an endpoint until all locations see cache response headers, update the endpoint's response text, call Purge Single URL API and check until the new text is being served on edge";

        public override int TargetExecutionSecond => 40;

        public override bool Enabled => _config.CacheJob != null && (_config.CacheJob.Enabled.HasValue == false || _config.CacheJob is { Enabled: true });


        public override async Task HandleCompletion()
        {
            _logger.LogInformation($"Completed {Name}..");
        }

        public override async Task PreWarmRunLocation(Location location)
        {
            await SendRequest(location, CancellationToken.None);
        }

        private const int WarmRetries = 5;

        /// <summary>How settled the cached copy has to be before we consider a location warmed.</summary>
        private static readonly TimeSpan WarmMinCacheAge = TimeSpan.FromSeconds(10);

        /// <summary>
        /// Waited out between attempts when the edge holds the object but it is younger than
        /// <see cref="WarmMinCacheAge"/> - back-to-back requests could never age it past the bar.
        /// </summary>
        private static readonly TimeSpan WarmRetryDelay = TimeSpan.FromSeconds(3);

        private static readonly TimeSpan WarmTimeout = TimeSpan.FromSeconds(45);

        /// <summary>
        /// Fetches the endpoint from <paramref name="location"/> until the edge reports a settled
        /// cached copy, so that the purge which follows has something to purge. Never throws: a
        /// location we cannot warm is logged and left behind rather than holding up the purge.
        /// </summary>
        private async Task WarmLocation(Location location, CancellationToken token)
        {
            try
            {
                for (int i = 0; i < WarmRetries; i++)
                {
                    token.ThrowIfCancellationRequested();

                    var tryGetResult = await SendRequest(location, token);
                    if (tryGetResult.IsFailed)
                    {
                        _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, retrying..");
                        continue;
                    }

                    string tryGetCacheStatus = "";

                    var result = tryGetResult.Value;

                    var tryGetCacheStatusHeader = result.Headers.FirstOrDefault(header => header.Key.Equals(
                        String.IsNullOrEmpty(_config.CacheJob.ProxyURL) == false
                            ? "Proxy-CF-Cache-Status"
                            : "CF-Cache-Status", StringComparison.OrdinalIgnoreCase));

                    if (String.IsNullOrWhiteSpace(tryGetCacheStatusHeader.Key) == false)
                    {
                        tryGetCacheStatus = tryGetCacheStatusHeader.Value;
                    }

                    var tryGetCacheAgeHeader = result.Headers.FirstOrDefault(header => header.Key.Equals(
                        String.IsNullOrEmpty(_config.CacheJob.ProxyURL) == false
                            ? "Proxy-Age"
                            : "Age", StringComparison.OrdinalIgnoreCase));

                    if (String.IsNullOrWhiteSpace(tryGetCacheAgeHeader.Key) == false)
                    {
                        var cacheAge = tryGetCacheAgeHeader.Value;
                        if (String.IsNullOrEmpty(cacheAge) || int.TryParse(cacheAge, out var cacheAgeInt) == false || cacheAgeInt < WarmMinCacheAge.TotalSeconds)
                        {
                            if (RateLimitedEventLogger.ShouldLog())
                                _logger.LogInformation($"Error, cache is too new or missing, cache value {cacheAge}, Cache Status: {tryGetCacheStatus}, location: {location.Name}");
                            // Retrying immediately could never age the copy past the bar.
                            await Task.Delay(WarmRetryDelay, token);
                            continue;
                        }
                        else
                        {
                            if (RateLimitedEventLogger.ShouldLog())
                                _logger.LogInformation($"{location.Name} pre-warmed, cache age: {cacheAge}, Cache Status: {tryGetCacheStatus}");
                            return;
                        }
                    }
                    else
                    {
                        if (RateLimitedEventLogger.ShouldLog())
                            _logger.LogInformation($"Error, cache is missing, Cache Status: {tryGetCacheStatus}, location: {location.Name}, http status: {result.StatusCode}, headers: {DescribeHeaders(result)}");
                        continue;
                    }
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation($"Gave up warming location {location.Name} after {WarmTimeout.TotalSeconds} seconds, purging anyway");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Failure warming location {location.Name}");
            }
        }

        private static string DescribeHeaders(SerializableHttpResponse response) =>
            response.Headers == null || response.Headers.Count == 0
                ? "none"
                : String.Join(" | ", response.Headers.Select(header => $"{header.Key}: {header.Value}"));

        public override async Task RunAction()
        {
            // Bounded: an unreachable location can burn a full timeout plus a retry delay on every
            // attempt, and the purge has to fire whether or not every edge came up warm.
            using (var warmCancellation = new CancellationTokenSource(WarmTimeout))
            {
                await Task.WhenAll(RunLocations.Select(location => WarmLocation(location, warmCancellation.Token)));
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
            var newUpdateRequest = new PurgeCacheByURLRequest()
            {
                Files = new[]
                {
                    _config.CacheJob.URL
                }
            };
            var tryPutAPI = await _apiBroker.PurgeSingleURLCache(_config.CacheJob.ZoneId, newUpdateRequest, _config.CacheJob.API_Key, CancellationToken.None);
            if (tryPutAPI.IsFailed)
            {
                _logger.LogCritical($"Failure purging cache, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                if (tryPutAPI.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure purging cache, logs: {tryPutAPI.Errors?.FirstOrDefault()?.Message}");
                return;
            }
            this.JobData.APIResponseTimeUtc = tryPutAPI.Value.ResponseTimeMs;
        }

        public  Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API {Name} {Program.VERSION}"},
                }, 
                URL = String.IsNullOrEmpty(_config.CacheJob.ProxyURL) ? _config.CacheJob.URL : $"{_config.CacheJob.ProxyURL}/{location.Name}?url={_config.CacheJob.URL}", // very specific proxy format, see Action-Delay-API-Durable-Object-Proxy for implementation
                TimeoutMs = 10_000,
                EnableConnectionReuse = true,
            };

            if (String.IsNullOrEmpty(_config.CacheJob.ProxyURL))
            {
                newRequest.ResponseHeaders = new List<string>()
                {
                    "CF-Cache-Status",
                    "Age"
                };
            }
            else
            {
                newRequest.ResponseHeaders = new List<string>()
                {
                    "Proxy-CF-Cache-Status",
                    "Proxy-Age"
                };
            }
            newRequest.SetDefaultsFromLocation(location);

            if (String.IsNullOrEmpty(_config.CacheJob.ProxyURL) == false &&
                String.IsNullOrEmpty(_config.CacheJob.ProxyAPIKey) == false)
            {
                newRequest.Headers.Add("APIKEY", _config.CacheJob.ProxyAPIKey);
            }
            return  _queue.HTTP(newRequest, location, token);
        }



        public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
        {

            var tryGetResult = await SendRequest(location, token);
            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting location..");
                return RunLocationResult.TransportFailure(tryGetResult.Errors, null, -1);
            }
            var getResponse = tryGetResult.Value;



            //_logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

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
                if (getResponse is { WasSuccess: false } && getResponse.IsProbeAbort())
                {
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING!!!!! Headers: {String.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                    return RunLocationResult.FromProbe(getResponse, null, getResponse.GetColoId());
                }
                return new RunLocationResult(false, "Undeployed", getResponse.ResponseUTC, getResponse.ResponseTimeMs, getResponse.GetColoId());
            }
        }
    }
}
