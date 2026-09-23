using FluentResults;

namespace Action_Delay_API_Core.Models.Services
{
    /// <summary>
    /// Why a request to an edge worker failed, at the transport layer.
    /// </summary>
    /// <remarks>
    /// None of these say anything about the system being monitored - they are all failures of our own
    /// measuring apparatus, and analytics needs to be able to exclude them. Before this existed,
    /// <see cref="NATSQueue"/> collapsed connection loss, no-responders, request timeout, decompression
    /// failure and deserialization failure into the single string "NATS Connection Failed", which made
    /// an offline worker indistinguishable from a Cloudflare outage.
    /// </remarks>
    public enum QueueErrorKind
    {
        /// <summary>Nothing is subscribed to the subject - the worker at that location is not running.</summary>
        NoResponders,

        /// <summary>The worker did not reply within the request deadline.</summary>
        Timeout,

        /// <summary>A reply arrived but could not be decompressed or deserialized.</summary>
        Decode,

        /// <summary>The outgoing payload could not be compressed. Never leaves this process.</summary>
        Compress,

        /// <summary>Could not reach the broker at all.</summary>
        Connection,

        /// <summary>The transport in use does not support this kind of request.</summary>
        Unsupported,

        /// <summary>The worker replied, but the reply itself carried an error.</summary>
        WorkerError,
    }

    /// <summary>
    /// A <see cref="Result"/> failure carrying a <see cref="QueueErrorKind"/> alongside its message,
    /// so callers can classify without parsing the message text.
    /// </summary>
    public sealed class QueueError : Error
    {
        public QueueError(QueueErrorKind kind, string message) : base(message)
        {
            Kind = kind;
            Metadata["QueueErrorKind"] = kind;
        }

        public QueueErrorKind Kind { get; }

        /// <summary>
        /// The kind carried by the first <see cref="QueueError"/> in <paramref name="errors"/>, or
        /// null when the failure came from somewhere that has not been typed yet.
        /// </summary>
        public static QueueErrorKind? KindOf(IEnumerable<IError>? errors)
        {
            if (errors == null) return null;
            foreach (var error in errors)
            {
                if (error is QueueError queueError) return queueError.Kind;
                var nestedKind = KindOf(error.Reasons);
                if (nestedKind != null) return nestedKind;
            }
            return null;
        }
    }
}
