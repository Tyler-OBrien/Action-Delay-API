using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services.v2;

public class CacheSingletonService : ICacheSingletonService
{
    public readonly ActionDelayDatabaseContext _genericServersContext;

    public readonly ILogger _logger;


    public HashSet<string> JOB_NAMES;
    public DateTime JOB_NAMES_LAST_CACHE = DateTime.MinValue;


    public HashSet<string> LOCATION_NAMES;
    public DateTime LOCATION_NAMES_LAST_CACHE = DateTime.MinValue;

    public CacheSingletonService(ActionDelayDatabaseContext genericServersContext,
        ILogger<CacheSingletonService> logger)
    {
        _genericServersContext = genericServersContext;
        _logger = logger;
    }

    public void CacheJobNames(IEnumerable<string> jobNames)
    {
        Interlocked.Exchange(ref JOB_NAMES, new HashSet<string>(jobNames));
        JOB_NAMES_LAST_CACHE = DateTime.UtcNow;
    }

    public async Task<HashSet<string>> GetJobNames(CancellationToken token)
    {
        if ((DateTime.UtcNow - JOB_NAMES_LAST_CACHE).TotalSeconds > 30)
        {
            // new
            CacheJobNames(await _genericServersContext.JobData.Select(job => job.JobName).ToListAsync(token));
        }

        return JOB_NAMES;
    }

    public async Task<bool> DoesJobExist(string jobName, CancellationToken token)
    {
        return (await GetJobNames(token)).Contains(jobName);
    }

    public void CacheLocationNames(IEnumerable<string> locationNames)

    {
        Interlocked.Exchange(ref LOCATION_NAMES, new HashSet<string>(locationNames));
        LOCATION_NAMES_LAST_CACHE = DateTime.UtcNow;
    }

    public async Task<HashSet<string>> GetLocationNames(CancellationToken token)
    {
        if ((DateTime.UtcNow - LOCATION_NAMES_LAST_CACHE).TotalSeconds > 30)
        {
            // new
            CacheLocationNames(await _genericServersContext.JobLocations.Select(job => job.LocationName)
                .ToListAsync(token));
        }

        return LOCATION_NAMES;
    }

    public async Task<bool> DoesLocationExist(string locationName, CancellationToken token)
    {
        return (await GetLocationNames(token)).Contains(locationName);
    }
}