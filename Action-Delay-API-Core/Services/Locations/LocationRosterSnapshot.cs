using Action_Delay_API_Core.Models.Local;

namespace Action_Delay_API_Core.Services.Locations
{
    public enum RosterSource
    {
        Configuration,
        RosterService,
        MemoryCache,
        DiskCache
    }

    public class LocationRosterSnapshot
    {
        public required IReadOnlyList<Location> All { get; init; }

        public required IReadOnlyList<Location> Enabled { get; init; }

        public RosterSource Source { get; init; }

        public DateTime? GeneratedAtUtc { get; init; }

        public DateTime FetchedAtUtc { get; init; } = DateTime.UtcNow;

        public bool IsStale { get; init; }

        public static LocationRosterSnapshot Create(IReadOnlyList<Location> all, RosterSource source,
            DateTime? generatedAtUtc = null, bool isStale = false) => new()
        {
            All = all,
            Enabled = all.Where(location => location.Disabled == false).ToList(),
            Source = source,
            GeneratedAtUtc = generatedAtUtc,
            IsStale = isStale
        };

        /// <summary>
        /// Reuses the previous <see cref="Location"/> instance whenever nothing about it changed.
        /// BasePropagationJob keys three dictionaries on the Location object and Location has no
        /// Equals/GetHashCode, so identity is all that keeps those lookups working across a refresh.
        /// Almost every poll changes nothing, so almost every instance survives.
        /// </summary>
        public static IReadOnlyList<Location> Merge(IReadOnlyList<Location>? previous, IReadOnlyList<Location> incoming)
        {
            if (previous is null || previous.Count == 0)
                return incoming;

            var byName = new Dictionary<string, Location>(StringComparer.OrdinalIgnoreCase);
            foreach (var location in previous)
                byName[location.Name] = location;

            var merged = new List<Location>(incoming.Count);
            foreach (var location in incoming)
                merged.Add(byName.TryGetValue(location.Name, out var existing) && AreEquivalent(existing, location)
                    ? existing
                    : location);

            return merged;
        }

        private static bool AreEquivalent(Location left, Location right) =>
            left.Disabled == right.Disabled &&
            left.NetType == right.NetType &&
            left.Compression == right.Compression &&
            string.Equals(left.Name, right.Name, StringComparison.Ordinal) &&
            string.Equals(left.NATSName, right.NATSName, StringComparison.Ordinal) &&
            string.Equals(left.URL, right.URL, StringComparison.Ordinal) &&
            string.Equals(left.DisplayName, right.DisplayName, StringComparison.Ordinal) &&
            string.Equals(left.DNSResolveOverride, right.DNSResolveOverride, StringComparison.Ordinal);
    }
}
