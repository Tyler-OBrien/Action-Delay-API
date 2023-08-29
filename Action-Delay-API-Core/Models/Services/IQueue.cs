using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using FluentResults;

namespace Action_Delay_API_Core.Models.Services
{
    public interface IQueue
    {
        Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, string location, CancellationToken token);
        Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, string location, CancellationToken token);

    }
}
