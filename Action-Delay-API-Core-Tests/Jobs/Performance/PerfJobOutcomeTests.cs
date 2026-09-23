using Action_Delay_API_Core.Jobs.Performance;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
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
using Xunit;

namespace Action_Delay_API_Core_Tests.Jobs.Performance;

/// <summary>
/// The Perf jobs write to their own tables and used to record every missed run as
/// <c>insufficient_coverage</c>, which made <c>ExcludeInfrastructureFailures</c> a no-op for them. They
/// now share the propagation jobs' coverage-refinement rule, so <c>probe_degraded</c> means the same
/// thing in every table the success rate can exclude it from.
/// </summary>
public class PerfJobOutcomeTests : IDisposable
{
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock = new();
    private readonly Mock<ILogger<GenericDownloadBaseJob>> _loggerMock = new();
    private readonly Mock<IClickHouseService> _clickhouseMock = new();
    private readonly Mock<IQueue> _queueMock = new();
    private readonly List<ClickhouseJobRunPerf> _emittedRuns = new();
    private readonly List<ClickhouseJobLocationRunPerf> _emittedLocations = new();

    public PerfJobOutcomeTests()
    {
        _context = new ActionDelayDatabaseContext(
            new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
                .UseInMemoryDatabase($"PerfOutcomeDb_{Guid.NewGuid()}").Options);

        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = new List<Location>
            {
                new() { Name = "location1", DisplayName = "Location 1", Disabled = false },
                new() { Name = "location2", DisplayName = "Location 2", Disabled = false },
            },
            PerfConfig = new PerfConfig
            {
                Enabled = true,
                BasicDownloadJobList = new List<DownloadJobGeneric>
                {
                    new()
                    {
                        Name = "perf-download-test",
                        Description = "Download Test",
                        Endpoint = "https://example.invalid/object",
                        // Warmup failures drop locations from the run before it starts, which would
                        // leave nothing to attribute.
                        DisablePrewarmup = true,
                    },
                },
            },
        });

        _clickhouseMock
            .Setup(x => x.InsertRunPerf(It.IsAny<List<ClickhouseJobRunPerf>>(),
                It.IsAny<List<ClickhouseJobLocationRunPerf>>(),
                It.IsAny<List<ClickhouseAPIErrorPerf>>(), It.IsAny<CancellationToken>()))
            .Callback<List<ClickhouseJobRunPerf>, List<ClickhouseJobLocationRunPerf>?,
                List<ClickhouseAPIErrorPerf>?, CancellationToken>(
                (runs, locations, _, _) =>
                {
                    _emittedRuns.AddRange(runs);
                    if (locations != null) _emittedLocations.AddRange(locations);
                })
            .Returns(Task.CompletedTask);
    }

    private GenericDownloadBaseJob NewJob() => new(
        _configMock.Object, _loggerMock.Object, _clickhouseMock.Object, _context, _queueMock.Object,
        StaticLocationProvider.From(_configMock.Object));

    [Fact]
    public async Task CoverageMissedBecauseTheWorkersWereUnreachable_IsProbeDegraded()
    {
        // Nothing was ever measured: the requests never reached a worker. The run says nothing about
        // the endpoint being monitored, so a success rate may legitimately exclude it.
        _queueMock
            .Setup(x => x.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(),
                It.IsAny<CancellationToken>(), It.IsAny<int>()))
            .ReturnsAsync(Result.Fail<SerializableHttpResponse>(
                new QueueError(QueueErrorKind.NoResponders, "no responders")));

        await NewJob().BaseRun();

        var run = Assert.Single(_emittedRuns);
        Assert.Equal("Failure", run.RunStatus);
        Assert.Equal("probe_degraded", run.Outcome);
        Assert.All(_emittedLocations, row => Assert.Equal("transport_failed", row.Outcome));
        Assert.All(_emittedLocations, row => Assert.Equal(FailureReason.NoResponders, row.FailureReason));
    }

    [Fact]
    public async Task CoverageMissedBecauseTheEndpointErrored_StaysInsufficientCoverage()
    {
        // The endpoint answered, and the answer was bad. That is a real failure of the thing being
        // measured and must keep counting against it.
        _queueMock
            .Setup(x => x.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(),
                It.IsAny<CancellationToken>(), It.IsAny<int>()))
            .ReturnsAsync(Result.Ok(new SerializableHttpResponse
            {
                WasSuccess = false,
                ProxyFailure = false,
                StatusCode = System.Net.HttpStatusCode.InternalServerError,
                Headers = new Dictionary<string, string>(),
                Body = string.Empty,
                ResponseTimeMs = 42,
            }));

        await NewJob().BaseRun();

        var run = Assert.Single(_emittedRuns);
        Assert.Equal("Failure", run.RunStatus);
        Assert.Equal("insufficient_coverage", run.Outcome);
        Assert.All(_emittedLocations, row => Assert.Equal("upstream_status", row.Outcome));
        Assert.All(_emittedLocations, row => Assert.Equal(FailureReason.Status5xx, row.FailureReason));
    }

    // Deliberately no success-path test here. GenericDownloadBaseJob.BaseRun contains an unconditional
    // Task.Delay(5000), so every test in this class costs five seconds; the success branch is a plain
    // ternary already covered directly by RunOutcomeClassificationTests, and is not worth that.

    public void Dispose() => _context.Dispose();
}
