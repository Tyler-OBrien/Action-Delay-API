namespace Action_Delay_API_Core.Models.Jobs
{
    /// <summary>
    /// What actually happened to one location during one run, as opposed to
    /// <c>JobDataLocation.CurrentRunStatus</c>, which answers only "was it a success".
    /// </summary>
    /// <remarks>
    /// <para>
    /// The status column cannot be widened - eleven Grafana panels, the website, and the success-only
    /// materialized views all read its existing values - so this rides alongside it rather than
    /// replacing it. Status stays the compatibility surface; this is the truthful one.
    /// </para>
    /// <para>
    /// The governing rule is that a probe failure is <b>ours</b> until proven otherwise. Only
    /// <see cref="UpstreamStatus"/> and <see cref="UpstreamTimeout"/> count against the system being
    /// monitored, and both require positive evidence: a real status code, or a timeout we can pin on
    /// the target. Everything else is our own apparatus failing, and analytics can exclude it.
    /// </para>
    /// </remarks>
    public enum RunOutcome
    {
        /// <summary>Not yet determined. Never written - a location still holding this at emission
        /// time is recorded as <see cref="NoResult"/>.</summary>
        None = 0,

        /// <summary>The change was observed, or the probe succeeded.</summary>
        Deployed,

        /// <summary>The target returned a real status code indicating failure. Counts against it.</summary>
        UpstreamStatus,

        /// <summary>The target did not answer within the timeout. Counts against it.</summary>
        UpstreamTimeout,

        /// <summary>The worker ran but failed for a reason we cannot attribute to the target.</summary>
        ProbeFailed,

        /// <summary>We could not reach, or could not decode a reply from, our own worker.</summary>
        TransportFailed,

        /// <summary>The location never reached a terminal state during this run.</summary>
        NoResult,

        /// <summary>An unexpected exception in our own run loop.</summary>
        JobError,

        /// <summary>
        /// Still legitimately propagating when the job stopped waiting, once 80% of locations were
        /// done. A censored observation, not a failure - previously recorded as "Errored", which is
        /// the single biggest source of overstated failure in the existing data.
        /// </summary>
        Cancelled,

        /// <summary>Unclassified. Its presence in the data means a call site was missed.</summary>
        Unknown,

        /// <summary>Fewer than 75% of locations succeeded. Job rows only.</summary>
        InsufficientCoverage,

        /// <summary>
        /// Coverage was missed, but mostly because our own probes failed rather than because the
        /// change did not propagate. Job rows only, and the one job-level outcome that a success rate
        /// can legitimately exclude.
        /// </summary>
        ProbeDegraded,

        /// <summary>The provider API rejected the change. Job rows only.</summary>
        ApiError,
    }

    public static class RunOutcomeExtensions
    {
        /// <summary>
        /// The value stored in ClickHouse. These strings are the analytics contract and are matched
        /// verbatim in queries, so they must not be renamed once data exists.
        /// </summary>
        public static string ToColumnValue(this RunOutcome outcome) => outcome switch
        {
            RunOutcome.Deployed => "deployed",
            RunOutcome.UpstreamStatus => "upstream_status",
            RunOutcome.UpstreamTimeout => "upstream_timeout",
            RunOutcome.ProbeFailed => "probe_failed",
            RunOutcome.TransportFailed => "transport_failed",
            RunOutcome.NoResult => "no_result",
            RunOutcome.JobError => "job_error",
            RunOutcome.Cancelled => "cancelled",
            RunOutcome.InsufficientCoverage => "insufficient_coverage",
            RunOutcome.ProbeDegraded => "probe_degraded",
            RunOutcome.ApiError => "api_error",
            _ => "unknown",
        };

        /// <summary>
        /// True when the outcome is evidence about the monitored system rather than about us. This is
        /// the predicate the whole change exists to make expressible.
        /// </summary>
        public static bool IsAttributableToTarget(this RunOutcome outcome) =>
            outcome is RunOutcome.Deployed or RunOutcome.UpstreamStatus or RunOutcome.UpstreamTimeout;

        /// <summary>
        /// True when the failure was in our measuring apparatus: the probe itself, the transport to
        /// it, or our own run loop.
        /// </summary>
        /// <remarks>
        /// <para>
        /// This is deliberately <b>not</b> the inverse of <see cref="IsAttributableToTarget"/>.
        /// </para>
        /// <para>
        /// <see cref="RunOutcome.Cancelled"/> is neither. It means the job stopped waiting once 80%
        /// of locations were done while this one was still legitimately propagating - a censored
        /// observation about a slow target, not a broken probe. Counting it here would let a run that
        /// missed coverage purely because propagation was slow be excluded from the success rate,
        /// which would silently hide exactly the outages this system exists to detect.
        /// </para>
        /// <para>
        /// <see cref="RunOutcome.Unknown"/> is excluded for the opposite reason: it means a call site
        /// was missed, and guessing either way would bury that instead of surfacing it.
        /// </para>
        /// </remarks>
        public static bool IsOurFailure(this RunOutcome outcome) =>
            outcome is RunOutcome.ProbeFailed or RunOutcome.TransportFailed
                or RunOutcome.NoResult or RunOutcome.JobError;

        /// <summary>
        /// A run missed its coverage threshold - decide whether that was the monitored system failing
        /// to propagate (<see cref="RunOutcome.InsufficientCoverage"/>) or our own probes falling over
        /// (<see cref="RunOutcome.ProbeDegraded"/>), from what its locations concluded.
        /// </summary>
        /// <remarks>
        /// <para>
        /// The single copy of this rule. Every job family that can miss coverage calls it -
        /// <c>BasePropagationJob</c>, the four Perf jobs and the AI job - because the success rate can
        /// exclude <c>probe_degraded</c>, and a family that computed the split differently would make
        /// that exclusion mean different things for different jobs.
        /// </para>
        /// <para>
        /// Uses <see cref="IsOurFailure"/>, not the negation of <see cref="IsAttributableToTarget"/> -
        /// a run that missed coverage because locations were merely slow is full of
        /// <see cref="RunOutcome.Cancelled"/>, and that is a real propagation failure which must keep
        /// counting against the monitored system.
        /// </para>
        /// <para>
        /// Locations still holding <see cref="RunOutcome.None"/> are excluded: they never reported, and
        /// say nothing either way. Callers must therefore not substitute
        /// <see cref="RunOutcome.NoResult"/> for them before calling this.
        /// </para>
        /// </remarks>
        public static RunOutcome RefineCoverageOutcome(IEnumerable<RunOutcome> locationOutcomes)
        {
            var notDeployed = locationOutcomes
                .Where(outcome => outcome != RunOutcome.None && outcome != RunOutcome.Deployed)
                .ToList();
            if (notDeployed.Count == 0) return RunOutcome.InsufficientCoverage;

            var ours = notDeployed.Count(outcome => outcome.IsOurFailure());
            return ours > notDeployed.Count / 2
                ? RunOutcome.ProbeDegraded
                : RunOutcome.InsufficientCoverage;
        }
    }
}
