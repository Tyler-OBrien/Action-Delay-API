using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Database.Postgres;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Action_Delay_API.Services.v2;

public class CacheSingletonService : ICacheSingletonService
{
    public readonly ActionDelayDatabaseContext _genericServersContext;

    public readonly ILogger _logger;


    public static Dictionary<string, string> RESOLVE_TYPE;


    public static Dictionary<string, string> INTERNAL_JOB_NAME_TO_TYPE;
    public static Dictionary<string, string> PUBLIC_TO_INTERNAL_NAMES;

    public static Dictionary<string, string[]> REGION_TO_LOCATION;

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
        Interlocked.Exchange(ref INTERNAL_JOB_NAME_TO_TYPE, jobs.DistinctBy(job => job.JobName).ToDictionary(job => job.InternalJobName, job => job.JobType));
        Interlocked.Exchange(ref PUBLIC_TO_INTERNAL_NAMES, jobs.DistinctBy(job => job.JobName).ToDictionary(job => job.JobName, job => job.InternalJobName));
        Interlocked.Exchange(ref RESOLVE_TYPE, jobs.DistinctBy(job => job.JobType).ToDictionary(job => job.JobType, job => job.JobType, StringComparer.OrdinalIgnoreCase));

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

        if (INTERNAL_JOB_NAME_TO_TYPE.ContainsKey(jobName)) return jobName;
        if (INTERNAL_JOB_NAME_TO_TYPE.ContainsKey(jobName.Replace("%2F", "/"))) return jobName.Replace("%2F", "/"); // try ai variant

        if (PUBLIC_TO_INTERNAL_NAMES.TryGetValue(jobName, out var internalName)) return internalName;
        if (PUBLIC_TO_INTERNAL_NAMES.TryGetValue(jobName.Replace("%2F", "/"), out var internalNameai)) return internalNameai; // try ai variant
        return null;

    }

    public async ValueTask<string> GetJobType(string jobType, CancellationToken token)
    {
        await CacheJobNames(token);

        if (RESOLVE_TYPE.TryGetValue(jobType, out var resolvedType)) return resolvedType;

        return jobType;
    }

    public async ValueTask<string?> ResolveJobType(string jobType, CancellationToken token)
    {
        await CacheJobNames(token);

        if (RESOLVE_TYPE.TryGetValue(jobType, out var resolvedType)) return resolvedType;

        return null;
    }

    public async ValueTask<string?> GetJobTypeFromName(string jobName, CancellationToken token)
    {
        await CacheJobNames(token);

        if (PUBLIC_TO_INTERNAL_NAMES.TryGetValue(jobName, out var internalName))
        {
            if (INTERNAL_JOB_NAME_TO_TYPE.TryGetValue(internalName, out var foundInternalJobType))
                return foundInternalJobType;
        }


        if (INTERNAL_JOB_NAME_TO_TYPE.TryGetValue(jobName, out var foundJobType))
            return foundJobType;
        return null;
    }

    public string? GetJobTypeFromNameSync(string jobName, CancellationToken token)
    {

        if (PUBLIC_TO_INTERNAL_NAMES.TryGetValue(jobName, out var internalName))
        {
            if (INTERNAL_JOB_NAME_TO_TYPE.TryGetValue(internalName, out var foundInternalJobType))
                return foundInternalJobType;
        }


        if (INTERNAL_JOB_NAME_TO_TYPE.TryGetValue(jobName, out var foundJobType))
            return foundJobType;
        return null;
    }

    public async ValueTask<string[]> GetJobsByType(string jobType, CancellationToken token)
    {
        await CacheJobNames(token);


        var getjobs =
            INTERNAL_JOB_NAME_TO_TYPE.Where(jobKvp => jobKvp.Value.Equals(jobType, StringComparison.OrdinalIgnoreCase)).Select(job => job.Key);

        return getjobs.ToArray();

    }

    public void CacheLocationNames(List<LocationData> locationNames)

    {
        Interlocked.Exchange(ref LOCATION_NAMES, new HashSet<string>(locationNames.Select(location => location.LocationName )));
        Interlocked.Exchange(ref REGION_TO_LOCATION,
            locationNames.GroupBy(loc => loc.FriendlyRegionName.ToLower()).ToDictionary(keyKvp => keyKvp.Key,
                elementKvp => elementKvp.Select(data => data.LocationName).ToArray())); 
        LOCATION_NAMES_LAST_CACHE = DateTime.UtcNow;
    }

    public async ValueTask<HashSet<string>> GetLocationNames(CancellationToken token)
    {
        if ((DateTime.UtcNow - LOCATION_NAMES_LAST_CACHE).TotalSeconds > 30)
        {
            // new
            CacheLocationNames(await _genericServersContext.LocationData
                .ToListAsync(token));
        }

        return LOCATION_NAMES;
    }

    public async ValueTask<Dictionary<string, string[]>> GetRegions(CancellationToken token)
    {
        if ((DateTime.UtcNow - LOCATION_NAMES_LAST_CACHE).TotalSeconds > 30)
        {
            // new
            CacheLocationNames(await _genericServersContext.LocationData
                .ToListAsync(token));
        }

        return REGION_TO_LOCATION;
    }

    public async ValueTask<string[]> GetLocationsForRegion(string regionName, CancellationToken token)
    {
        var getLocs = await GetRegions(token);

        if (getLocs.TryGetValue(regionName, out var locs))
            return locs;

        return Array.Empty<string>();

    }


    public async ValueTask<bool> DoesLocationExist(string locationName, CancellationToken token)
    {
        return (await GetLocationNames(token)).Contains(locationName);
    }
}