namespace Action_Delay_API_Worker.Models.API.Response
{
    /// <summary>
    /// Why a probe failed, as reported by the worker that ran it.
    /// <para>
    /// This exists so Core can tell a failure of the thing being measured apart from a failure of the
    /// measuring apparatus. <c>ProxyFailure</c> alone cannot: it is set both when the target did not
    /// answer in time and when this worker threw, and those are opposite conclusions.
    /// </para>
    /// <para>
    /// Wire contract: the string travels as an optional field. Absent means a worker predating this,
    /// and Core falls back to the old <c>ProxyFailure</c> behaviour. Values must stay a small closed
    /// set - Core stores them in a <c>LowCardinality(String)</c> column at millions of rows a day.
    /// </para>
    /// </summary>
    public static class ProbeFailureKind
    {
        /// <summary>Target did not respond within the requested timeout. Evidence about the target,
        /// not about us, so this is deliberately not a <c>ProxyFailure</c>.</summary>
        public const string Timeout = "timeout";

        /// <summary>Could not open a connection (refused, unreachable, reset).</summary>
        public const string Connect = "connect";

        /// <summary>Name resolution failed before a connection was attempted.</summary>
        public const string Dns = "dns";

        /// <summary>TLS handshake or certificate validation failed.</summary>
        public const string Tls = "tls";

        /// <summary>Target spoke malformed or unexpected HTTP. Reached it, could not parse it.</summary>
        public const string Protocol = "protocol";

        /// <summary>The response exceeded the limit we chose to read. Our constraint, our fault.</summary>
        public const string BodyTooLarge = "body_too_large";

        /// <summary>Unhandled exception inside this worker. Always our fault.</summary>
        public const string Internal = "internal";
    }
}
