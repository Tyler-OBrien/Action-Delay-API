using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using FluentResults;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IQueue : IAsyncDisposable, IDisposable
    {
        Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, Location location, CancellationToken token);
        Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, Location location, CancellationToken token, int secondsTimeout = 30);

        Task<Result<SerializablePingResponse>> Ping(NATSPingRequest request, Location location, CancellationToken token);


    }
}
