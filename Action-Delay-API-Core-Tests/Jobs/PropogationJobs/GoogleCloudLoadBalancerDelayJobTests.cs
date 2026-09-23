using Action_Delay_API_Core_Tests;
using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Jobs.PropagationJobs.Google;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Net;
using System.Text.Json;

namespace Action_Delay_API_Core_Tests.Jobs.PropogationJobs;

public class GoogleCloudLoadBalancerDelayJobTests : IDisposable
{
    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<GoogleCloudLoadBalancerDelayJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly Mock<IGoogleComputeAPIBroker> _brokerMock;

    public GoogleCloudLoadBalancerDelayJobTests()
    {
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase($"GoogleLbDb_{Guid.NewGuid()}")
            .Options;
        _context = new ActionDelayDatabaseContext(_dbContextOptions);

        var locations = new List<Location>
        {
            new Location { Name = "loc1", DisplayName = "Loc 1", Disabled = false },
            new Location { Name = "loc2", DisplayName = "Loc 2", Disabled = false },
        };

        _configMock = new Mock<IOptions<LocalConfig>>();
        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = locations,
            GoogleCloudLoadBalancerJob = new GoogleCloudLoadBalancerDelayJobConfig
            {
                ServiceAccountJson = "{}",
                ProjectId = "test-project",
                UrlMapName = "adapi-lb",
                PathMatcherName = "probe",
                DefaultService = "https://www.googleapis.com/compute/v1/projects/test-project/global/backendServices/adapi-backend",
                ProbePath = "/lb-probe",
                LbHostname = "lb.delay.example.com",
                TargetRedirectHostname = "redirect.example.com",
            }
        });

        _loggerMock = new Mock<ILogger<GoogleCloudLoadBalancerDelayJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();
        _brokerMock = new Mock<IGoogleComputeAPIBroker>();
    }

    [Fact]
    public async Task BaseRun_PatchesUrlMapAndDetectsRedirectOnEdge_MarksDeployed()
    {
        _brokerMock
            .Setup(b => b.GetUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Ok(new UrlMapResponse
            {
                Fingerprint = "fingerprint-abc",
                PathMatchers = new List<JsonElement> { Matcher("probe") },
            }));

        // The job builds an unpredictable redirect host at runtime. Capture it off the patch, then hand it
        // back as the Location header from every edge probe so all locations "see" the change.
        string capturedHostRedirect = "";
        _brokerMock
            .Setup(b => b.PatchUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<PatchUrlMapRequest>(),
                It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Callback<string, string, PatchUrlMapRequest, string, CancellationToken>(
                (_, _, request, _, _) => capturedHostRedirect = CapturedHostRedirect(request))
            .ReturnsAsync(Result.Ok(new GoogleCloudAPIResponse { ResponseTimeMs = 5 }));

        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(),
                It.IsAny<int>()))
            .ReturnsAsync(() => Result.Ok(new SerializableHttpResponse
            {
                WasSuccess = false,
                StatusCode = HttpStatusCode.Found,
                Headers = new Dictionary<string, string>
                {
                    { "location", $"https://{capturedHostRedirect}/" }
                },
                ResponseUTC = DateTime.UtcNow,
                ResponseTimeMs = 10,
            }));

        var job = new GoogleCloudLoadBalancerDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        await job.BaseRun();

        // The fingerprint from the read is echoed back on the write - urlMaps.patch rejects a stale one.
        _brokerMock.Verify(b => b.PatchUrlMap("test-project", "adapi-lb",
            It.Is<PatchUrlMapRequest>(r => r.Fingerprint == "fingerprint-abc"),
            "{}", It.IsAny<CancellationToken>()), Times.AtLeastOnce);

        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "googlelb");
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData!.CurrentRunStatus);
    }

    [Fact]
    public async Task RunLocation_EdgeStillServingPreviousRedirect_ReportsUndeployed()
    {
        _brokerMock
            .Setup(b => b.GetUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Ok(new UrlMapResponse
            {
                Fingerprint = "fingerprint-abc",
                PathMatchers = new List<JsonElement> { Matcher("probe") },
            }));

        string capturedHostRedirect = "";
        _brokerMock
            .Setup(b => b.PatchUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<PatchUrlMapRequest>(),
                It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Callback<string, string, PatchUrlMapRequest, string, CancellationToken>(
                (_, _, request, _, _) => capturedHostRedirect = CapturedHostRedirect(request))
            .ReturnsAsync(Result.Ok(new GoogleCloudAPIResponse { ResponseTimeMs = 5 }));

        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(),
                It.IsAny<int>()))
            .ReturnsAsync(() => Result.Ok(new SerializableHttpResponse
            {
                WasSuccess = false,
                StatusCode = HttpStatusCode.Found,
                Headers = new Dictionary<string, string> { { "location", $"https://{capturedHostRedirect}/" } },
                ResponseUTC = DateTime.UtcNow,
                ResponseTimeMs = 10,
            }));

        var job = new GoogleCloudLoadBalancerDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        // Run once so the job holds a live marker, then serve an older run's redirect target instead.
        // A location must report Undeployed rather than mistaking any 302 for this run's change - the
        // whole point of putting a per-run marker in the redirect host.
        await job.BaseRun();

        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(),
                It.IsAny<int>()))
            .ReturnsAsync(() => Result.Ok(new SerializableHttpResponse
            {
                WasSuccess = false,
                StatusCode = HttpStatusCode.Found,
                Headers = new Dictionary<string, string> { { "location", "https://1.stale.0.redirect.example.com/" } },
                ResponseUTC = DateTime.UtcNow,
                ResponseTimeMs = 10,
            }));

        var result = await job.RunLocation(new Location { Name = "loc1", DisplayName = "Loc 1" },
            CancellationToken.None);

        Assert.False(result.Done);
        Assert.False(result.Errored);
    }

    /// <summary>A path matcher as the API hands it back, including a field the job's DTO does not model.</summary>
    private static JsonElement Matcher(string name) => JsonSerializer.SerializeToElement(new Dictionary<string, object>
    {
        ["name"] = name,
        ["defaultService"] = "https://www.googleapis.com/compute/v1/projects/test-project/global/backendServices/adapi-backend",
        ["routeRules"] = new[] { new Dictionary<string, object> { ["priority"] = 1 } },
    });

    [Fact]
    public async Task RunRepeatableAction_MapHasOtherPathMatchers_LeavesThemUntouched()
    {
        _brokerMock
            .Setup(b => b.GetUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Ok(new UrlMapResponse
            {
                Fingerprint = "fingerprint-abc",
                PathMatchers = new List<JsonElement> { Matcher("unrelated"), Matcher("probe") },
            }));

        PatchUrlMapRequest? capturedPatch = null;
        _brokerMock
            .Setup(b => b.PatchUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<PatchUrlMapRequest>(),
                It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Callback<string, string, PatchUrlMapRequest, string, CancellationToken>(
                (_, _, request, _, _) => capturedPatch = request)
            .ReturnsAsync(Result.Ok(new GoogleCloudAPIResponse { ResponseTimeMs = 5 }));

        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(),
                It.IsAny<int>()))
            .ReturnsAsync(() => Result.Ok(new SerializableHttpResponse
            {
                WasSuccess = false,
                StatusCode = HttpStatusCode.Found,
                Headers = new Dictionary<string, string>
                {
                    { "location", $"https://{CapturedHostRedirect(capturedPatch)}/" }
                },
                ResponseUTC = DateTime.UtcNow,
                ResponseTimeMs = 10,
            }));

        var job = new GoogleCloudLoadBalancerDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        await job.BaseRun();

        // Compute PATCH replaces arrays wholesale, so the job has to hand back every matcher it does not
        // own - including fields its own DTO cannot represent, here routeRules.
        Assert.NotNull(capturedPatch);
        Assert.Equal(2, capturedPatch!.PathMatchers.Count);

        var untouched = capturedPatch.PathMatchers.Single(m => m.GetProperty("name").GetString() == "unrelated");
        Assert.True(untouched.TryGetProperty("routeRules", out var routeRules));
        Assert.Equal(1, routeRules[0].GetProperty("priority").GetInt32());

        // ...and ours is the one that actually got rewritten.
        var probe = capturedPatch.PathMatchers.Single(m => m.GetProperty("name").GetString() == "probe");
        var hostRedirect = probe.GetProperty("pathRules")[0].GetProperty("urlRedirect")
            .GetProperty("hostRedirect").GetString();
        Assert.EndsWith(".redirect.example.com", hostRedirect);
    }

    [Fact]
    public async Task RunRepeatableAction_ProbeMatcherMissing_FailsWithoutPatching()
    {
        _brokerMock
            .Setup(b => b.GetUrlMap(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Ok(new UrlMapResponse
            {
                Fingerprint = "fingerprint-abc",
                PathMatchers = new List<JsonElement> { Matcher("unrelated") },
            }));

        var job = new GoogleCloudLoadBalancerDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        // Appending a matcher instead would leave one no host rule points at - traffic would never reach
        // it, and the job would poll forever with nothing explaining why. Fail where it can be read.
        await Assert.ThrowsAnyAsync<Exception>(() => job.BaseRun());

        _brokerMock.Verify(b => b.PatchUrlMap(It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<PatchUrlMapRequest>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);

        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "googlelb");
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_API_ERROR, jobData!.CurrentRunStatus);
    }

    private static string CapturedHostRedirect(PatchUrlMapRequest? patch) =>
        patch?.PathMatchers.Single(m => m.GetProperty("name").GetString() == "probe")
            .GetProperty("pathRules")[0].GetProperty("urlRedirect").GetProperty("hostRedirect").GetString() ?? "";

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
