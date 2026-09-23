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
using System.Diagnostics;
using System.Globalization;
using System.Net;

namespace Action_Delay_API_Core.Jobs.PropagationJobs.Bunny
{
    public class BunnyCacheDelayJob : BasePropagationJob
    {
        private readonly IBunnyAPIBroker _apiBroker;
        private readonly IDbContextFactory<LocalActionDelayDatabaseContext> _localContextFactory;

        private string _valueToLookFor;

        public BunnyCacheDelayJob(IBunnyAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<BunnyCacheDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider, IDbContextFactory<LocalActionDelayDatabaseContext> localContextFactory) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            _apiBroker = apiBroker;
            _localContextFactory = localContextFactory;
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

                    var result = tryGetResult.Value;

                    var tryGetCacheStatusHeader = (result.Headers ?? EmptyHeaders).FirstOrDefault(header => header.Key.Equals(
                        "CDN-Cache", StringComparison.OrdinalIgnoreCase));
                    var cacheStatus = String.IsNullOrWhiteSpace(tryGetCacheStatusHeader.Key) == false
                        ? tryGetCacheStatusHeader.Value
                        : "";

                    if (TryGetCacheAgeSeconds(result, out var cacheAgeSeconds))
                    {
                        if (cacheAgeSeconds >= WarmMinCacheAge.TotalSeconds)
                        {
                            if (RateLimitedEventLogger.ShouldLog())
                                _logger.LogInformation($"{location.Name} pre-warmed, cache age: {cacheAgeSeconds:F0}, Cache Status: {cacheStatus}");
                            return;
                        }

                        if (RateLimitedEventLogger.ShouldLog())
                            _logger.LogInformation($"Error, cache is too new, cache age: {cacheAgeSeconds:F0}, Cache Status: {cacheStatus}, location: {location.Name}");
                        await Task.Delay(WarmRetryDelay, token);
                        continue;
                    }

                    if (cacheStatus.Equals("HIT", StringComparison.OrdinalIgnoreCase))
                    {
                        // Cached, but with no readable age we cannot tell how settled it is, so treat
                        // it the same as a too-new copy and give it time.
                        if (RateLimitedEventLogger.ShouldLog())
                            _logger.LogInformation($"Cache hit without a readable age, location: {location.Name}, headers: {DescribeHeaders(result)}");
                        await Task.Delay(WarmRetryDelay, token);
                        continue;
                    }

                    if (RateLimitedEventLogger.ShouldLog())
                        _logger.LogInformation($"Error, cache is missing, Cache Status: {cacheStatus}, location: {location.Name}, http status: {result.StatusCode}, headers: {DescribeHeaders(result)}");
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

        private static readonly Dictionary<string, string> EmptyHeaders = new Dictionary<string, string>();

        private static string DescribeHeaders(SerializableHttpResponse response) =>
            response.Headers == null || response.Headers.Count == 0
                ? "none"
                : String.Join(" | ", response.Headers.Select(header => $"{header.Key}: {header.Value}"));

        /// <summary>
        /// How long the edge has held this object, in seconds.
        /// </summary>
        /// <remarks>
        /// Bunny sends no <c>Age</c> header, so <c>CDN-CacheDat</c> - the absolute time the object
        /// entered Bunny's cache, e.g. <c>07/28/2026 01:09:24</c> - is the only source. Any Age that
        /// does turn up on these responses came from the origin and is replayed frozen, which makes
        /// it worthless as a measure of how long this edge has held the object; it is deliberately
        /// not consulted.
        /// </remarks>
        public static bool TryGetCacheAgeSeconds(SerializableHttpResponse response, out double ageSeconds)
        {
            ageSeconds = 0;
            var headers = response.Headers;
            if (headers == null)
                return false;

            var cachedAtHeader = headers.FirstOrDefault(header => header.Key.Equals("CDN-CacheDat", StringComparison.OrdinalIgnoreCase));
            if (String.IsNullOrWhiteSpace(cachedAtHeader.Value))
                return false;

            const DateTimeStyles utcStyles = DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal;
            if (DateTime.TryParseExact(cachedAtHeader.Value, "MM/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture, utcStyles, out var cachedAtUtc) == false &&
                DateTime.TryParse(cachedAtHeader.Value, CultureInfo.InvariantCulture, utcStyles, out cachedAtUtc) == false)
                return false;

            // Skew between the edge clock and ours can push this negative; clamp so it reads as
            // "too new" instead of as an implausibly old entry.
            ageSeconds = Math.Max(0, ((response.ResponseUTC ?? DateTime.UtcNow) - cachedAtUtc).TotalSeconds);
            return true;
        }

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

            await TryWriteLocalMarker();

            await RunRepeatableAction();
        }

        /// <summary>
        /// Publishes the marker into the database this node's origin API reads, if that is a
        /// different one from where we just wrote it.
        /// </summary>
        /// <remarks>
        /// The sync job only copies remote to local, on a 10 second poll, so purging before that
        /// lands just re-caches the previous marker at every edge - which the job then measures as
        /// Bunny propagation delay. Writing it here makes the new marker servable the moment the
        /// purge fires, and the sync will not undo it because the remote row is never newer.
        /// </remarks>
        private async Task TryWriteLocalMarker()
        {
            if (String.IsNullOrWhiteSpace(_config.PostgresConnectionStringLocal))
                return;

            try
            {
                var stopwatch = Stopwatch.StartNew();
                await using var localContext = await _localContextFactory.CreateDbContextAsync();
                var tryFindData = await localContext.GenericJobData.FirstOrDefaultAsync(data => data.JobName == InternalName);
                if (tryFindData == null)
                {
                    tryFindData = new GenericJobData()
                    {
                        JobName = InternalName
                    };
                    localContext.GenericJobData.Add(tryFindData);
                }
                tryFindData.LastUpdated = DateTime.UtcNow;
                tryFindData.Value = _valueToLookFor;
                tryFindData.Metadata = "Updated";
                await localContext.SaveChangesAsync();
                _logger.LogInformation($"Local marker written to origin database in {stopwatch.ElapsedMilliseconds}ms, purging");
            }
            catch (Exception ex)
            {
                // Fail-soft: without this the purge still happens, we just measure the sync delay
                // along with it, exactly as before.
                _logger.LogCritical(ex, "Failure writing local marker, purging anyway");
            }
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
                    // Bunny sends no standard Age header, it reports the moment the object entered
                    // cache instead.
                    "CDN-CacheDat"
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
                return RunLocationResult.TransportFailure(tryGetResult.Errors, null, -1);
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
                // CDN-CacheDat says when this edge's copy was created, which is what separates "the
                // purge never reached this edge" (timestamp predates the purge) from "our own probe
                // re-populated it from a stale upstream microseconds after the purge" (timestamp is
                // the purge instant, yet the body is still the previous marker).
                if (RateLimitedEventLogger.ShouldLog())
                    _logger.LogInformation($"{location.Name}:{getResponse.GetColoId()} sees {getResponse.Body} instead of {_valueToLookFor}, and {getResponse.StatusCode} instead of 200 / OK! Cache: {DescribeHeaders(getResponse)}");
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
