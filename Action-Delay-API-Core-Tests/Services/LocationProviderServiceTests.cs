using System.Net;
using System.Text;
using System.Text.Json;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Services.Locations;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace Action_Delay_API_Core_Tests.Services;

public class LocationProviderServiceTests : IDisposable
{
    private readonly string _cacheDirectory =
        Path.Combine(Path.GetTempPath(), $"roster-cache-{Guid.NewGuid():N}");

    public void Dispose()
    {
        if (Directory.Exists(_cacheDirectory))
            Directory.Delete(_cacheDirectory, true);
    }

    private string CachePath => Path.Combine(_cacheDirectory, "location-roster.json");

    private LocalConfig Config(bool enabled = true, int minLocations = 0, params Location[] locations) => new()
    {
        Min_Locations = minLocations,
        Locations = locations.Length > 0
            ? locations.ToList()
            : new List<Location> { new() { Name = "CFG1" }, new() { Name = "CFG2" } },
        LocationRoster = new LocationRosterConfig
        {
            UseHealthCheckConfig = enabled,
            Endpoint = "http://127.0.0.1:5199/locations",
            CachePath = CachePath
        }
    };

    private static string Payload(DateTime generatedAtUtc, params Location[] locations) =>
        JsonSerializer.Serialize(new LocationProviderService.RosterPayload
        {
            GeneratedAtUtc = generatedAtUtc,
            Status = "Healthy",
            Locations = locations.ToList()
        });

    private static LocationProviderService Build(LocalConfig config, Func<HttpResponseMessage> responder)
    {
        var handler = new StubHandler(responder);
        var factory = new Mock<IHttpClientFactory>();
        factory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(() => new HttpClient(handler));

        return new LocationProviderService(config, factory.Object, NullLogger<LocationProviderService>.Instance);
    }

    private static HttpResponseMessage Ok(string body) => new(HttpStatusCode.OK)
    {
        Content = new StringContent(body, Encoding.UTF8, "application/json")
    };

    [Fact]
    public void Disabled_ServesTheConfiguredRosterExactly()
    {
        var provider = Build(Config(enabled: false), () => Ok("{}"));

        Assert.Equal(new[] { "CFG1", "CFG2" }, provider.GetEnabledLocations().Select(l => l.Name));
        Assert.Equal(RosterSource.Configuration, provider.GetSnapshot().Source);
    }

    [Fact]
    public void ConfiguredDisabledLocations_AreExcludedFromEnabled_ButKeptInAll()
    {
        var config = Config(true, 0, new Location { Name = "A" }, new Location { Name = "B", Disabled = true });
        var provider = Build(config, () => Ok("{}"));

        Assert.Equal(new[] { "A" }, provider.GetEnabledLocations().Select(l => l.Name));
        Assert.Equal(2, provider.GetAllLocations().Count);
    }

    [Fact]
    public async Task HappyPath_ServesTheRosterServiceResponse()
    {
        var provider = Build(Config(), () => Ok(Payload(DateTime.UtcNow,
            new Location { Name = "LAX", NetType = NetType.IPv6 },
            new Location { Name = "CDG", Disabled = true })));

        Assert.True(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(RosterSource.RosterService, provider.GetSnapshot().Source);
        Assert.Equal(new[] { "LAX" }, provider.GetEnabledLocations().Select(l => l.Name));
        Assert.Equal(NetType.IPv6, provider.GetEnabledLocations()[0].NetType);
        Assert.Equal(2, provider.GetAllLocations().Count);
    }

    [Fact]
    public async Task ServerError_FallsBackToTheLastGoodRoster()
    {
        var fail = false;
        var provider = Build(Config(), () => fail
            ? new HttpResponseMessage(HttpStatusCode.InternalServerError)
            : Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" })));

        await provider.RefreshOnceAsync(CancellationToken.None);
        fail = true;
        Assert.False(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(RosterSource.MemoryCache, provider.GetSnapshot().Source);
        Assert.Equal(new[] { "LAX" }, provider.GetEnabledLocations().Select(l => l.Name));
    }

    [Fact]
    public async Task ConnectionRefusedOnColdStart_FallsBackToTheDiskCache()
    {
        Directory.CreateDirectory(_cacheDirectory);
        File.WriteAllText(CachePath, Payload(DateTime.UtcNow, new Location { Name = "FROMDISK" }));

        var provider = Build(Config(), () => throw new HttpRequestException("connection refused"));

        Assert.False(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(RosterSource.DiskCache, provider.GetSnapshot().Source);
        Assert.Equal(new[] { "FROMDISK" }, provider.GetEnabledLocations().Select(l => l.Name));
    }

    [Fact]
    public async Task ConnectionRefusedWithNoDiskCache_FallsBackToConfiguration()
    {
        var provider = Build(Config(), () => throw new HttpRequestException("connection refused"));

        Assert.False(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(RosterSource.Configuration, provider.GetSnapshot().Source);
        Assert.Equal(new[] { "CFG1", "CFG2" }, provider.GetEnabledLocations().Select(l => l.Name));
    }

    [Fact]
    public async Task SuccessfulFetch_WritesTheDiskCacheForTheNextColdStart()
    {
        var provider = Build(Config(), () => Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" })));

        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.True(File.Exists(CachePath));
        Assert.Contains("LAX", File.ReadAllText(CachePath));
    }

    [Fact]
    public async Task RosterOlderThanTheHardMax_IsAbandonedForConfiguration()
    {
        // A wedged producer serving hours-old data is worse than the static config.
        var provider = Build(Config(), () => Ok(Payload(DateTime.UtcNow.AddHours(-3),
            new Location { Name = "ANCIENT" })));

        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.Equal(RosterSource.Configuration, provider.GetSnapshot().Source);
        Assert.DoesNotContain(provider.GetAllLocations(), l => l.Name == "ANCIENT");
    }

    [Fact]
    public async Task StaleButUsableRoster_IsStillServedAndFlagged()
    {
        var provider = Build(Config(), () => Ok(Payload(DateTime.UtcNow.AddSeconds(-400),
            new Location { Name = "LAX" })));

        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.Equal(RosterSource.RosterService, provider.GetSnapshot().Source);
        Assert.True(provider.GetSnapshot().IsStale);
    }

    [Fact]
    public async Task RosterBelowMinLocations_IsRejectedAndThePreviousRosterKept()
    {
        // The one guard against a producer bug: its own break-open rail cannot catch its own bugs.
        var shrink = false;
        var provider = Build(Config(true, minLocations: 2), () => shrink
            ? Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" }))
            : Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" }, new Location { Name = "CDG" })));

        await provider.RefreshOnceAsync(CancellationToken.None);
        Assert.Equal(2, provider.GetEnabledLocations().Count);

        shrink = true;
        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.Equal(2, provider.GetEnabledLocations().Count);
    }

    [Fact]
    public async Task EmptyRoster_IsNeverServed()
    {
        var provider = Build(Config(), () => Ok(Payload(DateTime.UtcNow)));

        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.Equal(RosterSource.Configuration, provider.GetSnapshot().Source);
        Assert.NotEmpty(provider.GetEnabledLocations());
    }

    [Fact]
    public async Task UnknownFieldsInTheResponse_AreIgnored()
    {
        // The producer ships a diagnostics object per location that Core has no model for.
        const string body = """
        {
          "GeneratedAtUtc": "2999-01-01T00:00:00Z",
          "Status": "Degraded",
          "SomethingNew": 42,
          "Locations": [
            { "Name": "LAX", "Disabled": false, "NetType": 1,
              "Diagnostics": { "Policy": "Auto", "IPv4": { "Up": true } } }
          ]
        }
        """;
        var provider = Build(Config(), () => Ok(body));

        Assert.True(await provider.RefreshOnceAsync(CancellationToken.None));
        Assert.Equal(NetType.IPv4, provider.GetEnabledLocations().Single().NetType);
    }

    [Fact]
    public async Task LeanProducerOutput_DeserializesStraightIntoLocation()
    {
        // The shape actually served at /locations, which this service now points at. Each entry
        // is the same as a Base.Locations entry in appsettings.json, so it binds into
        // List<Location> with no mapping. Pins the three things that would silently break it:
        // numeric NetType, Disabled present on every entry, and GeneratedAtUtc carrying a Z.
        const string body = """
        {
          "GeneratedAtUtc": "2026-07-25T21:00:55.088539Z",
          "Status": "Degraded",
          "Locations": [
            { "Name": "PDX", "Disabled": false, "Compression": true },
            { "Name": "HKG", "Disabled": false, "NetType": 1 },
            { "Name": "SIN", "Disabled": false, "NATSName": "SIN-2", "DisplayName": "Singapore", "DNSResolveOverride": "1.2.3.4" },
            { "Name": "LIM", "Disabled": true }
          ]
        }
        """;

        var config = Config();
        config.LocationRoster!.HardMaxRosterAgeSeconds = int.MaxValue;
        var provider = Build(config, () => Ok(body));

        Assert.True(await provider.RefreshOnceAsync(CancellationToken.None));
        Assert.Equal(RosterSource.RosterService, provider.GetSnapshot().Source);

        Assert.Equal(new[] { "PDX", "HKG", "SIN" }, provider.GetEnabledLocations().Select(l => l.Name));
        Assert.Equal(4, provider.GetAllLocations().Count);

        var all = provider.GetAllLocations();
        Assert.True(all[0].Compression);
        Assert.Equal(NetType.IPv4, all[1].NetType);
        Assert.Equal("SIN-2", all[2].NATSName);
        Assert.Equal("Singapore", all[2].DisplayName);
        Assert.Equal("1.2.3.4", all[2].DNSResolveOverride);

        // ColoDataUpdateService keys its disable pass off exactly this entry being present.
        Assert.True(all[3].Disabled);
        Assert.Equal("LIM", all[3].Name);
    }

    [Fact]
    public async Task RealProducerOutput_DeserializesStraightIntoLocation()
    {
        // Captured verbatim from a live /internal/locations. Kept because that endpoint still
        // exists for debugging, and because it proves the extra members stay ignored.
        // Pins the wire contract: PascalCase, numeric NetType, omitted nulls, ignored Diagnostics.
        const string body = """
        {
          "GeneratedAtUtc": "2026-07-25T21:00:55.088539Z",
          "Producer": "PDX",
          "CycleIntervalSeconds": 30,
          "Status": "Healthy",
          "TotalConfigured": 1,
          "EnabledCount": 1,
          "Locations": [
            {
              "Name": "LIS",
              "Disabled": false,
              "Compression": true,
              "Diagnostics": {
                "Policy": "Auto",
                "SinceUtc": "2026-07-25T21:00:55.088539Z",
                "IPv4": { "Up": true, "ConsecutiveFailures": 0, "WonBy": "tyler" },
                "IPv6": { "Up": true, "ConsecutiveFailures": 0, "WonBy": "tyler" }
              }
            }
          ]
        }
        """;

        var config = Config();
        config.LocationRoster!.HardMaxRosterAgeSeconds = int.MaxValue;
        var provider = Build(config, () => Ok(body));

        Assert.True(await provider.RefreshOnceAsync(CancellationToken.None));

        var location = Assert.Single(provider.GetEnabledLocations());
        Assert.Equal("LIS", location.Name);
        Assert.False(location.Disabled);
        Assert.True(location.Compression);
        Assert.Null(location.NetType);
    }

    [Fact]
    public async Task EmptyConfiguredLocations_FailsStartup()
    {
        // The configured roster is the backstop whether or not the health check service is used,
        // so a Core with none of it cannot run. Surface that at boot, not as a silent degradation.
        foreach (var useHealthChecks in new[] { true, false })
        {
            var config = Config();
            config.Locations = new List<Location>();
            config.LocationRoster!.UseHealthCheckConfig = useHealthChecks;

            var provider = Build(config, () => Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" })));

            var error = await Assert.ThrowsAsync<InvalidOperationException>(
                () => provider.StartAsync(CancellationToken.None));
            Assert.Contains("Base.Locations is empty", error.Message);
        }
    }

    [Fact]
    public async Task StartupRetriesBeforeGivingUp_ThenServesConfigured()
    {
        // Core and the health check service usually start together, so one failed attempt is a
        // normal boot race rather than an outage.
        var attempts = 0;
        var config = Config();
        config.LocationRoster!.StartupTimeoutSeconds = 5;

        var provider = Build(config, () =>
        {
            attempts++;
            throw new HttpRequestException("connection refused");
        });

        await provider.StartAsync(CancellationToken.None);
        await provider.StopAsync(CancellationToken.None);

        Assert.True(attempts > 1, $"expected more than one startup attempt, got {attempts}");
        Assert.Equal(RosterSource.Configuration, provider.GetSnapshot().Source);
        Assert.Equal(new[] { "CFG1", "CFG2" }, provider.GetEnabledLocations().Select(l => l.Name));
    }

    [Fact]
    public async Task StartupStopsRetryingOnceTheRosterAnswers()
    {
        var attempts = 0;
        var config = Config();
        config.LocationRoster!.StartupTimeoutSeconds = 10;

        var provider = Build(config, () =>
        {
            attempts++;
            if (attempts < 2)
                throw new HttpRequestException("still warming up");
            return Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" }));
        });

        await provider.StartAsync(CancellationToken.None);
        await provider.StopAsync(CancellationToken.None);

        Assert.Equal(2, attempts);
        Assert.Equal(RosterSource.RosterService, provider.GetSnapshot().Source);
    }

    [Fact]
    public async Task OnceFetchedTheLastGoodRosterIsKeptIndefinitely()
    {
        // The property that matters most: a roster we measured beats a static list that believes
        // every location is up, however long the producer stays away. Driven over many refreshes
        // because "forever" is exactly the kind of thing a later change regresses.
        var fail = false;
        var provider = Build(Config(), () => fail
            ? throw new HttpRequestException("connection refused")
            : Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" }, new Location { Name = "CDG", Disabled = true })));

        Assert.True(await provider.RefreshOnceAsync(CancellationToken.None));
        fail = true;

        for (var i = 0; i < 50; i++)
            Assert.False(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(RosterSource.MemoryCache, provider.GetSnapshot().Source);
        Assert.Equal(new[] { "LAX" }, provider.GetEnabledLocations().Select(l => l.Name));
        Assert.Equal(2, provider.GetAllLocations().Count);
    }

    [Fact]
    public async Task RosterOlderThanTheHardMax_KeepsTheLastGoodRosterInsteadOfReverting()
    {
        // A wedged producer must not cost us the good data we already have - that would make an
        // unreachable producer strictly better than a stale one.
        var stale = false;
        var provider = Build(Config(), () => stale
            ? Ok(Payload(DateTime.UtcNow.AddHours(-3), new Location { Name = "ANCIENT" }))
            : Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" })));

        Assert.True(await provider.RefreshOnceAsync(CancellationToken.None));
        stale = true;
        Assert.False(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(new[] { "LAX" }, provider.GetEnabledLocations().Select(l => l.Name));
        Assert.DoesNotContain(provider.GetAllLocations(), l => l.Name == "ANCIENT");
    }

    [Fact]
    public async Task DiskCacheBelowMinLocations_IsRejectedForConfiguration()
    {
        // Min_Locations guarded the network path but not a cold start from disk.
        Directory.CreateDirectory(_cacheDirectory);
        File.WriteAllText(CachePath, Payload(DateTime.UtcNow, new Location { Name = "FROMDISK" }));

        var provider = Build(Config(true, minLocations: 2), () => throw new HttpRequestException("connection refused"));

        Assert.False(await provider.RefreshOnceAsync(CancellationToken.None));

        Assert.Equal(RosterSource.Configuration, provider.GetSnapshot().Source);
        Assert.DoesNotContain(provider.GetAllLocations(), l => l.Name == "FROMDISK");
    }

    private sealed class StubHandler(Func<HttpResponseMessage> responder) : HttpMessageHandler
    {
        public Uri? LastRequestUri { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            LastRequestUri = request.RequestUri;
            return Task.FromResult(responder());
        }
    }

    /// <summary>Builds a provider and hands back the handler so a test can inspect the request.</summary>
    private static (LocationProviderService Provider, StubHandler Handler) BuildWithHandler(LocalConfig config)
    {
        var handler = new StubHandler(() => Ok(Payload(DateTime.UtcNow, new Location { Name = "LAX" })));
        var factory = new Mock<IHttpClientFactory>();
        factory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(() => new HttpClient(handler));

        return (new LocationProviderService(config, factory.Object, NullLogger<LocationProviderService>.Instance), handler);
    }

    [Fact]
    public async Task HttpTransport_AsksTheProducerForTheLocationUrls()
    {
        // HttpQueue builds "{location.URL}/http", so a Core off NATS is useless without them.
        var config = Config();
        config.UsingNATS = false;

        var (provider, handler) = BuildWithHandler(config);
        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.Contains("include=url", handler.LastRequestUri!.Query);
    }

    [Fact]
    public async Task NatsTransport_DoesNotAskForTheLocationUrls()
    {
        // A NATS consumer cannot act on them, and they are internal hostnames on an
        // unauthenticated endpoint.
        var config = Config();
        config.UsingNATS = true;

        var (provider, handler) = BuildWithHandler(config);
        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.DoesNotContain("include", handler.LastRequestUri!.Query);
    }

    [Fact]
    public async Task EndpointWithAnExistingQueryString_GetsAnAmpersand()
    {
        // Endpoint is operator-supplied, so a second "?" would be a malformed URI.
        var config = Config();
        config.UsingNATS = false;
        config.LocationRoster!.Endpoint = "http://127.0.0.1:5199/locations?pretty=1";

        var (provider, handler) = BuildWithHandler(config);
        await provider.RefreshOnceAsync(CancellationToken.None);

        Assert.Equal("?pretty=1&include=url", handler.LastRequestUri!.Query);
    }
}
