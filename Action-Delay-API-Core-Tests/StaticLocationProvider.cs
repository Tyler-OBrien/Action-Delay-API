using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Services.Locations;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core_Tests;

/// <summary>
/// Serves a fixed roster, matching the behaviour Core has when the roster service is disabled.
/// Lets existing job tests keep asserting against LocalConfig.Locations.
/// </summary>
public class StaticLocationProvider : ILocationProvider
{
    private readonly IReadOnlyList<Location> _locations;

    public StaticLocationProvider(IEnumerable<Location>? locations)
    {
        _locations = locations?.ToList() ?? new List<Location>();
    }

    public static StaticLocationProvider From(IOptions<LocalConfig> config) => new(config.Value?.Locations);

    public IReadOnlyList<Location> GetEnabledLocations() =>
        _locations.Where(location => location.Disabled == false).ToList();

    public IReadOnlyList<Location> GetAllLocations() => _locations;

    public LocationRosterSnapshot GetSnapshot() =>
        LocationRosterSnapshot.Create(_locations, RosterSource.Configuration);
}
