using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services.v2;

public class LocationDataService : ILocationDataService
{
    private readonly ICacheSingletonService _cacheSingletonService;
    private readonly ActionDelayDatabaseContext _genericServersContext;

    private readonly ILogger _logger;


    public LocationDataService(ActionDelayDatabaseContext genericServersContext, ILogger<LocationDataService> logger,
        ICacheSingletonService cacheSingletonService)
    {
        _cacheSingletonService = cacheSingletonService;
        _genericServersContext = genericServersContext;
        _logger = logger;
    }


    public async Task<Result<DataResponse<LocationDataResponse[]>>> GetLocations(CancellationToken token)
    {
        return new DataResponse<LocationDataResponse[]>((await _genericServersContext.LocationData.ToListAsync(token))
            .Select(LocationDataResponse.FromLocationData).ToArray());
    }

    public async Task<Result<DataResponse<LocationDataResponse>>> GetLocation(string locationName,
        CancellationToken token)
    {
        if (await _cacheSingletonService.DoesLocationExist(locationName, token) == false)
            return Result.Fail(new ErrorResponse(404,
                "Could not find location", "location_not_found"));

        var tryGetLocation =
            await _genericServersContext.LocationData.FirstOrDefaultAsync(job => job.LocationName == locationName,
                token);
        if (tryGetLocation == null)
        {
            return Result.Fail(new ErrorResponse(404,
                "Could not find location", "location_not_found"));
        }

        return new DataResponse<LocationDataResponse>(LocationDataResponse.FromLocationData(tryGetLocation));
    }


    public async Task<Result<DataResponse<JobLocationDataResponse[]>>> GetLocationJobData(string jobName,
        CancellationToken token)
    {
        if (await _cacheSingletonService.DoesJobExist(jobName, token) == false)
            return Result.Fail(new ErrorResponse(404,
                "Could not find job", "job_not_found"));


        var getLocations = await _genericServersContext.JobLocations.Where(job => job.JobName == jobName)
            .ToListAsync(token);

        return new DataResponse<JobLocationDataResponse[]>(getLocations
            .Select(JobLocationDataResponse.FromJobLocationData).ToArray());
    }

    public async Task<Result<DataResponse<JobLocationDataResponse>>> GetLocationsJobData(string jobName,
        string locationName, CancellationToken token)
    {
        if (await _cacheSingletonService.DoesJobExist(jobName, token) == false)
            return Result.Fail(new ErrorResponse(404,
                "Could not find job", "job_not_found"));

        if (await _cacheSingletonService.DoesLocationExist(locationName, token) == false)
            return Result.Fail(new ErrorResponse(404,
                "Could not find location", "location_not_found"));

        var tryGetLocation =
            await _genericServersContext.JobLocations.FirstOrDefaultAsync(
                job => job.JobName == jobName && job.LocationName == locationName, token);
        if (tryGetLocation == null)
        {
            return Result.Fail(new ErrorResponse(404,
                "Could not find location job data", "job_location_not_found"));
        }

        return new DataResponse<JobLocationDataResponse>(JobLocationDataResponse.FromJobLocationData(tryGetLocation));
    }
}