using Action_Delay_API_Core.Jobs.PropagationJobs;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace Action_Delay_API_Core_Tests.Jobs.PropogationJobs;

public class TestableBasePropagationJob : BasePropagationJob
{
    private readonly bool _shouldFailPrewarm;
    private readonly bool _shouldFailAction;
    private readonly bool _shouldFailRepeatableAction;
    private readonly bool _shouldDelayRunAction;
    private readonly Dictionary<string, bool> _locationResults = new();
    private int _repeatableActionCallCount = 0;

    public TestableBasePropagationJob(
        IOptions<LocalConfig> config,
        ILogger<BasePropagationJob> logger,
        IClickHouseService clickhouse,
        ActionDelayDatabaseContext context,
        IQueue queue,
        bool shouldFailPrewarm = false,
        bool shouldFailAction = false,
        bool shouldFailRepeatableAction = false,
        bool shouldDelayRunAction = false)
        : base(config, logger, clickhouse, context, queue)
    {
        _shouldFailPrewarm = shouldFailPrewarm;
        _shouldFailAction = shouldFailAction;
        _shouldFailRepeatableAction = shouldFailRepeatableAction;
        _shouldDelayRunAction = shouldDelayRunAction;
   
    }

    public override string Name => "Test Propagation Job";
    public override string InternalName => "test-prop-job";
    public override string JobType => "TestProp";
    public override string JobDescription => "Test Propagation Job Description";
    public override int TargetExecutionSecond => 10;
    public override bool Enabled => true;

    public TimeSpan repeatActionAfter = TimeSpan.FromSeconds(5);

    public override TimeSpan RepeatActionAfter => repeatActionAfter;

    public TimeSpan _cancelAfterHalfDone = TimeSpan.FromMinutes(5);

    public override TimeSpan CancelAfterIfHalfDone => _cancelAfterHalfDone;

    public int RepeatableActionCallCount => _repeatableActionCallCount;

    public void SetLocationResult(string locationName, bool success)
    {
        _locationResults[locationName] = success;
    }

    public override async Task PreWarmRunLocation(Location location)
    {
        if (_shouldFailPrewarm)
            throw new CustomAPIError("Prewarm failed");
        await Task.CompletedTask;
    }

    public override async Task RunAction()
    {
        if (_shouldFailAction)
            throw new CustomAPIError("Action failed");
        await Task.CompletedTask;
    }

    public override async Task RunRepeatableAction()
    {
        _repeatableActionCallCount++;
        if (_shouldFailRepeatableAction)
            throw new CustomAPIError("Repeatable action failed");
        await Task.CompletedTask;
    }

    public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
    {
        if (_shouldDelayRunAction)
            await Task.Delay(1000);
        if (_locationResults.TryGetValue(location.Name, out bool success))
        {
            return success
                ? new RunLocationResult(true, "Success", DateTime.UtcNow, 100, 1)
                : new RunLocationResult("Failed", null, -1);
        }
        return new RunLocationResult(true, "Success", DateTime.UtcNow, 100, 1);
    }

    public override Task HandleCompletion() => Task.CompletedTask;
}

public class PropagationJobTests : IDisposable
{
    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<BasePropagationJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly List<Location> _testLocations;

    public PropagationJobTests()
    {
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: $"TestPropDb_{Guid.NewGuid()}")
            .Options;
        _context = new ActionDelayDatabaseContext(_dbContextOptions);

        _testLocations = new List<Location>
        {
            new Location { Name = "location1", DisplayName = "Location 1", Disabled = false },
            new Location { Name = "location2", DisplayName = "Location 2", Disabled = false },
            new Location { Name = "location3", DisplayName = "Location 3", Disabled = true }
        };

        _configMock = new Mock<IOptions<LocalConfig>>();
        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = _testLocations
        });

        _loggerMock = new Mock<ILogger<BasePropagationJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();
    }

    [Fact]
    public async Task BaseRun_WithPrewarmFailure_ContinuesExecution()
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object, shouldFailPrewarm: true);

        // Act
        await job.BaseRun();

        // Assert
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == job.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData.CurrentRunStatus);
    }

    [Fact]
    public async Task BaseRun_PartialLocationSuccess_UpdatesStatusCorrectly()
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object);

        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", false);

        // Act
        await job.BaseRun();

        // Assert
        var locationData = await _context.JobLocations
            .Where(l => l.InternalJobName == job.InternalName)
            .ToListAsync();

        var location1Data = locationData.First(l => l.LocationName == "location1");
        var location2Data = locationData.First(l => l.LocationName == "location2");

        Assert.Equal(Status.STATUS_DEPLOYED, location1Data.CurrentRunStatus);
        Assert.Equal(Status.STATUS_ERRORED, location2Data.CurrentRunStatus);
    }

    [Fact]
    public async Task BaseRun_RepeatableAction_ExecutesMultipleTimes()
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object, shouldDelayRunAction: true)
        {
            repeatActionAfter = TimeSpan.FromMilliseconds(100),
        };


        // Set quick success for locations to allow repeatable action to run
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", true);

        // Act
        await job.BaseRun();

        // Wait a bit to allow multiple repeatable action executions
        await Task.Delay(TimeSpan.FromSeconds(6));

        // Assert
        Assert.True(job.RepeatableActionCallCount > 1,
            $"Expected multiple repeatable action calls, but got {job.RepeatableActionCallCount}");
    }

    [Fact]
    public async Task BaseRun_CancellationAfterHalfLocations_WorksCorrectly()
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object)
        {
            // Override to make test faster
            _cancelAfterHalfDone = TimeSpan.FromSeconds(1)
        };

        // Make one location succeed quickly and one hang
        job.SetLocationResult("location1", true);

        // Act
        await job.BaseRun();

        // Assert
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == job.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData.CurrentRunStatus);

        // Verify  insert run data
        _clickhouseMock.Verify(x => x.InsertRun(
            It.Is<ClickhouseJobRun>(r => r.RunStatus == Status.STATUS_DEPLOYED),
            It.IsAny<List<ClickhouseJobLocationRun>>(),
            It.IsAny<ClickhouseAPIError>(),
            It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Theory]
    [InlineData(0.1, 0.1)]  // First few seconds
    [InlineData(3, 0.25)]    // 2-5 seconds
    [InlineData(6, 0.5)]    // 5-30 seconds
    [InlineData(35, 0.5)]   // 30-60 seconds
    [InlineData(90, 2)]     // 60-120 seconds
    [InlineData(300, 10)]   // 120-600 seconds
    [InlineData(900, 15)]   // 600-1800 seconds
    [InlineData(2400, 30)]  // > 1800 seconds
    public void CalculateBackoff_ReturnsCorrectDelay(double totalWaitTimeInSeconds, double expectedDelayInSeconds)
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object);

        // Act
        var result = job.CalculateBackoff(totalWaitTimeInSeconds);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(expectedDelayInSeconds), result);
    }

    [Fact]
    public async Task BaseRun_DisabledLocations_AreSkipped()
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object);

        // Act
        await job.BaseRun();

        // Assert
        var locationData = await _context.JobLocations
            .Where(l => l.InternalJobName == job.InternalName)
            .ToListAsync();

        Assert.Equal(2, locationData.Count); // Only enabled locations
        Assert.DoesNotContain(locationData, l => l.LocationName == "location3");
    }

    [Fact]
    public async Task BaseRun_RepeatableActionFailure_ContinuesExecution()
    {
        // Arrange
        var job = new TestableBasePropagationJob(
            _configMock.Object, _loggerMock.Object, _clickhouseMock.Object,
            _context, _queueMock.Object, shouldDelayRunAction: true, shouldFailRepeatableAction: true)
        {
            repeatActionAfter = TimeSpan.FromMilliseconds(100),
        };

        // Set locations to succeed
        job.SetLocationResult("location1", true);
        job.SetLocationResult("location2", true);

        // Act
        await job.BaseRun();

        // Assert
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == job.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData.CurrentRunStatus);

        // Verify repeatable action was called despite failure
        Assert.True(job.RepeatableActionCallCount > 0);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}