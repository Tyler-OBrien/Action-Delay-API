using Action_Delay_API.Models.API.Responses.DTOs.v2.Colos;
using Action_Delay_API.Models.API.Responses;
using FluentResults;

namespace Action_Delay_API.Models.Services.v2
{
    public interface IColoDataService
    {
        public Task<Result<DataResponse<ColoDataAPI[]>>> GetColos(CancellationToken token);
        public Task<Result<DataResponse<ColoDataAPISimple[]>>> GetColosByIataList(CancellationToken token);


        public Task<Result<DataResponse<Dictionary<string, string>>>> GetColosRegionColoName(
            CancellationToken token);

        public Task<Result<DataResponse<Dictionary<int, string>>>> GetColosRegionID(CancellationToken token);
    }
}
