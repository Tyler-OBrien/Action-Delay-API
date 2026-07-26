using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Local;

namespace Action_Delay_API_Core.Services.Locations
{
    /// <summary>
    /// Polls the machine-local health check service for the roster, falling back through last-good,
    /// an on-disk cache and finally the configured roster. Never throws at its callers - a job asking
    /// for locations always gets a usable answer.
    /// </summary>
    public class LocationProviderService : BackgroundService, ILocationProvider
    {
        public const string HttpClientName = "LocationRoster";

        /// <summary>How often to repeat the "still degraded" warning while serving a fallback.</summary>
        private static readonly TimeSpan DegradedReminder = TimeSpan.FromMinutes(5);

        /// <summary>
        /// Waits between startup attempts. Escalating rather than flat: the common case is the health
        /// check service still finishing its first probe cycle, which resolves in seconds.
        /// </summary>
        private static readonly TimeSpan[] StartupBackoff =
        {
            TimeSpan.Zero,
            TimeSpan.FromSeconds(1),
            TimeSpan.FromSeconds(2),
            TimeSpan.FromSeconds(3),
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(9)
        };

        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            AllowTrailingCommas = true,
            NumberHandling = JsonNumberHandling.AllowReadingFromString,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        private readonly LocationRosterConfig _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<LocationProviderService> _logger;
        private readonly LocalConfig _localConfig;
        private readonly string _requestUri;

        private DateTime _lastStaleComplaintUtc = DateTime.MinValue;
        private DateTime _lastDegradedComplaintUtc = DateTime.MinValue;
        private DateTime _degradedSinceUtc = DateTime.MinValue;
        private volatile LocationRosterSnapshot _snapshot;

        public LocationProviderService(LocalConfig localConfig, IHttpClientFactory httpClientFactory,
            ILogger<LocationProviderService> logger)
        {
            _localConfig = localConfig;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _config = localConfig.LocationRoster ?? new LocationRosterConfig();

            // The producer withholds each location's HTTP transport endpoint unless asked, since
            // only a consumer off NATS can act on it. Built once - neither input changes at runtime.
            _requestUri = localConfig.UsingNATS
                ? _config.Endpoint
                : _config.Endpoint + (_config.Endpoint.Contains('?') ? "&" : "?") + "include=url";

            _snapshot = ConfiguredSnapshot();
        }

        public IReadOnlyList<Location> GetEnabledLocations() => _snapshot.Enabled;

        public IReadOnlyList<Location> GetAllLocations() => _snapshot.All;

        public LocationRosterSnapshot GetSnapshot() => _snapshot;

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            // Required whether or not the roster is on: with it off this is the only source, and with
            // it on this is what we fall back to. A Core with neither cannot do anything, and that is
            // a config error worth failing the boot for rather than degrading into silently.
            if (_localConfig.Locations is null || _localConfig.Locations.Count == 0)
                throw new InvalidOperationException(
                    "Base.Locations is empty. Core needs a configured roster to fall back to even when " +
                    "LocationRoster.UseHealthCheckConfig is true.");

            if (_config.UseHealthCheckConfig)
            {
                _logger.LogInformation(
                    $"Location roster enabled, polling {_requestUri} every {Math.Max(5, _config.PollSeconds)}s " +
                    $"({_localConfig.Locations.Count} configured location(s) as the fallback)");

                await FirstFetch(cancellationToken);
            }
            else
            {
                _logger.LogInformation(
                    $"Location roster disabled, using {_snapshot.All.Count} configured location(s)");
            }

            await base.StartAsync(cancellationToken);
        }

        /// <summary>
        /// Tries hard before giving up, because the usual reason the roster is missing at boot is that
        /// the health check service is still warming up beside us. Never fatal: on exhaustion we serve
        /// the configured roster and the background poll keeps trying.
        /// </summary>
        private async Task FirstFetch(CancellationToken cancellationToken)
        {
            using var budget = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            budget.CancelAfter(TimeSpan.FromSeconds(Math.Max(1, _config.StartupTimeoutSeconds)));

            var attempts = 0;
            foreach (var wait in StartupBackoff)
            {
                if (budget.IsCancellationRequested)
                    break;

                if (wait > TimeSpan.Zero)
                {
                    try
                    {
                        await Task.Delay(wait, budget.Token);
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }
                }

                attempts++;
                if (await RefreshOnceAsync(budget.Token))
                {
                    var generated = _snapshot.GeneratedAtUtc is { } at
                        ? $"generated {(DateTime.UtcNow - at).TotalSeconds:F0}s ago, "
                        : string.Empty;
                    _logger.LogInformation(
                        $"Location roster ready: {_snapshot.Enabled.Count}/{_snapshot.All.Count} enabled " +
                        $"from {_snapshot.Source} ({generated}attempt {attempts})");
                    return;
                }
            }

            // Cancellation from the host, not from our own budget - Core is shutting down mid-boot.
            if (cancellationToken.IsCancellationRequested)
                return;

            _logger.LogWarning(
                $"Location roster unavailable after {attempts} attempt(s) in {_config.StartupTimeoutSeconds}s; " +
                $"serving {_snapshot.All.Count} location(s) from {_snapshot.Source} and continuing to retry in the background");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (_config.UseHealthCheckConfig == false)
                return;

            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(Math.Max(5, _config.PollSeconds)));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await RefreshOnceAsync(stoppingToken);
                WarnIfDegraded();
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                $"Location roster stopping; last served {_snapshot.Enabled.Count}/{_snapshot.All.Count} " +
                $"enabled from {_snapshot.Source}");

            return base.StopAsync(cancellationToken);
        }

        /// <summary>
        /// Fetches once, falling back rather than throwing. Returns false when the fallback chain ran.
        /// </summary>
        public async Task<bool> RefreshOnceAsync(CancellationToken token)
        {
            try
            {
                return await Refresh(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to refresh the location roster, falling back");
                FallBack();
                return false;
            }
        }

        private async Task<bool> Refresh(CancellationToken token)
        {
            var client = _httpClientFactory.CreateClient(HttpClientName);
            using var response = await client.GetAsync(_requestUri, token);
            response.EnsureSuccessStatusCode();

            var payload = await response.Content.ReadFromJsonAsync<RosterPayload>(SerializerOptions, token);
            if (payload?.Locations is null || payload.Locations.Count == 0)
            {
                _logger.LogError("Location roster response contained no locations, falling back");
                FallBack();
                return false;
            }

            var age = DateTime.UtcNow - payload.GeneratedAtUtc;
            if (age > TimeSpan.FromSeconds(_config.HardMaxRosterAgeSeconds))
            {
                // Reject it rather than reverting: whatever we already have was measured, and a
                // producer stuck on old data is not a reason to throw that away. A Core that has
                // never had a good roster is already serving Configuration, so it stays there.
                _logger.LogError(
                    $"Rejecting location roster: {age.TotalMinutes:F0}m old exceeds the hard max of " +
                    $"{_config.HardMaxRosterAgeSeconds}s; keeping {_snapshot.All.Count} location(s) from {_snapshot.Source}");
                return false;
            }

            if (Accept(payload.Locations) == false)
                return false;

            var stale = age > TimeSpan.FromSeconds(_config.MaxRosterAgeSeconds);
            if (stale && DateTime.UtcNow - _lastStaleComplaintUtc > TimeSpan.FromMinutes(5))
            {
                _lastStaleComplaintUtc = DateTime.UtcNow;
                _logger.LogError($"Location roster is stale ({age.TotalSeconds:F0}s old) but still being served");
            }

            var merged = LocationRosterSnapshot.Merge(_snapshot.All, payload.Locations);
            Publish(LocationRosterSnapshot.Create(merged, RosterSource.RosterService, payload.GeneratedAtUtc, stale));

            _logger.LogDebug(
                $"Location roster refreshed: {_snapshot.Enabled.Count}/{_snapshot.All.Count} enabled, " +
                $"{age.TotalSeconds:F0}s old");

            WriteDiskCache(payload);
            return true;
        }

        /// <summary>
        /// The one guard against a buggy producer. Its own break-open rail cannot catch its own bugs,
        /// so Core refuses a roster that leaves it with too little of the fleet.
        /// </summary>
        private bool Accept(List<Location> locations, string source = "location roster")
        {
            if (_localConfig.Min_Locations <= 0)
                return true;

            var enabled = locations.Count(location => location.Disabled == false);
            if (enabled >= _localConfig.Min_Locations)
                return true;

            _logger.LogError(
                $"Rejecting {source}: {enabled} enabled location(s) is below Min_Locations={_localConfig.Min_Locations}; keeping the previous roster");
            return false;
        }

        /// <summary>
        /// Once a live fetch has succeeded this parks on last-good and stays there for the life of the
        /// process - deliberately. A roster we actually measured, however old, describes the fleet
        /// better than a static list that believes every location is up. The disk cache and the
        /// configured roster are therefore only reached by a process that has never had a good fetch.
        /// </summary>
        private void FallBack()
        {
            if (_snapshot.Source is RosterSource.RosterService or RosterSource.MemoryCache)
            {
                Publish(LocationRosterSnapshot.Create(_snapshot.All, RosterSource.MemoryCache,
                    _snapshot.GeneratedAtUtc, _snapshot.IsStale));
                return;
            }

            var cached = ReadDiskCache();
            if (cached is not null && Accept(cached.Locations!, "cached location roster"))
            {
                Publish(LocationRosterSnapshot.Create(cached.Locations!, RosterSource.DiskCache,
                    cached.GeneratedAtUtc));
                return;
            }

            Publish(ConfiguredSnapshot());
        }

        private LocationRosterSnapshot ConfiguredSnapshot() => LocationRosterSnapshot.Create(
            _localConfig.Locations ?? new List<Location>(), RosterSource.Configuration);

        /// <summary>
        /// Says something when the roster changes and nothing when it does not. Compares the enabled
        /// set rather than its size, since a same-size swap - one location out, another in - is a real
        /// change an operator needs to see.
        /// </summary>
        private void Publish(LocationRosterSnapshot snapshot)
        {
            var previous = _snapshot;
            _snapshot = snapshot;

            // Only a return from a fallback is a recovery. The first successful fetch of the
            // process is just acquisition, and the startup "ready" line already covers it.
            var recovered = _degradedSinceUtc != DateTime.MinValue &&
                            previous.Source != RosterSource.RosterService &&
                            snapshot.Source == RosterSource.RosterService;

            if (recovered)
            {
                _degradedSinceUtc = DateTime.MinValue;
                _lastDegradedComplaintUtc = DateTime.MinValue;
                _logger.LogInformation(
                    $"Location roster recovered: {snapshot.Enabled.Count}/{snapshot.All.Count} enabled from {snapshot.Source}");
                return;
            }

            if (snapshot.Source != RosterSource.RosterService && _degradedSinceUtc == DateTime.MinValue)
                _degradedSinceUtc = DateTime.UtcNow;

            if (previous.Source != snapshot.Source || EnabledSetChanged(previous, snapshot))
                _logger.LogInformation(
                    $"Location roster now {snapshot.Enabled.Count}/{snapshot.All.Count} enabled from {snapshot.Source}");
        }

        private static bool EnabledSetChanged(LocationRosterSnapshot previous, LocationRosterSnapshot current)
        {
            if (previous.Enabled.Count != current.Enabled.Count)
                return true;

            var before = previous.Enabled.Select(location => location.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
            return current.Enabled.Any(location => before.Contains(location.Name) == false);
        }

        /// <summary>
        /// Repeats while we are serving anything other than a live roster. Without this a long outage
        /// produces one error line at the moment it starts and then silence for as long as it lasts.
        /// </summary>
        private void WarnIfDegraded()
        {
            if (_snapshot.Source == RosterSource.RosterService)
                return;

            var now = DateTime.UtcNow;
            if (now - _lastDegradedComplaintUtc < DegradedReminder)
                return;

            _lastDegradedComplaintUtc = now;
            var forMinutes = _degradedSinceUtc == DateTime.MinValue ? 0 : (now - _degradedSinceUtc).TotalMinutes;
            _logger.LogWarning(
                $"Location roster degraded: serving {_snapshot.All.Count} location(s) from {_snapshot.Source} " +
                $"for {forMinutes:F0}m");
        }

        private RosterPayload? ReadDiskCache()
        {
            try
            {
                var path = _config.ResolvedCachePath;
                if (File.Exists(path) == false)
                    return null;

                var cached = JsonSerializer.Deserialize<RosterPayload>(File.ReadAllText(path), SerializerOptions);
                return cached?.Locations is { Count: > 0 } ? cached : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to read the cached location roster");
                return null;
            }
        }

        private void WriteDiskCache(RosterPayload payload)
        {
            try
            {
                var path = _config.ResolvedCachePath;
                var directory = Path.GetDirectoryName(path);
                if (string.IsNullOrWhiteSpace(directory) == false)
                    Directory.CreateDirectory(directory);

                var temporary = path + ".tmp";
                File.WriteAllText(temporary, JsonSerializer.Serialize(payload, SerializerOptions));
                File.Move(temporary, path, overwrite: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to cache the location roster to disk");
            }
        }

        /// <summary>Only the fields Core cares about; the producer's diagnostics are ignored.</summary>
        public class RosterPayload
        {
            public DateTime GeneratedAtUtc { get; set; }

            public string? Status { get; set; }

            public List<Location>? Locations { get; set; }
        }
    }
}
