using System.Net;
using System.Reflection;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Xunit;

namespace Action_Delay_API_Core_Tests.Jobs;

/// <summary>
/// Covers the attribution rule: a probe failure is ours until there is positive evidence against the
/// target. Only <c>upstream_status</c> and <c>upstream_timeout</c> may be attributed to the monitored
/// system, and everything else has to stay excludable from its success rate.
/// </summary>
public class RunOutcomeClassificationTests
{
    [Theory]
    [InlineData(QueueErrorKind.NoResponders, FailureReason.NoResponders)]
    [InlineData(QueueErrorKind.Timeout, FailureReason.Timeout)]
    [InlineData(QueueErrorKind.Decode, FailureReason.Decode)]
    [InlineData(QueueErrorKind.Compress, FailureReason.Compress)]
    [InlineData(QueueErrorKind.Connection, FailureReason.Connection)]
    [InlineData(QueueErrorKind.Unsupported, FailureReason.Unsupported)]
    [InlineData(QueueErrorKind.WorkerError, FailureReason.WorkerError)]
    public void TransportFailure_CarriesTheQueueErrorKind(QueueErrorKind kind, string expectedReason)
    {
        var result = RunLocationResult.TransportFailure(
            new[] { new QueueError(kind, "boom") }, 12.0, 5);

        Assert.Equal(RunOutcome.TransportFailed, result.Outcome);
        Assert.Equal(expectedReason, result.FailureReasonCode);
        Assert.True(result.Errored);
        // The whole point: an offline worker says nothing about Cloudflare or Bunny.
        Assert.False(result.Outcome.IsAttributableToTarget());
    }

    [Fact]
    public void TransportFailure_WithUntypedErrors_StillReportsTransport()
    {
        // Anything still returning a bare string failure must not be attributed to the target.
        var result = RunLocationResult.TransportFailure(
            new IError[] { new Error("some legacy string failure") }, null, -1);

        Assert.Equal(RunOutcome.TransportFailed, result.Outcome);
        Assert.Equal(FailureReason.Other, result.FailureReasonCode);
    }

    [Fact]
    public void ProbeTimeout_IsAttributedToTheTarget()
    {
        // A timeout is a measurement of the target: it was asked and did not answer in time.
        var response = new SerializableHttpResponse
        {
            WasSuccess = false,
            ProxyFailure = false,
            StatusCode = HttpStatusCode.GatewayTimeout,
            FailureKind = ProbeFailureKind.Timeout,
        };

        var result = RunLocationResult.FromProbe(response, 5000, 7);

        Assert.Equal(RunOutcome.UpstreamTimeout, result.Outcome);
        Assert.Equal(FailureReason.Timeout, result.FailureReasonCode);
        Assert.True(result.Outcome.IsAttributableToTarget());
    }

    [Theory]
    [InlineData(ProbeFailureKind.Internal, FailureReason.Internal)]
    [InlineData(ProbeFailureKind.Connect, FailureReason.Connect)]
    [InlineData(ProbeFailureKind.Dns, FailureReason.Dns)]
    [InlineData(ProbeFailureKind.Tls, FailureReason.Tls)]
    [InlineData(ProbeFailureKind.Protocol, FailureReason.Protocol)]
    [InlineData(ProbeFailureKind.BodyTooLarge, FailureReason.BodyTooLarge)]
    public void ProxyFailure_IsOursRegardlessOfKind(string probeKind, string expectedReason)
    {
        var response = new SerializableHttpResponse
        {
            WasSuccess = false,
            ProxyFailure = true,
            StatusCode = HttpStatusCode.BadGateway,
            FailureKind = probeKind,
        };

        var result = RunLocationResult.FromProbe(response, 40, 3);

        Assert.Equal(RunOutcome.ProbeFailed, result.Outcome);
        Assert.Equal(expectedReason, result.FailureReasonCode);
        // The governing rule - none of these may count against the monitored system.
        Assert.False(result.Outcome.IsAttributableToTarget());
    }

    [Fact]
    public void ProxyFailure_FromAWorkerPredatingFailureKind_IsFlaggedAsLegacy()
    {
        // Makes fleet rollout visible: while this is still being recorded, some workers are old.
        var response = new SerializableHttpResponse
        {
            WasSuccess = false,
            ProxyFailure = true,
            StatusCode = HttpStatusCode.BadGateway,
            FailureKind = null,
        };

        var result = RunLocationResult.FromProbe(response, 40, 3);

        Assert.Equal(RunOutcome.ProbeFailed, result.Outcome);
        Assert.Equal(FailureReason.LegacyProxyFailure, result.FailureReasonCode);
    }

    [Theory]
    [InlineData(HttpStatusCode.NotFound, FailureReason.Status4xx)]
    [InlineData(HttpStatusCode.TooManyRequests, FailureReason.Status4xx)]
    [InlineData(HttpStatusCode.InternalServerError, FailureReason.Status5xx)]
    [InlineData(HttpStatusCode.BadGateway, FailureReason.Status5xx)]
    public void ARealStatusCode_IsAttributedToTheTarget(HttpStatusCode status, string expectedReason)
    {
        var response = new SerializableHttpResponse
        {
            WasSuccess = false,
            ProxyFailure = false,
            StatusCode = status,
        };

        var result = RunLocationResult.FromProbe(response, 80, 2);

        Assert.Equal(RunOutcome.UpstreamStatus, result.Outcome);
        Assert.Equal(expectedReason, result.FailureReasonCode);
        Assert.True(result.Outcome.IsAttributableToTarget());
    }

    [Fact]
    public void StatusCodesAreBucketed_NotStoredVerbatim()
    {
        // Cardinality: the column is LowCardinality, and api_errors already stores exact codes.
        var reasons = new HashSet<string>();
        for (var code = 400; code < 600; code++)
            reasons.Add(FailureReason.FromStatusCode((HttpStatusCode)code));

        Assert.Equal(new[] { FailureReason.Status4xx, FailureReason.Status5xx }.OrderBy(x => x),
            reasons.OrderBy(x => x));
    }

    [Fact]
    public void DnsRcode_IsAttributedToTheTarget()
    {
        // A returned rcode is the resolver answering, not a failure to reach it.
        var response = new SerializableDNSResponse
        {
            ProxyFailure = false,
            ResponseCode = "ServerFailure",
        };

        var result = RunLocationResult.FromProbe(response, 30, -1);

        Assert.Equal(RunOutcome.UpstreamStatus, result.Outcome);
        Assert.Equal(FailureReason.DnsRcode, result.FailureReasonCode);
    }

    [Fact]
    public void UnrecognisedReasons_FoldToOther()
    {
        // The cardinality guard. One free-text value reaching a LowCardinality column at millions of
        // rows a day would degrade the encoding for every row in the part.
        Assert.Equal(FailureReason.Other, FailureReason.Sanitize("Connection reset by peer at 10.0.0.1:443"));
        Assert.Equal(FailureReason.Other, FailureReason.Sanitize(Guid.NewGuid().ToString()));
        Assert.Equal(FailureReason.None, FailureReason.Sanitize(null));
        Assert.Equal(FailureReason.None, FailureReason.Sanitize(""));

        // Known values pass through untouched.
        Assert.Equal(FailureReason.NoResponders, FailureReason.Sanitize(FailureReason.NoResponders));
        Assert.Equal(FailureReason.Timeout, FailureReason.Sanitize(FailureReason.Timeout));
    }

    [Fact]
    public void TheLegacyStringConstructor_ReportsUnknownRatherThanGuessing()
    {
        // A call site missed by the sweep must show up as a gap to close, not be filed under a
        // plausible-looking wrong cause.
        var result = new RunLocationResult("Queue Error", 10, 1);

        Assert.Equal(RunOutcome.Unknown, result.Outcome);
        Assert.Equal("unknown", result.Outcome.ToColumnValue());
        Assert.False(result.Outcome.IsAttributableToTarget());
    }

    [Fact]
    public void OnlyUpstreamOutcomesCountAgainstTheMonitoredSystem()
    {
        Assert.True(RunOutcome.Deployed.IsAttributableToTarget());
        Assert.True(RunOutcome.UpstreamStatus.IsAttributableToTarget());
        Assert.True(RunOutcome.UpstreamTimeout.IsAttributableToTarget());

        foreach (var ours in new[]
                 {
                     RunOutcome.ProbeFailed, RunOutcome.TransportFailed, RunOutcome.NoResult,
                     RunOutcome.JobError, RunOutcome.Cancelled, RunOutcome.Unknown,
                 })
            Assert.False(ours.IsAttributableToTarget(), $"{ours} must not count against the target");
    }

    [Fact]
    public void IsOurFailure_CoversTheApparatusOnly()
    {
        foreach (var ours in new[]
                 {
                     RunOutcome.ProbeFailed, RunOutcome.TransportFailed,
                     RunOutcome.NoResult, RunOutcome.JobError,
                 })
            Assert.True(ours.IsOurFailure(), $"{ours} is an apparatus failure");

        foreach (var notOurs in new[]
                 {
                     RunOutcome.Deployed, RunOutcome.UpstreamStatus, RunOutcome.UpstreamTimeout,
                 })
            Assert.False(notOurs.IsOurFailure(), $"{notOurs} is evidence about the target");
    }

    [Fact]
    public void Cancelled_IsNeitherOursNorExcusable()
    {
        // The trap this predicate exists to avoid. Cancelled means the job stopped waiting while the
        // location was still propagating - a slow target, not a broken probe. Treating it as ours
        // would let a run that missed coverage purely because propagation was slow be excluded from
        // the success rate, hiding the exact outages this system is for.
        Assert.False(RunOutcome.Cancelled.IsOurFailure());
        Assert.False(RunOutcome.Cancelled.IsAttributableToTarget());

        // Unknown is excluded for the opposite reason: it means a call site was missed, and guessing
        // either way buries that.
        Assert.False(RunOutcome.Unknown.IsOurFailure());
        Assert.False(RunOutcome.None.IsOurFailure());
    }

    [Fact]
    public void IsOurFailure_IsNotTheInverseOfIsAttributableToTarget()
    {
        // Stated as a test so a future "simplification" to !IsAttributableToTarget() fails loudly.
        var disagree = Enum.GetValues<RunOutcome>()
            .Where(o => o.IsOurFailure() == !o.IsAttributableToTarget())
            .ToList();

        Assert.DoesNotContain(RunOutcome.Cancelled, disagree);
    }

    [Fact]
    public void ColumnValuesAreStableAndDistinct()
    {
        // These strings are the analytics contract - queries match them verbatim, so a rename after
        // data exists silently splits every historical series.
        Assert.Equal("deployed", RunOutcome.Deployed.ToColumnValue());
        Assert.Equal("upstream_status", RunOutcome.UpstreamStatus.ToColumnValue());
        Assert.Equal("upstream_timeout", RunOutcome.UpstreamTimeout.ToColumnValue());
        Assert.Equal("probe_failed", RunOutcome.ProbeFailed.ToColumnValue());
        Assert.Equal("transport_failed", RunOutcome.TransportFailed.ToColumnValue());
        Assert.Equal("no_result", RunOutcome.NoResult.ToColumnValue());
        Assert.Equal("job_error", RunOutcome.JobError.ToColumnValue());
        Assert.Equal("cancelled", RunOutcome.Cancelled.ToColumnValue());
        Assert.Equal("insufficient_coverage", RunOutcome.InsufficientCoverage.ToColumnValue());
        Assert.Equal("probe_degraded", RunOutcome.ProbeDegraded.ToColumnValue());
        Assert.Equal("api_error", RunOutcome.ApiError.ToColumnValue());

        var all = Enum.GetValues<RunOutcome>().Where(o => o != RunOutcome.None && o != RunOutcome.Unknown);
        Assert.Equal(all.Count(), all.Select(o => o.ToColumnValue()).Distinct().Count());
    }

    [Fact]
    public void EveryProbeFailureKind_IsClassifiable()
    {
        // The two ProbeFailureKind classes are hand-duplicated across the Core and Worker projects and
        // nothing makes them compile together, so drift is silent. This catches the half that matters:
        // a kind the worker can put on the wire that Core cannot classify would land in the column as
        // "other" and be indistinguishable from genuine noise.
        var kinds = typeof(ProbeFailureKind)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field.IsLiteral && field.FieldType == typeof(string))
            .Select(field => (string)field.GetRawConstantValue()!)
            .ToList();

        Assert.NotEmpty(kinds);
        foreach (var kind in kinds)
        {
            var reason = FailureReason.FromProbeFailureKind(kind);
            Assert.False(reason == FailureReason.Other,
                $"ProbeFailureKind.{kind} has no FailureReason - add an arm to FromProbeFailureKind");
            // And whatever it maps to has to survive the cardinality guard unchanged.
            Assert.Equal(reason, FailureReason.Sanitize(reason));
        }
    }

    [Fact]
    public void AnExplicitLegacyKind_IsNamedNotFoldedToOther()
    {
        // Core substitutes Legacy for an absent kind so the fleet rollout is visible in the data. It
        // therefore arrives both ways, and both have to name it - folding the explicit spelling to
        // "other" would hide exactly the signal the constant exists to provide.
        Assert.Equal(FailureReason.LegacyProxyFailure, FailureReason.FromProbeFailureKind(ProbeFailureKind.Legacy));
        Assert.Equal(FailureReason.LegacyProxyFailure, FailureReason.FromProbeFailureKind(null));
        Assert.Equal(FailureReason.LegacyProxyFailure, FailureReason.FromProbeFailureKind(""));
        Assert.True(ProbeFailureKind.IsLegacy(null));
        Assert.True(ProbeFailureKind.IsLegacy(""));
    }

    [Fact]
    public void RefineCoverageOutcome_BlamesUsOnlyWhenMostFailuresWereOurs()
    {
        // Majority of apparatus failures -> ours.
        Assert.Equal(RunOutcome.ProbeDegraded, RunOutcomeExtensions.RefineCoverageOutcome(
            new[] { RunOutcome.TransportFailed, RunOutcome.TransportFailed, RunOutcome.UpstreamStatus }));

        // Exactly half is not a majority - the target keeps the blame.
        Assert.Equal(RunOutcome.InsufficientCoverage, RunOutcomeExtensions.RefineCoverageOutcome(
            new[] { RunOutcome.TransportFailed, RunOutcome.UpstreamStatus }));

        // Nothing failed at all: coverage was missed for some other reason, so nothing to reattribute.
        Assert.Equal(RunOutcome.InsufficientCoverage, RunOutcomeExtensions.RefineCoverageOutcome(
            new[] { RunOutcome.Deployed, RunOutcome.Deployed }));
    }

    [Fact]
    public void RefineCoverageOutcome_NeverExcusesASlowTarget()
    {
        // A run full of cancelled locations missed coverage because propagation was slow. Excusing it
        // would let the success rate hide the outages this system exists to detect.
        Assert.Equal(RunOutcome.InsufficientCoverage, RunOutcomeExtensions.RefineCoverageOutcome(
            new[] { RunOutcome.Cancelled, RunOutcome.Cancelled, RunOutcome.Cancelled }));

        // Locations that never reported say nothing either way and must not tip the balance.
        Assert.Equal(RunOutcome.InsufficientCoverage, RunOutcomeExtensions.RefineCoverageOutcome(
            new[] { RunOutcome.None, RunOutcome.None, RunOutcome.UpstreamStatus }));
        Assert.Equal(RunOutcome.InsufficientCoverage, RunOutcomeExtensions.RefineCoverageOutcome(
            new[] { RunOutcome.None, RunOutcome.None }));
    }
}
