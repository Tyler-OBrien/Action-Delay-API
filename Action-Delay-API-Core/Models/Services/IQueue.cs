using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using FluentResults;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IQueue : IAsyncDisposable, IDisposable
    {
        Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, string location, CancellationToken token);
        Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, string location, CancellationToken token);

    }
}
