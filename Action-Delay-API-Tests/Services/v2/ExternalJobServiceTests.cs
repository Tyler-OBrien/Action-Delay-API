using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Services.v2;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Action_Delay_API_Tests.Services.v2;

public class ExternalJobServiceTests : IDisposable
{
    private readonly ActionDelayDatabaseContext _dbContext;
    private readonly Mock<IClickHouseService> _mockClickHouseService;
    private readonly Mock<ILogger<ExternalJobService>> _mockLogger;
    private readonly ExternalJobService _service;
    private readonly CancellationToken _cancellationToken;

    public ExternalJobServiceTests()
    {
        var options = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new ActionDelayDatabaseContext(options);
        _mockClickHouseService = new Mock<IClickHouseService>();
        _mockLogger = new Mock<ILogger<ExternalJobService>>();

        _service = new ExternalJobService(
            _dbContext,
            _mockLogger.Object,
            _mockClickHouseService.Object);

        _cancellationToken = CancellationToken.None;

        SeedTestData();
    }

    private void SeedTestData()
    {
        var existingJob = new JobData
        {
            InternalJobName = "existing-job",
            JobName = "Existing Job",
            CurrentRunStatus = "Success",
            CurrentRunLengthMs = 1000,
            CurrentRunTime = DateTime.UtcNow.AddMinutes(-5),
            JobType = "Normal",
            JobDescription = "test",
        };

        _dbContext.JobData.Add(existingJob);
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task SendJobResult_NewJob_CreatesJobAndReturnsSuccess()
    {
        // Arrange
        var jobRequest = new JobResultRequestDTO
        {
            InternalJobName = "new-job",
            JobName = "New Job",
            RunStatus = "Success",
            RunLengthMs = 2000,
            RunTime = DateTime.UtcNow,
            APIResponseLatency = 100,
        };

        _mockClickHouseService
            .Setup(s => s.InsertRun(
                It.IsAny<ClickhouseJobRun>(),
                It.IsAny<List<ClickhouseJobLocationRun>>(),
                It.IsAny<ClickhouseAPIError?>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.SendJobResult(jobRequest, 1, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Value.Data);

        var savedJob = await _dbContext.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "new-job");
        Assert.NotNull(savedJob);
        Assert.Equal("New Job", savedJob.JobName);
        Assert.Equal("Success", savedJob.CurrentRunStatus);
        Assert.Equal(2000UL, savedJob.CurrentRunLengthMs);
    }

    [Fact]
    public async Task SendJobResult_ExistingJob_UpdatesJobAndReturnsSuccess()
    {
        // Arrange
        var jobRequest = new JobResultRequestDTO
        {
            InternalJobName = "existing-job",
            JobName = "Existing Job",
            RunStatus = "Running",
            RunLengthMs = 3000,
            RunTime = DateTime.UtcNow,
            APIResponseLatency = 150
        };

        _mockClickHouseService
            .Setup(s => s.InsertRun(
                It.IsAny<ClickhouseJobRun>(),
                It.IsAny<List<ClickhouseJobLocationRun>>(),
                It.IsAny<ClickhouseAPIError?>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.SendJobResult(jobRequest, 1, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Value.Data);

        var updatedJob = await _dbContext.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "existing-job");
        Assert.NotNull(updatedJob);
        Assert.Equal("Success", updatedJob.LastRunStatus);
        Assert.Equal("Running", updatedJob.CurrentRunStatus);
        Assert.Equal(3000UL, updatedJob.CurrentRunLengthMs);
    }

    [Fact]
    public async Task SendJobResult_WithCalculateRunLength_CalculatesCorrectly()
    {
        // Arrange
        var lastRunTime = DateTime.UtcNow.AddMinutes(-5);
        var currentRunTime = DateTime.UtcNow;
        var expectedRunLength = (ulong)(currentRunTime - lastRunTime).TotalMilliseconds;

        var jobRequest = new JobResultRequestDTO
        {
            InternalJobName = "existing-job",
            JobName = "Existing Job",
            RunStatus = "Success",
            RunTime = currentRunTime,
            CalculateRunLengthFromLastTime = true,
            APIResponseLatency = 100
        };

        _mockClickHouseService
            .Setup(s => s.InsertRun(
                It.IsAny<ClickhouseJobRun>(),
                It.IsAny<List<ClickhouseJobLocationRun>>(),
                It.IsAny<ClickhouseAPIError?>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.SendJobResult(jobRequest, 1, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        var savedJob = await _dbContext.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "existing-job");
        Assert.NotNull(savedJob);
        Assert.True(Math.Abs((long)savedJob.CurrentRunLengthMs - (long)expectedRunLength) < 100); // Allow small difference due to execution time
    }

    [Fact]
    public async Task SendJobResult_WithCalculateColoId_SetsCorrectly()
    {
        // Arrange
        var jobRequest = new JobResultRequestDTO
        {
            InternalJobName = "new-job",
            JobName = "New Job",
            RunStatus = "Success",
            RunLengthMs = 2000,
            RunTime = DateTime.UtcNow,
            CalculateColoIdFromRequestHeader = true
        };

        var expectedColoId = 42;

        _mockClickHouseService
            .Setup(s => s.InsertRun(
                It.IsAny<ClickhouseJobRun>(),
                It.IsAny<List<ClickhouseJobLocationRun>>(),
                It.IsAny<ClickhouseAPIError?>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.SendJobResult(jobRequest, expectedColoId, _cancellationToken);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(expectedColoId, jobRequest.ColoId);
    }

    [Fact]
    public async Task SendJobResult_ClickHouseError_ReturnsError()
    {
        // Arrange
        var jobRequest = new JobResultRequestDTO
        {
            InternalJobName = "new-job",
            JobName = "New Job",
            RunStatus = "Success",
            RunLengthMs = 2000,
            RunTime = DateTime.UtcNow
        };

        _mockClickHouseService
            .Setup(s => s.InsertRun(
                It.IsAny<ClickhouseJobRun>(),
                It.IsAny<List<ClickhouseJobLocationRun>>(),
                It.IsAny<ClickhouseAPIError?>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("ClickHouse error"));

        // Act
        var result = await _service.SendJobResult(jobRequest, 1, _cancellationToken);

        // Assert
        Assert.True(result.IsFailed);
        var error = result.Errors.First() as ErrorResponse;
        Assert.Equal(500, error.Error.Code);
        Assert.Equal("internal_error", error.Error.Type);
    }


    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}