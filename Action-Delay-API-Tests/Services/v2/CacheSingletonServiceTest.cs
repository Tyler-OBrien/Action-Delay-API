using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API.Services.v2;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Action_Delay_API_Tests.Services.v2;

public class CacheSingletonServiceTests : IDisposable
{
    private readonly ActionDelayDatabaseContext _dbContext;
    private readonly Mock<ILogger<CacheSingletonService>> _mockLogger;
    private readonly CacheSingletonService _service;
    private readonly CancellationToken _cancellationToken;

    public CacheSingletonServiceTests()
    {
        var options = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _dbContext = new ActionDelayDatabaseContext(options);
        _mockLogger = new Mock<ILogger<CacheSingletonService>>();
        _service = new CacheSingletonService(_dbContext, _mockLogger.Object);
        _cancellationToken = CancellationToken.None;

        // Reset static fields before each test
        CacheSingletonService.JOB_NAMES_LAST_CACHE = DateTime.MinValue;
        CacheSingletonService.LOCATION_NAMES_LAST_CACHE = DateTime.MinValue;
        CacheSingletonService.INTERNAL_JOB_NAME_TO_TYPE = null;
        CacheSingletonService.PUBLIC_TO_INTERNAL_NAMES = null;
        CacheSingletonService.RESOLVE_TYPE = null;
        CacheSingletonService.LOCATION_NAMES = null;
        CacheSingletonService.REGION_TO_LOCATION = null;

        // Seed test data
        SeedTestData();
    }

    private void SeedTestData()
    {
        var jobsData = new List<JobData>
        {
            new() { JobName = "Test Job 1", InternalJobName = "test-job-1", JobType = "Normal", JobDescription = "test"},
            new() { JobName = "Test Job 2", InternalJobName = "test-job-2", JobType = "Normal", JobDescription = "test" },
            new() { JobName = "AI Job", InternalJobName = "ai/test-job", JobType = "AI", JobDescription = "test" }
        };

        var locationData = new List<LocationData>
        {
            new() { LocationName = "Location1", Region = "Region1", FriendlyLocationName = "Location1, City, Country", ColoFriendlyLocationName = "Location1, City, Country", IATA = "XYZ", PathToCF = "IXP", Provider = "test"},
            new() { LocationName = "Location2", Region = "Region1", FriendlyLocationName = "Location1, City, Country", ColoFriendlyLocationName = "Location1, City, Country", IATA = "XYZ", PathToCF = "IXP", Provider = "test" },
            new() { LocationName = "Location3", Region = "Region2", FriendlyLocationName = "Location1, City, Country", ColoFriendlyLocationName = "Location1, City, Country", IATA = "XYZ", PathToCF = "IXP", Provider = "test" }
        };

        _dbContext.JobData.AddRange(jobsData);
        _dbContext.LocationData.AddRange(locationData);
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetInternalJobName_ExistingJob_ReturnsInternalName()
    {
        // Act
        var result = await _service.GetInternalJobName("Test Job 1", _cancellationToken);

        // Assert
        Assert.Equal("test-job-1", result);
    }

    [Fact]
    public async Task GetInternalJobName_NonExistentJob_ReturnsNull()
    {
        // Act
        var result = await _service.GetInternalJobName("Non Existent Job", _cancellationToken);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetInternalJobName_AIJobWithSlash_ReturnsCorrectName()
    {
        // Act
        var result = await _service.GetInternalJobName("ai%2Ftest-job", _cancellationToken);

        // Assert
        Assert.Equal("ai/test-job", result);
    }

    [Fact]
    public async Task GetJobType_ExistingType_ReturnsResolvedType()
    {
        // Act
        var result = await _service.GetJobType("Normal", _cancellationToken);

        // Assert
        Assert.Equal("Normal", result);
    }

    [Fact]
    public async Task GetJobType_NonExistingType_ReturnsOriginalType()
    {
        // Act
        var result = await _service.GetJobType("Unknown", _cancellationToken);

        // Assert
        Assert.Equal("Unknown", result);
    }

    [Fact]
    public async Task GetJobTypeFromName_ExistingJob_ReturnsCorrectType()
    {
        // Act
        var result = await _service.GetJobTypeFromName("Test Job 1", _cancellationToken);

        // Assert
        Assert.Equal("Normal", result);
    }

    [Fact]
    public async Task GetJobsByType_ExistingType_ReturnsMatchingJobs()
    {
        // Act
        var result = await _service.GetJobsByType("Normal", _cancellationToken);

        // Assert
        Assert.Equal(2, result.Length);
        Assert.Contains("test-job-1", result);
        Assert.Contains("test-job-2", result);
    }

    [Fact]
    public async Task GetJobsByType_NonExistentType_ReturnsEmptyArray()
    {
        // Act
        var result = await _service.GetJobsByType("Unknown", _cancellationToken);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetLocationNames_ReturnsAllLocations()
    {
        // Act
        var result = await _service.GetLocationNames(_cancellationToken);

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains("Location1", result);
        Assert.Contains("Location2", result);
        Assert.Contains("Location3", result);
    }

    [Fact]
    public async Task GetRegions_ReturnsCorrectLocationMapping()
    {
        // Act
        var result = await _service.GetRegions(_cancellationToken);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.True(result.ContainsKey("Region1"));
        Assert.True(result.ContainsKey("Region2"));
        Assert.Equal(2, result["Region1"].Length);
        Assert.Single(result["Region2"]);
    }

    [Fact]
    public async Task GetLocationsForRegion_ExistingRegion_ReturnsLocations()
    {
        // Act
        var result = await _service.GetLocationsForRegion("Region1", _cancellationToken);

        // Assert
        Assert.Equal(2, result.Length);
        Assert.Contains("Location1", result);
        Assert.Contains("Location2", result);
    }

    [Fact]
    public async Task GetLocationsForRegion_NonExistentRegion_ReturnsEmptyArray()
    {
        // Act
        var result = await _service.GetLocationsForRegion("NonExistentRegion", _cancellationToken);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task DoesLocationExist_ExistingLocation_ReturnsTrue()
    {
        // Act
        var result = await _service.DoesLocationExist("Location1", _cancellationToken);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task DoesLocationExist_NonExistentLocation_ReturnsFalse()
    {
        // Act
        var result = await _service.DoesLocationExist("NonExistentLocation", _cancellationToken);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task CacheInvalidation_JobNames_RefreshesAfter30Seconds()
    {
        // Arrange
        await _service.GetInternalJobName("Test Job 1", _cancellationToken); // Initial cache load
        CacheSingletonService.JOB_NAMES_LAST_CACHE = DateTime.UtcNow.AddSeconds(-31); // Force cache invalidation

        // Add new job to database
        var newJob = new JobData { JobName = "New Job", InternalJobName = "new-job", JobType = "Normal", JobDescription = "test"};
        _dbContext.JobData.Add(newJob);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetInternalJobName("New Job", _cancellationToken);

        // Assert
        Assert.Equal("new-job", result);
    }

    [Fact]
    public async Task CacheInvalidation_LocationNames_RefreshesAfter30Seconds()
    {
        // Arrange
        await _service.GetLocationNames(_cancellationToken); // Initial cache load
        CacheSingletonService.LOCATION_NAMES_LAST_CACHE = DateTime.UtcNow.AddSeconds(-31); // Force cache invalidation

        // Add new location to database
        var newLocation = new LocationData { LocationName = "NewLocation", Region = "Region1", FriendlyLocationName = "Location1, City, Country", ColoFriendlyLocationName = "Location1, City, Country", IATA = "XYZ", PathToCF = "IXP", Provider = "test" };
        _dbContext.LocationData.Add(newLocation);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetLocationNames(_cancellationToken);

        // Assert
        Assert.Contains("NewLocation", result);
    }


    [Fact]
    public async Task CacheCheck_LocationNames_NoRefreshesBefore30Seconds()
    {
        // Arrange
        await _service.GetLocationNames(_cancellationToken); // Initial cache load

        // Add new location to database
        var newLocation = new LocationData { LocationName = "NewLocation", Region = "Region1", FriendlyLocationName = "Location1, City, Country", ColoFriendlyLocationName = "Location1, City, Country", IATA = "XYZ", PathToCF = "IXP", Provider = "test" };
        _dbContext.LocationData.Add(newLocation);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetLocationNames(_cancellationToken);

        // Assert
        Assert.DoesNotContain("NewLocation", result);
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}