using Action_Delay_API_Worker.Models.API.Request;
using Action_Delay_API_Worker.Models.API.Response;

namespace Action_Delay_API_Worker.Models.Services
{
    public interface IPingService
    {
        Task<SerializablePingResponse> PerformRequestAsync(SerializablePingRequest request);
    }
}
