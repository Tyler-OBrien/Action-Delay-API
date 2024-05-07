using Action_Delay_API_Core.Models.API.ColoAPI;
using FluentResults;

namespace Action_Delay_API_Core.Broker.ColoData
{
    public interface IColoDataBroker
    {
        Task<Result<ColoApiData>> GetColoData(CancellationToken token);
        Task<Result<MetalAPIData[]>> GetMetalData(CancellationToken token);
    }
}
