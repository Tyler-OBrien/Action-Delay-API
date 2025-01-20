using System.Net;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Models.Services.ClickHouse;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API.Services.v2;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Action_Delay_API_Tests.Services.v2;

public class AnalyticsServiceTests
{
    private readonly Mock<ICacheSingletonService> _mockCacheService;
    private readonly Mock<IClickHouseService> _mockClickHouseService;
    private readonly ActionDelayDatabaseContext _dbContext;
    private readonly Mock<ILogger<AnalyticsService>> _mockLogger;
    private readonly AnalyticsService _service;
    private readonly CancellationToken _cancellationToken;

    public AnalyticsServiceTests()
    {
        // Setup DbContext with mock sets
        var options = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _dbContext = new ActionDelayDatabaseContext(options);

        // Setup other mocks
        _mockCacheService = new Mock<ICacheSingletonService>();
        _mockClickHouseService = new Mock<IClickHouseService>();
        _mockLogger = new Mock<ILogger<AnalyticsService>>();

        // Seed test data
        var jobData = new JobData
        {
            InternalJobName = "internal-test-job",
            CurrentRunStatus = "Running",
            CurrentRunLengthMs = 1000,
            CurrentRunTime = DateTime.UtcNow,
            JobDescription = "test",
            JobName = "test",
            JobType = "test"
        };
        _dbContext.JobData.Add(jobData);

        var jobError = new JobError
        {
            ErrorHash = "hash1",
            ErrorType = "TestError",
            ErrorDescription = "Test description",
            FirstSeen = DateTime.Now,
            FirstService = "yes"
        };
        _dbContext.JobErrors.Add(jobError);

        _dbContext.SaveChanges();

        _service = new AnalyticsService(
            _dbContext,
            _mockClickHouseService.Object,
            _mockLogger.Object,
            _mockCacheService.Object);
        _cancellationToken = CancellationToken.None;

        // Setup common mock behaviors
        _mockCacheService
            .Setup(s => s.GetInternalJobName(It.Is<string>(j => j == "test-job"), _cancellationToken))
            .ReturnsAsync("internal-test-job");

        _mockCacheService
            .Setup(s => s.GetJobTypeFromName(It.IsAny<string>(), _cancellationToken))
            .ReturnsAsync("Normal");

        _mockCacheService
            .Setup(s => s.DoesLocationExist(It.IsAny<string>(), _cancellationToken))
            .ReturnsAsync(true);

        _mockClickHouseService
            .Setup(s => s.GetNormalJobAnalytics(
                It.IsAny<string[]>(),
                It.IsAny<DateTime>(),
                It.IsAny<DateTime>(),
                It.IsAny<JobAnalyticsConfiguration>(),
                It.IsAny<int>(),
                It.IsAny<JobAnalyticsRequestOptions>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new NormalJobAnalytics { Points = new List<NormalJobAnalyticsPoint>() });
    }

    [Fact]
    public async Task GetJobAnalytics_ValidParameters_ReturnsSuccess()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow;
        var options = JobAnalyticsRequestOptions.AvgRunLength;

        // Act
        var result = await _service.GetJobAnalytics("test-job", startDate, endDate, options, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.NotNull(result.Value.Data);
    }

    [Fact]
    public async Task GetJobAnalytics_JobNotFound_ReturnsFailure()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow;
        var options = JobAnalyticsRequestOptions.AvgRunLength;

        // Act
        var result = await _service.GetJobAnalytics("non-existent-job", startDate, endDate, options, _cancellationToken);

        // Assert
        Assert.True(result.IsFailed);
        var error = result.Errors.First() as ErrorResponse;
        Assert.Equal(404, error.Error.Code);
        Assert.Equal("job_not_found", error.Error.Type);
    }

    [Theory]
    [InlineData(9)] // Too few points
    [InlineData(251)] // Too many points
    public async Task GetJobAnalytics_InvalidMaxPoints_ReturnsFailure(int maxPoints)
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow;
        var options = JobAnalyticsRequestOptions.AvgRunLength;

        // Act
        var result = await _service.GetJobAnalytics("test-job", startDate, endDate, options, _cancellationToken, maxPoints);

        // Assert
        Assert.True(result.IsFailed);
        var error = result.Errors.First() as ErrorResponse;
        Assert.Equal((int)HttpStatusCode.UnprocessableEntity, error.Error.Code);
    }

    [Fact]
    public async Task GetJobAnalyticsLocation_ValidParameters_ReturnsSuccess()
    {
        // Arrange
        var locationName = "test-location";
        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow;
        var options = JobAnalyticsRequestOptions.AvgRunLength;

        _mockClickHouseService
            .Setup(s => s.GetNormalJobLocationAnalytics(
                It.IsAny<string[]>(),
                It.IsAny<string[]>(),
                startDate,
                endDate,
                It.IsAny<JobAnalyticsConfiguration>(),
                100,
                options,
                _cancellationToken))
            .ReturnsAsync(new NormalJobAnalytics { Points = new List<NormalJobAnalyticsPoint>() });

        // Act
        var result = await _service.GetJobAnalyticsLocation("test-job", locationName, startDate, endDate, options, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.NotNull(result.Value.Data);
    }

    [Fact]
    public async Task GetErrorAnalyticsForJobType_ValidParameters_ReturnsSuccess()
    {
        // Arrange
        var jobType = "Normal";
        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow;

        _mockCacheService
            .Setup(s => s.GetJobsByType(jobType, _cancellationToken))
            .ReturnsAsync(new[] { "internal-test-job" });

        _mockClickHouseService
            .Setup(s => s.GetJobErrorAnalytics(
                It.IsAny<string[]>(),
                startDate,
                endDate,
                It.IsAny<JobAnalyticsConfiguration>(),
                100,
                _cancellationToken))
            .ReturnsAsync(new ErrorJobAnalytics
            {
                Points = new List<ErrorJobAnalyticsPoint>
                {
                    new ErrorJobAnalyticsPoint { ErrorHash = "hash1", JobName = "test"}
                }
            });

        // Act
        var result = await _service.GetErrorAnalyticsForJobType(jobType, startDate, endDate, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.NotNull(result.Value.Data);
        Assert.Contains("test", result.Value.Data.Points[0].JobName);
    }

    [Theory]
    [InlineData("2024-01-19", "2024-01-19")] // Same dates
    [InlineData("2024-01-20", "2024-01-19")] // End date before start date
    public async Task GetJobAnalytics_InvalidDateRange_ReturnsFailure(string startDateStr, string endDateStr)
    {
        // Arrange
        var startDate = DateTime.Parse(startDateStr);
        var endDate = DateTime.Parse(endDateStr);
        var options = JobAnalyticsRequestOptions.AvgRunLength;

        // Act
        var result = await _service.GetJobAnalytics("test-job", startDate, endDate, options, _cancellationToken);

        // Assert
        Assert.True(result.IsFailed);
        var error = result.Errors.First() as ErrorResponse;
        Assert.Equal((int)HttpStatusCode.UnprocessableEntity, error.Error.Code);
    }

    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}