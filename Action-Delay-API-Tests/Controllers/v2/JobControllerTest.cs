using Action_Delay_API.Controllers.v2;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Jobs;
using Action_Delay_API.Models.Services.v2;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Action_Delay_API_Tests.Controllers.v2;

public class JobControllerTests
{
    private readonly Mock<IJobDataService> _mockJobService;
    private readonly Mock<ILocationDataService> _mockLocationService;
    private readonly Mock<ILogger<JobController>> _mockLogger;
    private readonly JobController _controller;
    private readonly CancellationToken _cancellationToken;

    public JobControllerTests()
    {
        _mockJobService = new Mock<IJobDataService>();
        _mockLocationService = new Mock<ILocationDataService>();
        _mockLogger = new Mock<ILogger<JobController>>();
        _controller = new JobController(_mockJobService.Object, _mockLocationService.Object, _mockLogger.Object);
        _cancellationToken = CancellationToken.None;
    }

    [Fact]
    public async Task GetJobs_ReturnsOkResult_WhenServiceReturnsSuccess()
    {
        // Arrange
        var jobsData = new JobDataResponse[]
        {
            new() { JobName = "Job1", InternalJobName = "job1" },
            new() { JobName = "Job2", InternalJobName = "job2" }
        };
        var successResult = Result.Ok<DataResponse<JobDataResponse[]>>(new DataResponse<JobDataResponse[]>(jobsData));
        _mockJobService.Setup(s => s.GetJobs("CloudflareDelay", _cancellationToken))
            .ReturnsAsync(successResult);

        // Act
        var result = await _controller.GetJobs(_cancellationToken);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<DataResponse<JobDataResponse[]>>(okResult.Value);
        Assert.Equal(2, response.Data.Length);
        Assert.Equal("Job1", response.Data[0].JobName);
        Assert.Equal("job1", response.Data[0].InternalJobName);
    }

    [Fact]
    public async Task GetJobs_ReturnsBadRequest_WhenServiceReturnsError()
    {
        // Arrange
        var errorResult = Result.Fail<DataResponse<JobDataResponse[]>>("Error message");
        _mockJobService.Setup(s => s.GetJobs("CloudflareDelay", _cancellationToken))
            .ReturnsAsync(errorResult);

        // Act
        var result = await _controller.GetJobs(_cancellationToken);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetJob_ReturnsOkResult_WhenServiceReturnsSuccess()
    {
        // Arrange
        var jobData = new JobDataResponse { JobName = "Test Job", InternalJobName = "test-job" };
        var successResult = Result.Ok<DataResponse<JobDataResponse>>(new DataResponse<JobDataResponse>(jobData));
        _mockJobService.Setup(s => s.GetJob("test-job", _cancellationToken))
            .ReturnsAsync(successResult);

        // Act
        var result = await _controller.GetJob("test-job", _cancellationToken);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<DataResponse<JobDataResponse>>(okResult.Value);
        Assert.Equal("Test Job", response.Data.JobName);
        Assert.Equal("test-job", response.Data.InternalJobName);
    }

    [Fact]
    public async Task GetStreamDeck_ReturnsOkResult_WhenServiceReturnsSuccess()
    {
        // Arrange
        var streamDeckData = new StreamDeckResponseDTO
        {
            JobName = "Test Job",
            InternalJobName = "test-job",
            PredictedText = "Predicted text",
            PredictedRunTimeText = "10 minutes",
            PredictedStatusText = "Running"
        };
        var successResult = Result.Ok<DataResponse<StreamDeckResponseDTO>>(new DataResponse<StreamDeckResponseDTO>(streamDeckData));
        _mockJobService.Setup(s => s.GetStreamDeckData("test-job", _cancellationToken))
            .ReturnsAsync(successResult);

        // Act
        var result = await _controller.GetStreamDeck("test-job", _cancellationToken);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<DataResponse<StreamDeckResponseDTO>>(okResult.Value);
        Assert.Equal("Test Job", response.Data.JobName);
        Assert.Equal("test-job", response.Data.InternalJobName);
        Assert.Equal("Predicted text", response.Data.PredictedText);
        Assert.Equal("10 minutes", response.Data.PredictedRunTimeText);
        Assert.Equal("Running", response.Data.PredictedStatusText);
    }

    [Fact]
    public async Task GetJobLocations_ReturnsOkResult_WhenServiceReturnsSuccess()
    {
        // Arrange
        var locationData = new JobLocationDataResponse[]
        {
            new() { LocationName = "Location1" },
            new() { LocationName = "Location2" }
        };
        var successResult = Result.Ok<DataResponse<JobLocationDataResponse[]>>(new DataResponse<JobLocationDataResponse[]>(locationData));
        _mockLocationService.Setup(s => s.GetLocationJobData("test-job", _cancellationToken))
            .ReturnsAsync(successResult);

        // Act
        var result = await _controller.GetJobLocations("test-job", _cancellationToken);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<DataResponse<JobLocationDataResponse[]>>(okResult.Value);
        Assert.Equal(2, response.Data.Length);
        Assert.Equal("Location1", response.Data[0].LocationName);
    }

    [Fact]
    public async Task GetJobsByType_ReturnsOkResult_WhenServiceReturnsSuccess()
    {
        // Arrange
        var jobsData = new JobDataResponse[]
        {
            new() { JobName = "Test Job 1", InternalJobName = "test-job-1" },
            new() { JobName = "Test Job 2", InternalJobName = "test-job-2" }
        };
        var successResult = Result.Ok<DataResponse<JobDataResponse[]>>(new DataResponse<JobDataResponse[]>(jobsData));
        _mockJobService.Setup(s => s.GetJobs("TestType", _cancellationToken))
            .ReturnsAsync(successResult);

        // Act
        var result = await _controller.GetJobs("TestType", _cancellationToken);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<DataResponse<JobDataResponse[]>>(okResult.Value);
        Assert.Equal(2, response.Data.Length);
        Assert.Equal("Test Job 1", response.Data[0].JobName);
        Assert.Equal("test-job-1", response.Data[0].InternalJobName);
    }

    [Fact]
    public async Task GetJobLocation_ReturnsBadRequest_WhenServiceReturnsError()
    {
        // Arrange
        var errorResult = Result.Fail<DataResponse<JobLocationDataResponse>>("Location not found");
        _mockLocationService.Setup(s => s.GetLocationsJobData("test-job", "non-existent-location", _cancellationToken))
            .ReturnsAsync(errorResult);

        // Act
        var result = await _controller.GetJobLocation("test-job", "non-existent-location", _cancellationToken);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
}