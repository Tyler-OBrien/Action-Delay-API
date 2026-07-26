namespace Action_Delay_API_Core.Models.Local
{
    /// <summary>
    /// Points Core at the machine-local health check service for its roster. Ships off: when off,
    /// the provider serves <see cref="LocalConfig.Locations"/> and behaviour is identical to before
    /// this existed. <see cref="LocalConfig.Locations"/> is required either way - it is the fallback.
    /// </summary>
    public class LocationRosterConfig
    {
        /// <summary>
        /// Take the roster from the machine-local health check service. Off by default, so Core uses
        /// its own configured Locations until an operator opts in per machine.
        /// </summary>
        public bool UseHealthCheckConfig { get; set; }

        /// <summary>The producer's lean consumer route. /internal/locations serves the same
        /// roster plus per-location probe diagnostics, which nothing here reads.</summary>
        public string Endpoint { get; set; } = "http://127.0.0.1:5199/locations";

        public int PollSeconds { get; set; } = 20;

        /// <summary>
        /// How long startup keeps retrying before falling back to the configured roster. Worth more
        /// than a moment: Core and the health check service usually start together, so the roster is
        /// often still warming up. The background poll keeps trying regardless, so this only bounds
        /// how long boot is delayed.
        /// </summary>
        public int StartupTimeoutSeconds { get; set; } = 30;

        /// <summary>Past this we complain loudly but keep serving.</summary>
        public int MaxRosterAgeSeconds { get; set; } = 300;

        /// <summary>
        /// Past this a payload is too old to act on, so it is rejected and whatever we already had
        /// is kept. Only a Core that has never had a good roster falls through to static config.
        /// </summary>
        public int HardMaxRosterAgeSeconds { get; set; } = 1800;

        public string? CachePath { get; set; }

        public string ResolvedCachePath => string.IsNullOrWhiteSpace(CachePath)
            ? Path.Combine(AppContext.BaseDirectory, "state", "location-roster.json")
            : CachePath;
    }
}
