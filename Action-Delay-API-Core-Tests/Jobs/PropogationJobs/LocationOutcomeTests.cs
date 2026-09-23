using Action_Delay_API_Core.Jobs.PropagationJobs;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Services.Locations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Action_Delay_API_Core_Tests.Jobs.PropogationJobs;

/// <summary>
/// Covers what a run records per location, and - just as importantly - that adding it changed none of
/// the <c>run_status</c> values that the dashboards, the website and the success-only materialized
/// views read.
/// </summary>
public class LocationOutcomeTests : IDisposable
{
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock = new();
    private readonly Mock<ILogger<BasePropagationJob>> _loggerMock = new();
    private readonly Mock<IClickHouseService> _clickhouseMock = new();
    private readonly Mock<IQueue> _queueMock = new();
    private readonly List<ClickhouseJobLocationRun> _emittedLocations = new();
    private ClickhouseJobRun? _emittedRun;

    public LocationOutcomeTests()
    {
        _context = new ActionDelayDatabaseContext(
            new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
                .UseInMemoryDatabase($"OutcomeDb_{Guid.NewGuid()}").Options);

        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = new List<Location>
            {
                new() { Name = "location1", DisplayName = "Location 1", Disabled = false },
                new() { Name = "location2", DisplayName = "Location 2", Disabled = false },
            }
        });

        _clickhouseMock
            .Setup(x => x.InsertRun(It.IsAny<ClickhouseJobRun>(), It.IsAny<List<ClickhouseJobLocationRun>>(),
                It.IsAny<ClickhouseAPIError>(), It.IsAny<CancellationToken>()))
            .Callback<ClickhouseJobRun, List<ClickhouseJobLocationRun>?, ClickhouseAPIError?, CancellationToken>(
                (run, locations, _, _) =>
                {
                    _emittedRun = run;
                    if (locations != null) _emittedLocations.AddRange(locations);
                })
            .Returns(Task.CompletedTask);
    }

    private TestableBasePropagationJob NewJob() => new(
        _configMock.Object, _loggerMock.Object, _clickhouseMock.Object, _context, _queueMock.Object);

    /// <summary>
    /// A job over <paramref name="count"/> locations. Cancellation only arms once 80% have finished,
    /// so tests that need it cannot use the two-location default - one success there is 50%.
    /// </summary>
    private TestableBasePropagationJob NewJobWithLocations(int count)
    {
        var config = new Mock<IOptions<LocalConfig>>();
        config.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = Enumerable.Range(1, count)
                .Select(i => new Location { Name = $"location{i}", DisplayName = $"Location {i}", Disabled = false })
                .ToList()
        });
        return new TestableBasePropagationJob(
            config.Object, _loggerMock.Object, _clickhouseMock.Object, _context, _queueMock.Object);
    }

    private ClickhouseJobLocationRun Emitted(string location) =>
        Assert.Single(_emittedLocations, row => row.LocationName == location);

    [Fact]
    public async Task ATransportFailure_IsNotAttributedToTheMonitoredSystem()
    {
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", RunLocationResult.TransportFailure(
            new[] { new QueueError(QueueErrorKind.NoResponders, "no responders") }, null, -1));

        await job.BaseRun();

        var row = Emitted("location2");
        Assert.Equal("transport_failed", row.Outcome);
        Assert.Equal(FailureReason.NoResponders, row.FailureReason);

        // Frozen. Eleven Grafana panels read this exact spelling.
        Assert.Equal(Status.STATUS_ERRORED, row.RunStatus);
    }

    [Fact]
    public async Task AnUpstreamTimeout_IsAttributedToTheMonitoredSystem()
    {
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", RunLocationResult.FromProbe(
            new Action_Delay_API_Core.Models.NATS.Responses.SerializableHttpResponse
            {
                WasSuccess = false,
                ProxyFailure = false,
                StatusCode = System.Net.HttpStatusCode.GatewayTimeout,
                FailureKind = Action_Delay_API_Core.Models.NATS.Responses.ProbeFailureKind.Timeout,
            }, 5000, 4));

        await job.BaseRun();

        var row = Emitted("location2");
        Assert.Equal("upstream_timeout", row.Outcome);
        Assert.Equal(Status.STATUS_ERRORED, row.RunStatus);
    }

    [Fact]
    public async Task ACancelledLocation_RecordsCancelledNotAFailure()
    {
        // The headline fix. A location still propagating when the job stopped waiting used to be
        // indistinguishable from a dead edge worker, which is the single biggest source of
        // overstated failure in the existing data.
        // Five locations, four of which finish: 80%, which is what arms the deadline.
        var job = NewJobWithLocations(5);
        job._cancelAfterHalfDone = TimeSpan.FromMilliseconds(200);
        for (var i = 1; i <= 4; i++) job.SetLocationResult($"location{i}", true);
        job.HangingLocations.Add("location5");

        await job.BaseRun();

        var row = Emitted("location5");
        Assert.Equal("cancelled", row.Outcome);
        Assert.Equal(FailureReason.Cancelled, row.FailureReason);
        Assert.False(RunOutcome.Cancelled.IsAttributableToTarget());

        // Still "Errored" on the wire - the correction lives in the new column only.
        Assert.Equal(Status.STATUS_ERRORED, row.RunStatus);
    }

    [Fact]
    public async Task EveryAttemptedLocationEmitsExactlyOneRow()
    {
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", false);

        await job.BaseRun();

        Assert.Equal(2, _emittedLocations.Count);
        Assert.Equal(new[] { "location1", "location2" },
            _emittedLocations.Select(r => r.LocationName).OrderBy(x => x));
        // No row may be left unclassified: an empty outcome means a path was missed.
        Assert.All(_emittedLocations, row => Assert.False(string.IsNullOrEmpty(row.Outcome)));
    }

    [Fact]
    public async Task ASecondRunDoesNotInheritTheFirstRunsOutcome()
    {
        // CurrentRunStatus survives across runs, which is why the old emission filter was dead code
        // and silent locations re-emitted stale numbers. The outcome must be per-run.
        var job1 = NewJob();
        job1.SetLocationResult("location1", true);
        job1.SetLocationResult("location2", true);
        await job1.BaseRun();
        Assert.All(_emittedLocations, row => Assert.Equal("deployed", row.Outcome));

        _emittedLocations.Clear();

        var job2 = NewJob();
        job2.SetLocationResult("location1", true);
        job2.SetLocationResult("location2", RunLocationResult.TransportFailure(
            new[] { new QueueError(QueueErrorKind.Timeout, "timed out") }, null, -1));
        await job2.BaseRun();

        Assert.Equal("transport_failed", Emitted("location2").Outcome);
        Assert.Equal(FailureReason.Timeout, Emitted("location2").FailureReason);
    }

    [Fact]
    public async Task TheOutcomeIsPersistedForTheLiveView()
    {
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", RunLocationResult.TransportFailure(
            new[] { new QueueError(QueueErrorKind.NoResponders, "no responders") }, null, -1));

        await job.BaseRun();

        var persisted = await _context.JobLocations
            .Where(l => l.InternalJobName == job.InternalName).ToListAsync();

        Assert.Equal("transport_failed", persisted.Single(l => l.LocationName == "location2").Outcome);
        Assert.Equal("deployed", persisted.Single(l => l.LocationName == "location1").Outcome);
    }

    [Fact]
    public async Task ALocationThatNeverReports_IsRecordedAsNoResultNotItsLastOutcome()
    {
        // location2 reports "deployed", then is put back to None - the state a run leaves a location in
        // when it abandons it still pending. Both the emitted row and the live view have to say
        // no_result: the column is never reset between runs, so anything less keeps showing a stale
        // "deployed" for a location that has since gone silent.
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", true);
        job.LocationsThatNeverReport.Add("location2");

        await job.BaseRun();

        Assert.Equal("no_result", Emitted("location2").Outcome);
        Assert.Equal(FailureReason.NoResult, Emitted("location2").FailureReason);
        // Frozen: a location that never reported has always read as Errored.
        Assert.Equal(Status.STATUS_ERRORED, Emitted("location2").RunStatus);
        Assert.Equal(0UL, Emitted("location2").RunLength);

        var persisted = await _context.JobLocations
            .Where(l => l.InternalJobName == job.InternalName).ToListAsync();

        Assert.Equal("no_result", persisted.Single(l => l.LocationName == "location2").Outcome);
        Assert.Equal(FailureReason.NoResult, persisted.Single(l => l.LocationName == "location2").FailureReason);
        Assert.Equal("deployed", persisted.Single(l => l.LocationName == "location1").Outcome);
    }

    [Fact]
    public async Task LocationsThatNeverReported_DoNotFlipTheRunToProbeDegraded()
    {
        // Guards the ordering: no_result is stamped only after the run outcome is refined. Stamping it
        // first would feed locations that never reported into the majority tally - IsOurFailure counts
        // no_result - and let a run be excused as probe_degraded on the strength of silence.
        var job = NewJob();
        job.SetLocationResult("location1", false);
        job.SetLocationResult("location2", false);
        job.LocationsThatNeverReport.Add("location1");
        job.LocationsThatNeverReport.Add("location2");

        await job.BaseRun();

        Assert.NotNull(_emittedRun);
        Assert.Equal("insufficient_coverage", _emittedRun!.Outcome);
        Assert.All(_emittedLocations, row => Assert.Equal("no_result", row.Outcome));
    }

    [Fact]
    public async Task ASuccessfulRunRecordsDeployedAtBothLevels()
    {
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", true);

        await job.BaseRun();

        Assert.NotNull(_emittedRun);
        Assert.Equal("deployed", _emittedRun!.Outcome);
        Assert.Equal(Status.STATUS_DEPLOYED, _emittedRun.RunStatus);
        Assert.All(_emittedLocations, row => Assert.Equal("deployed", row.Outcome));
        Assert.All(_emittedLocations, row => Assert.Equal(FailureReason.None, row.FailureReason));
    }

    [Fact]
    public async Task AFailedRunSeparatesCoverageFromAnApiError()
    {
        // Both used to write STATUS_ERRORED at the job level with nothing to tell them apart.
        var job = NewJob();
        job.SetLocationResult("location1", false);
        job.SetLocationResult("location2", false);

        await job.BaseRun();

        Assert.NotNull(_emittedRun);
        Assert.Equal("insufficient_coverage", _emittedRun!.Outcome);
        Assert.Equal(Status.STATUS_ERRORED, _emittedRun.RunStatus);
    }

    [Fact]
    public async Task CoverageMissedBecauseOurProbesBroke_IsProbeDegraded()
    {
        // Both locations failed for reasons of ours, so the run tells us nothing about the target and
        // a success rate may legitimately exclude it.
        var job = NewJob();
        foreach (var name in new[] { "location1", "location2" })
            job.SetLocationResult(name, RunLocationResult.TransportFailure(
                new[] { new QueueError(QueueErrorKind.NoResponders, "no responders") }, null, -1));

        await job.BaseRun();

        Assert.NotNull(_emittedRun);
        Assert.Equal("probe_degraded", _emittedRun!.Outcome);
        Assert.Equal(Status.STATUS_ERRORED, _emittedRun.RunStatus);
    }

    [Fact]
    public async Task CancelledLocationsOnlyOccurOnARunThatSucceeded()
    {
        // Documents a constraint in the completion rule that is easy to misread. The gate counts
        // *successes* >= 80%, so the insufficient-coverage branch is only ever reached through
        // "RunningLocations.Count <= 0" - every location has already finished, and there is nothing
        // left to cancel. A run therefore cannot carry both insufficient_coverage and cancelled
        // locations today.
        //
        // RefineJobOutcome still excludes cancelled from "our fault" deliberately: if the completion
        // rule is ever changed so the two can co-occur, a run that missed coverage purely because
        // propagation was slow must not be excusable as a probe problem.
        var job = NewJobWithLocations(5);
        job._cancelAfterHalfDone = TimeSpan.FromMilliseconds(200);
        for (var i = 1; i <= 4; i++) job.SetLocationResult($"location{i}", true);
        job.HangingLocations.Add("location5");

        await job.BaseRun();

        Assert.Equal("cancelled", Emitted("location5").Outcome);
        Assert.Equal("deployed", _emittedRun!.Outcome);
    }

    [Fact]
    public async Task CoverageMissedBecauseTheTargetFailed_StaysInsufficientCoverage()
    {
        var job = NewJob();
        foreach (var name in new[] { "location1", "location2" })
            job.SetLocationResult(name, RunLocationResult.FromProbe(
                new Action_Delay_API_Core.Models.NATS.Responses.SerializableHttpResponse
                {
                    WasSuccess = false,
                    ProxyFailure = false,
                    StatusCode = System.Net.HttpStatusCode.InternalServerError,
                }, 100, 1));

        await job.BaseRun();

        Assert.NotNull(_emittedRun);
        Assert.Equal("insufficient_coverage", _emittedRun!.Outcome);
    }

    [Fact]
    public async Task AMixOfCausesFallsToTheMajority()
    {
        // One transport failure and one genuine upstream failure is not a majority either way, so it
        // stays attributed to the target rather than being excused.
        var job = NewJob();
        job.SetLocationResult("location1", RunLocationResult.TransportFailure(
            new[] { new QueueError(QueueErrorKind.NoResponders, "no responders") }, null, -1));
        job.SetLocationResult("location2", RunLocationResult.FromProbe(
            new Action_Delay_API_Core.Models.NATS.Responses.SerializableHttpResponse
            {
                WasSuccess = false,
                ProxyFailure = false,
                StatusCode = System.Net.HttpStatusCode.BadGateway,
            }, 100, 1));

        await job.BaseRun();

        Assert.NotNull(_emittedRun);
        Assert.Equal("insufficient_coverage", _emittedRun!.Outcome);
    }

    [Fact]
    public async Task ASuccessfulRunIsNeverRefined()
    {
        var job = NewJob();
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", true);

        await job.BaseRun();

        Assert.Equal("deployed", _emittedRun!.Outcome);
    }

    public void Dispose() => _context.Dispose();
}
