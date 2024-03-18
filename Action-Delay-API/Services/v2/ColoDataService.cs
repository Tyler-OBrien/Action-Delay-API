using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Colos;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services.v2;

public class ColoDataService : IColoDataService
{
    private readonly ActionDelayDatabaseContext _genericServersContext;

    private readonly ILogger _logger;

    public ColoDataService(ActionDelayDatabaseContext genericServersContext, ILogger<ColoDataService> logger)
    {
        _genericServersContext = genericServersContext;
        _logger = logger;
    }

    public async Task<Result<DataResponse<ColoDataAPI[]>>> GetColos(CancellationToken token)
    {
        return new DataResponse<ColoDataAPI[]>((await _genericServersContext.ColoData.ToListAsync(token))
            .Select(ColoDataAPI.FromDB).ToArray());
    }

    public async Task<Result<DataResponse<ColoDataAPISimple[]>>> GetColosByIataList(CancellationToken token)
    {
        return new DataResponse<ColoDataAPISimple[]>((await _genericServersContext.ColoData.ToListAsync(token))
            .Select(ColoDataAPISimple.FromDB).ToArray());
    }


    public async Task<Result<DataResponse<Dictionary<string, string>>>> GetColosRegionColoName(CancellationToken token)
    {
        return new DataResponse<Dictionary<string, string>>((await _genericServersContext.ColoData.ToListAsync(token))
            .ToDictionary(data => data.IATA, data => data.CfRegionDo));
    }


    public async Task<Result<DataResponse<Dictionary<int, string>>>> GetColosRegionID(CancellationToken token)
    {
        return new DataResponse<Dictionary<int, string>>((await _genericServersContext.ColoData.ToListAsync(token))
            .ToDictionary(data => data.ColoId, data => data.CfRegionDo));
    }
}