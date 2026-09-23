namespace Action_Delay_API_Core.Models.NATS.Responses
{
    /// <summary>
    /// Why a probe failed, as reported by the worker that ran it. Mirrors the worker-side copy in
    /// <c>Action-Delay-API-Worker/Models/API/Response/ProbeFailureKind.cs</c> - the probe response
    /// models are hand-duplicated across projects rather than shared, so both sides move together.
    /// </summary>
    /// <remarks>
    /// The point of this is that <c>ProxyFailure</c> alone cannot answer "was that our fault?". It is
    /// set both when the target failed to answer in time and when the worker itself threw, and those
    /// lead to opposite conclusions about the system being measured.
    /// </remarks>
    public static class ProbeFailureKind
    {
        /// <summary>Target did not respond within the requested timeout. Evidence about the target.</summary>
        public const string Timeout = "timeout";

        /// <summary>Could not open a connection (refused, unreachable, reset).</summary>
        public const string Connect = "connect";

        /// <summary>Name resolution failed before a connection was attempted.</summary>
        public const string Dns = "dns";

        /// <summary>TLS handshake or certificate validation failed.</summary>
        public const string Tls = "tls";

        /// <summary>Target spoke malformed or unexpected HTTP. Reached it, could not parse it.</summary>
        public const string Protocol = "protocol";

        /// <summary>The response exceeded the limit the worker chose to read. Our constraint.</summary>
        public const string BodyTooLarge = "body_too_large";

        /// <summary>Unhandled exception inside the worker. Always our fault.</summary>
        public const string Internal = "internal";

        /// <summary>
        /// A probe failure from a worker that predates <c>FailureKind</c>. Not sent on the wire -
        /// Core substitutes it so the rollout is visible in the data: while any of these are still
        /// being recorded, part of the fleet has not been upgraded.
        /// </summary>
        public const string Legacy = "legacy_proxy_failure";

        /// <summary>True when the worker reported a failure but told us nothing about why.</summary>
        public static bool IsLegacy(string? failureKind) => string.IsNullOrEmpty(failureKind);
    }
}
