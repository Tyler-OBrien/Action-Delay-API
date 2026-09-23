using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Services.Locations;

namespace Action_Delay_API_Core_Tests.Services;

/// <summary>
/// BasePropagationJob keys three dictionaries on the Location object and Location has no
/// Equals/GetHashCode, so reference identity is the only thing keeping those lookups working
/// across a roster refresh.
/// </summary>
public class LocationRosterSnapshotTests
{
    private static List<Location> Roster() => new()
    {
        new Location { Name = "LAX", NetType = NetType.IPv4, Compression = true },
        new Location { Name = "CDG" },
        new Location { Name = "SIN", NATSName = "SIN-2" }
    };

    [Fact]
    public void Merge_ReusesEveryInstanceWhenNothingChanged()
    {
        var previous = Roster();
        var merged = LocationRosterSnapshot.Merge(previous, Roster());

        Assert.Equal(previous.Count, merged.Count);
        for (var i = 0; i < previous.Count; i++)
            Assert.Same(previous[i], merged[i]);
    }

    [Fact]
    public void Merge_ReplacesOnlyTheEntryThatActuallyChanged()
    {
        var previous = Roster();

        var incoming = Roster();
        incoming[1].Disabled = true;

        var merged = LocationRosterSnapshot.Merge(previous, incoming);

        Assert.Same(previous[0], merged[0]);
        Assert.NotSame(previous[1], merged[1]);
        Assert.True(merged[1].Disabled);
        Assert.Same(previous[2], merged[2]);
    }

    [Theory]
    [InlineData("NetType")]
    [InlineData("Compression")]
    [InlineData("NATSName")]
    [InlineData("DNSResolveOverride")]
    [InlineData("URL")]
    [InlineData("DisplayName")]
    public void Merge_TreatsAnyFieldChangeAsANewInstance(string field)
    {
        var previous = Roster();
        var incoming = Roster();

        switch (field)
        {
            case "NetType": incoming[0].NetType = NetType.IPv6; break;
            case "Compression": incoming[0].Compression = false; break;
            case "NATSName": incoming[0].NATSName = "changed"; break;
            case "DNSResolveOverride": incoming[0].DNSResolveOverride = "changed"; break;
            case "URL": incoming[0].URL = "https://changed/"; break;
            case "DisplayName": incoming[0].DisplayName = "changed"; break;
        }

        var merged = LocationRosterSnapshot.Merge(previous, incoming);

        Assert.NotSame(previous[0], merged[0]);
    }

    [Fact]
    public void Merge_KeepsIdentityStableAcrossManyUnchangedPolls()
    {
        // The realistic case: hundreds of polls a day, almost none of them changing anything.
        IReadOnlyList<Location> current = Roster();
        var original = current[0];

        for (var poll = 0; poll < 200; poll++)
            current = LocationRosterSnapshot.Merge(current, Roster());

        Assert.Same(original, current[0]);
    }

    [Fact]
    public void Merge_HandlesLocationsBeingAddedAndRemoved()
    {
        var previous = Roster();
        var incoming = new List<Location>
        {
            new() { Name = "LAX", NetType = NetType.IPv4, Compression = true },
            new() { Name = "NEW" }
        };

        var merged = LocationRosterSnapshot.Merge(previous, incoming);

        Assert.Equal(2, merged.Count);
        Assert.Same(previous[0], merged[0]);
        Assert.Equal("NEW", merged[1].Name);
    }

    [Fact]
    public void Merge_OnColdStartReturnsIncomingUntouched()
    {
        var incoming = Roster();

        Assert.Same(incoming, LocationRosterSnapshot.Merge(null, incoming));
        Assert.Same(incoming, LocationRosterSnapshot.Merge(new List<Location>(), incoming));
    }

    [Fact]
    public void Create_SplitsEnabledFromAll()
    {
        var all = Roster();
        all[1].Disabled = true;

        var snapshot = LocationRosterSnapshot.Create(all, RosterSource.RosterService);

        Assert.Equal(3, snapshot.All.Count);
        Assert.Equal(2, snapshot.Enabled.Count);
        Assert.DoesNotContain(snapshot.Enabled, location => location.Disabled);
    }
}
