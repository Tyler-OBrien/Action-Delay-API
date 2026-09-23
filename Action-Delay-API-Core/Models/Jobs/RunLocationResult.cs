using System.Net;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;

namespace Action_Delay_API_Core.Models.Jobs
{
    public class RunLocationResult
    {
        public RunLocationResult(bool done, string reason, DateTime? resultUtc, double? responseTimeMs, int coloId)
        {
            Done = done;
            Reason = reason;
            ResultUtc = resultUtc;
            ResponseTimeMs = responseTimeMs;
            ColoId = coloId;
            Outcome = done ? RunOutcome.Deployed : RunOutcome.None;
        }

        /// <summary>
        /// Legacy error constructor. Kept so a call site missed during the sweep still compiles - it
        /// records <see cref="RunOutcome.Unknown"/>, which shows up in the data as a gap to close
        /// rather than being silently filed under the wrong cause.
        /// </summary>
        public RunLocationResult(string exception, double? responseTimeMs, int coloId)
        {
            Errored = true;
            Done = false;
            Reason = exception;
            ResponseTimeMs = responseTimeMs;
            ColoId = coloId;
            Outcome = RunOutcome.Unknown;
            FailureReasonCode = FailureReason.Other;
        }

        private RunLocationResult(RunOutcome outcome, string reason, string failureReasonCode,
            double? responseTimeMs, int coloId)
        {
            Errored = true;
            Done = false;
            Reason = reason;
            ResponseTimeMs = responseTimeMs;
            ColoId = coloId;
            Outcome = outcome;
            FailureReasonCode = FailureReason.Sanitize(failureReasonCode);
        }

        public bool Done { get; set; }

        public string Reason { get; set; }

        public bool Errored { get; set; }

        public DateTime? ResultUtc { get; set; }

        public double? ResponseTimeMs { get; set; }

        public int ColoId { get; set; }

        /// <summary>What actually happened, for analytics. See <see cref="RunOutcome"/>.</summary>
        public RunOutcome Outcome { get; set; }

        /// <summary>Bounded sub-classification. Always a <see cref="FailureReason"/> value.</summary>
        public string FailureReasonCode { get; set; } = FailureReason.None;

        /// <summary>
        /// The request never produced a usable answer from our own edge worker. Never attributed to
        /// the monitored system: an offline worker says nothing about Cloudflare or Bunny.
        /// </summary>
        public static RunLocationResult TransportFailure(IEnumerable<IError>? errors, double? responseTimeMs, int coloId)
        {
            var kind = QueueError.KindOf(errors);
            var reasonCode = kind.HasValue ? FailureReason.FromQueueErrorKind(kind.Value) : FailureReason.Other;
            var message = errors?.FirstOrDefault()?.Message ?? "Queue Error";
            return new RunLocationResult(RunOutcome.TransportFailed, message, reasonCode, responseTimeMs, coloId);
        }

        /// <summary>
        /// Classifies a non-success HTTP probe. This is the one place the attribution rule lives:
        /// blame reaches the target only on a real status code, or on a timeout the worker pinned on
        /// it. A <c>ProxyFailure</c> without that evidence stays ours.
        /// </summary>
        public static RunLocationResult FromProbe(SerializableHttpResponse response, double? responseTimeMs, int coloId)
        {
            if (response.FailureKind == ProbeFailureKind.Timeout)
                return new RunLocationResult(RunOutcome.UpstreamTimeout, response.Info ?? "Timeout",
                    FailureReason.Timeout, responseTimeMs, coloId);

            if (response.ProxyFailure)
                return new RunLocationResult(RunOutcome.ProbeFailed, response.Info ?? "Proxy Failure",
                    FailureReason.FromProbeFailureKind(response.FailureKind), responseTimeMs, coloId);

            // Not a proxy failure and not a timeout: the target answered, and the answer was bad.
            return new RunLocationResult(RunOutcome.UpstreamStatus,
                response.Info ?? $"HTTP {(int)response.StatusCode}",
                FailureReason.FromStatusCode(response.StatusCode), responseTimeMs, coloId);
        }

        /// <summary>
        /// As <see cref="FromProbe(SerializableHttpResponse,double?,int)"/>, for DNS probes. A returned
        /// rcode is an answer from the resolver, so it is attributed to the target.
        /// </summary>
        public static RunLocationResult FromProbe(SerializableDNSResponse response, double? responseTimeMs, int coloId)
        {
            if (response.FailureKind == ProbeFailureKind.Timeout)
                return new RunLocationResult(RunOutcome.UpstreamTimeout, response.Info ?? "Timeout",
                    FailureReason.Timeout, responseTimeMs, coloId);

            if (response.ProxyFailure)
                return new RunLocationResult(RunOutcome.ProbeFailed, response.Info ?? "Proxy Failure",
                    FailureReason.FromProbeFailureKind(response.FailureKind), responseTimeMs, coloId);

            return new RunLocationResult(RunOutcome.UpstreamStatus,
                response.Info ?? response.ResponseCode ?? "DNS failure",
                FailureReason.DnsRcode, responseTimeMs, coloId);
        }

        /// <summary>
        /// The worker could not complete the probe for a reason we are not attributing to the target.
        /// For jobs that decide this themselves rather than reading it off a probe response.
        /// </summary>
        public static RunLocationResult ProbeFailure(string reasonCode, double? responseTimeMs, int coloId,
            string? message = null)
            => new(RunOutcome.ProbeFailed, message ?? "Proxy Failure", reasonCode, responseTimeMs, coloId);

        /// <summary>
        /// The monitored system gave a definite negative. Use only with real evidence - a status code
        /// from the target, not an inference.
        /// </summary>
        public static RunLocationResult UpstreamFailure(HttpStatusCode statusCode, double? responseTimeMs, int coloId,
            string? message = null)
            => new(RunOutcome.UpstreamStatus, message ?? $"HTTP {(int)statusCode}",
                FailureReason.FromStatusCode(statusCode), responseTimeMs, coloId);
    }
}
