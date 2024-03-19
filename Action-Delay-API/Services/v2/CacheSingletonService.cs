using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API.Services.v2;

public class CacheSingletonService : ICacheSingletonService
{
    public readonly ActionDelayDatabaseContext _genericServersContext;

    public readonly ILogger _logger;


    public static HashSet<string> INTERNAL_NAMES;
    public static Dictionary<string, string> PUBLIC_TO_INTERNAL_NAMES;
    public static DateTime JOB_NAMES_LAST_CACHE = DateTime.MinValue;


    public static HashSet<string> LOCATION_NAMES;
    public static DateTime LOCATION_NAMES_LAST_CACHE = DateTime.MinValue;

    public CacheSingletonService(ActionDelayDatabaseContext genericServersContext,
        ILogger<CacheSingletonService> logger)
    {
        _genericServersContext = genericServersContext;
        _logger = logger;
    }

    public void CacheJobNames(List<JobData> jobs)
    {
        Interlocked.Exchange(ref INTERNAL_NAMES, new HashSet<string>(jobs.Select(job => job.InternalJobName)));
        Interlocked.Exchange(ref PUBLIC_TO_INTERNAL_NAMES, jobs.DistinctBy(job => job.JobName).ToDictionary(job => job.JobName, job => job.InternalJobName));
        JOB_NAMES_LAST_CACHE = DateTime.UtcNow;
    }

    public async ValueTask CacheJobNames(CancellationToken token)
    {
        if ((DateTime.UtcNow - JOB_NAMES_LAST_CACHE).TotalSeconds > 30)
        {
            // new
            CacheJobNames(await _genericServersContext.JobData.ToListAsync(token));
        }

    }

    public async ValueTask<string?> GetInternalJobName(string jobName, CancellationToken token)
    {
        await CacheJobNames(token);

        if (INTERNAL_NAMES.Contains(jobName)) return jobName;

        if (PUBLIC_TO_INTERNAL_NAMES.TryGetValue(jobName, out var internalName)) return internalName;
        return null;

    }

    public void CacheLocationNames(IEnumerable<string> locationNames)

    {
        Interlocked.Exchange(ref LOCATION_NAMES, new HashSet<string>(locationNames));
        LOCATION_NAMES_LAST_CACHE = DateTime.UtcNow;
    }

    public async ValueTask<HashSet<string>> GetLocationNames(CancellationToken token)
    {
        if ((DateTime.UtcNow - LOCATION_NAMES_LAST_CACHE).TotalSeconds > 30)
        {
            // new
            CacheLocationNames(await _genericServersContext.JobLocations.Select(job => job.LocationName)
                .ToListAsync(token));
        }

        return LOCATION_NAMES;
    }

    public async ValueTask<bool> DoesLocationExist(string locationName, CancellationToken token)
    {
        return (await GetLocationNames(token)).Contains(locationName);
    }
}