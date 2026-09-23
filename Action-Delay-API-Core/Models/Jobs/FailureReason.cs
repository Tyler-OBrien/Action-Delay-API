using System.Net;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;

namespace Action_Delay_API_Core.Models.Jobs
{
    /// <summary>
    /// The sub-classification stored beside <see cref="RunOutcome"/>, answering "why" once the
    /// outcome has answered "whose fault".
    /// </summary>
    /// <remarks>
    /// <b>This set is closed on purpose.</b> The column is <c>LowCardinality(String)</c> on a table
    /// taking millions of rows a day; that encoding only works while the distinct count stays tiny,
    /// and a single free-text value leaking in would degrade it for every row in the part. Every
    /// entry point runs through <see cref="Sanitize"/>, which folds anything unrecognised into
    /// <see cref="Other"/> rather than trusting the caller.
    /// <para>
    /// Exact HTTP status codes are deliberately absent - <c>api_errors.error_type</c> already stores
    /// them, and putting them here would be both duplicated and unbounded.
    /// </para>
    /// </remarks>
    public static class FailureReason
    {
        public const string None = "";

        // Transport: we never got a usable answer from our own worker.
        public const string NoResponders = "no_responders";
        public const string Timeout = "timeout";
        public const string Decode = "decode";
        public const string Compress = "compress";
        public const string Connection = "connection";
        public const string Unsupported = "unsupported";
        public const string WorkerError = "worker_error";

        // Probe: the worker ran and told us why it could not finish.
        public const string Internal = "internal";
        public const string Connect = "connect";
        public const string Dns = "dns";
        public const string Tls = "tls";
        public const string Protocol = "protocol";
        public const string BodyTooLarge = "body_too_large";
        public const string LegacyProxyFailure = "legacy_proxy_failure";

        // Upstream: the target itself gave us a definite negative.
        public const string Status4xx = "status_4xx";
        public const string Status5xx = "status_5xx";
        public const string StatusOther = "status_other";
        public const string DnsRcode = "dns_rcode";

        // Ours, structurally.
        public const string Cancelled = "cancelled";
        public const string NoResult = "no_result";
        public const string JobError = "job_error";

        /// <summary>Anything not in the closed set above.</summary>
        public const string Other = "other";

        private static readonly HashSet<string> Known = new(StringComparer.Ordinal)
        {
            None, NoResponders, Timeout, Decode, Compress, Connection, Unsupported, WorkerError,
            Internal, Connect, Dns, Tls, Protocol, BodyTooLarge, LegacyProxyFailure,
            Status4xx, Status5xx, StatusOther, DnsRcode,
            Cancelled, NoResult, JobError, Other,
        };

        /// <summary>
        /// Folds an arbitrary string onto the closed set. This is the cardinality guard - call it on
        /// anything that reaches the column, however trustworthy the caller looks.
        /// </summary>
        public static string Sanitize(string? reason)
        {
            if (string.IsNullOrEmpty(reason)) return None;
            return Known.Contains(reason) ? reason : Other;
        }

        /// <summary>Maps a transport failure onto its reason.</summary>
        public static string FromQueueErrorKind(QueueErrorKind kind) => kind switch
        {
            QueueErrorKind.NoResponders => NoResponders,
            QueueErrorKind.Timeout => Timeout,
            QueueErrorKind.Decode => Decode,
            QueueErrorKind.Compress => Compress,
            QueueErrorKind.Connection => Connection,
            QueueErrorKind.Unsupported => Unsupported,
            QueueErrorKind.WorkerError => WorkerError,
            _ => Other,
        };

        /// <summary>
        /// Maps a worker-reported <see cref="ProbeFailureKind"/> onto its reason. An empty kind means
        /// a worker predating that field, which is worth naming so fleet rollout is visible.
        /// </summary>
        public static string FromProbeFailureKind(string? probeFailureKind) => probeFailureKind switch
        {
            ProbeFailureKind.Timeout => Timeout,
            ProbeFailureKind.Connect => Connect,
            ProbeFailureKind.Dns => Dns,
            ProbeFailureKind.Tls => Tls,
            ProbeFailureKind.Protocol => Protocol,
            ProbeFailureKind.BodyTooLarge => BodyTooLarge,
            ProbeFailureKind.Internal => Internal,
            // The constant and the reason are the same literal, but Core is what substitutes it, so
            // it can arrive already spelled out as well as absent. Both mean the same thing.
            ProbeFailureKind.Legacy => LegacyProxyFailure,
            null or "" => LegacyProxyFailure,
            _ => Other,
        };

        /// <summary>Buckets a status code, so cardinality stays at three instead of hundreds.</summary>
        public static string FromStatusCode(HttpStatusCode statusCode) => (int)statusCode switch
        {
            >= 400 and < 500 => Status4xx,
            >= 500 and < 600 => Status5xx,
            _ => StatusOther,
        };
    }
}
