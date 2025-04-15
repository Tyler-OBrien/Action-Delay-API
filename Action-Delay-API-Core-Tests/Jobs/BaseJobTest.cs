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

namespace Action_Delay_API_Core_Tests.Jobs;



// Test implementation of BaseJob for testing
public class TestJob : BaseJob
{
    public TestJob(
        IOptions<LocalConfig> config,
        ILogger<BaseJob> logger,
        IClickHouseService clickhouse,
        ActionDelayDatabaseContext context,
        IQueue queue) : base(config, logger, clickhouse, context, queue)
    {
    }

    public override string Name => "Test Job";
    public override string InternalName => "test-job";
    public override string JobType => "Test";
    public override string JobDescription => "Test Job Description";
    public override int TargetExecutionSecond => 10;
    public override bool Enabled => true;

    private bool _shouldFail = false;
    public void SetShouldFail(bool shouldFail) => _shouldFail = shouldFail;

    public override async Task RunAction()
    {
        if (_shouldFail)
            throw new CustomAPIError("Test failure");

        await Task.CompletedTask;
    }
}

public class BaseJobTests : IDisposable
{
    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<BaseJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly TestJob _testJob;

    public BaseJobTests()
    {
        // Setup in-memory database
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;
        _context = new ActionDelayDatabaseContext(_dbContextOptions);

        // Setup mocks
        _configMock = new Mock<IOptions<LocalConfig>>();
        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
        });

        _loggerMock = new Mock<ILogger<BaseJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();

        // Create test job instance
        _testJob = new TestJob(
            _configMock.Object,
            _loggerMock.Object,
            _clickhouseMock.Object,
            _context,
            _queueMock.Object
        );
    }

    [Fact]
    public async Task BaseRun_Success_CreatesJobData()
    {
        // Arrange
        _testJob.SetShouldFail(false);

        // Act
        await _testJob.BaseRun();

        // Assert
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == _testJob.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(_testJob.Name, jobData.JobName);
        Assert.NotEqual(Status.STATUS_ERRORED, jobData.CurrentRunStatus);

    }

    [Fact]
    public async Task BaseRun_Failure_HandlesError()
    {
        // Arrange
        _testJob.SetShouldFail(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<CustomAPIError>(() => _testJob.BaseRun());

        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == _testJob.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_API_ERROR, jobData.CurrentRunStatus);

        _clickhouseMock.Verify(x => x.InsertRun(
            It.Is<ClickhouseJobRun>(r =>
                r.JobName == _testJob.InternalName &&
                r.RunStatus == Status.STATUS_API_ERROR),
            It.IsAny<List<ClickhouseJobLocationRun>>(),
            It.IsAny<ClickhouseAPIError>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }

    [Fact]
    public async Task TrySave_Success_SavesChanges()
    {
        // Arrange
        var jobData = new JobData
        {
            JobName = _testJob.Name,
            InternalJobName = _testJob.InternalName,
            CurrentRunStatus = Status.STATUS_PENDING,
            JobDescription = "Test",
            JobType = "test",
        };
        _context.JobData.Add(jobData);
        await _context.SaveChangesAsync();

        // Act
        jobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
        await _testJob.TrySave(true);

        // Assert
        var savedJobData = await _context.JobData.FirstAsync(j => j.InternalJobName == _testJob.InternalName);
        Assert.Equal(Status.STATUS_DEPLOYED, savedJobData.CurrentRunStatus);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}

// Test implementation of BasePropagationJob
public class TestPropagationJob : BasePropagationJob
{
    public TestPropagationJob(
        IOptions<LocalConfig> config,
        ILogger<BasePropagationJob> logger,
        IClickHouseService clickhouse,
        ActionDelayDatabaseContext context,
        IQueue queue) : base(config, logger, clickhouse, context, queue)
    {
    }

    public override string Name => "Test Propagation Job";
    public override string InternalName => "test-prop-job";
    public override string JobType => "TestProp";
    public override string JobDescription => "Test Propagation Job Description";
    public override int TargetExecutionSecond => 10;
    public override bool Enabled => true;

    private bool _shouldFailLocation = false;
    public void SetLocationShouldFail(bool shouldFail) => _shouldFailLocation = shouldFail;

    public override Task PreWarmRunLocation(Location location) => Task.CompletedTask;
    public override Task RunRepeatableAction() => Task.CompletedTask;

    public override async Task RunAction()
    {
        await Task.CompletedTask;
    }

    public override async Task<RunLocationResult> RunLocation(Location location, CancellationToken token)
    {
        if (_shouldFailLocation)
            return new RunLocationResult("Error", null, -1);

        return new RunLocationResult(true, "Success", DateTime.UtcNow, 100, 1);
    }

    public override Task HandleCompletion() => Task.CompletedTask;
}

public class BasePropagationJobTests : IDisposable
{
    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<BasePropagationJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly TestPropagationJob _testJob;

    public BasePropagationJobTests()
    {
        // Setup in-memory database
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: $"TestPropDb_{Guid.NewGuid()}")
            .Options;
        _context = new ActionDelayDatabaseContext(_dbContextOptions);

        // Setup mocks
        _configMock = new Mock<IOptions<LocalConfig>>();
        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = new List<Location>
            {
                new Location { Name = "test1", Disabled = false },
                new Location { Name = "test2", Disabled = false }
            }
        });

        _loggerMock = new Mock<ILogger<BasePropagationJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();

        _testJob = new TestPropagationJob(
            _configMock.Object,
            _loggerMock.Object,
            _clickhouseMock.Object,
            _context,
            _queueMock.Object
        );
    }

    [Fact]
    public async Task BaseRun_Success_HandlesAllLocations()
    {
        // Arrange
        _testJob.SetLocationShouldFail(false);

        // Act
        await _testJob.BaseRun();

        // Assert
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == _testJob.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData.CurrentRunStatus);

        var locationData = await _context.JobLocations
            .Where(l => l.InternalJobName == _testJob.InternalName)
            .ToListAsync();
        Assert.Equal(2, locationData.Count);
        Assert.All(locationData, l => Assert.Equal(Status.STATUS_DEPLOYED, l.CurrentRunStatus));
    }

    [Fact]
    public async Task BaseRun_PartialFailure_HandlesFailedLocations()
    {
        // Arrange
        _testJob.SetLocationShouldFail(true);

        // Act
        await _testJob.BaseRun();

        // Assert
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == _testJob.InternalName);
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_ERRORED, jobData.CurrentRunStatus);

        var locationData = await _context.JobLocations
            .Where(l => l.InternalJobName == _testJob.InternalName)
            .ToListAsync();
        Assert.Equal(2, locationData.Count);
        Assert.All(locationData, l => Assert.Equal(Status.STATUS_ERRORED, l.CurrentRunStatus));
    }

    [Theory]
    [InlineData(1801, 30)]  // > 1800 seconds -> 30 second delay
    [InlineData(601, 15)]   // > 600 seconds -> 15 second delay
    [InlineData(31, 0.5)]   // > 30 seconds -> 0.5 second delay
    [InlineData(1, 0.1)]    // <= 5 seconds -> 0.1 second delay
    public void CalculateBackoff_ReturnsExpectedDelay(double totalWaitTimeInSeconds, double expectedDelayInSeconds)
    {
        // Act
        var result = _testJob.CalculateBackoff(totalWaitTimeInSeconds);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(expectedDelayInSeconds), result);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}