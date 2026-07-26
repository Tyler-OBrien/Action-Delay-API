using Action_Delay_API_Core.Models.Local;

namespace Action_Delay_API_Core.Services.Locations
{
    public interface ILocationProvider
    {
        /// <summary>Locations jobs should fan out to.</summary>
        IReadOnlyList<Location> GetEnabledLocations();

        /// <summary>Everything configured, including disabled entries.</summary>
        IReadOnlyList<Location> GetAllLocations();

        LocationRosterSnapshot GetSnapshot();
    }
}
