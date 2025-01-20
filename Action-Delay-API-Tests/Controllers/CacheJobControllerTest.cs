using Action_Delay_API.Controllers;
using Action_Delay_API.Models.Services;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Action_Delay_API_Tests.Controllers;

public class CacheJobControllerTests
{
    private readonly Mock<ICacheJobService> _mockCacheService;
    private readonly Mock<ILogger<CacheJobController>> _mockLogger;
    private readonly CacheJobController _controller;
    private readonly CancellationToken _cancellationToken;

    public CacheJobControllerTests()
    {
        _mockCacheService = new Mock<ICacheJobService>();
        _mockLogger = new Mock<ILogger<CacheJobController>>();
        _controller = new CacheJobController(_mockCacheService.Object, _mockLogger.Object);
        _cancellationToken = CancellationToken.None;
    }

    [Fact]
    public async Task Get_ReturnsOkResult_WhenServiceReturnsSuccess()
    {
        // Arrange
        var cacheValue = "Cache Test Value 2024-01-19 12:00:00 GMT - GUID: 123e4567-e89b-12d3-a456-426614174000";
        var successResult = Result.Ok<string>(cacheValue);
        _mockCacheService.Setup(s => s.GetCacheValue(_cancellationToken))
            .ReturnsAsync(successResult);

        // Act
        var result = await _controller.Get(_cancellationToken);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<string>(okResult.Value);
        Assert.Equal(cacheValue, returnValue);
    }

    [Fact]
    public async Task Get_ReturnsBadRequest_WhenServiceReturnsError()
    {
        // Arrange
        var errorResult = Result.Fail<string>("Failed to retrieve cache value");
        _mockCacheService.Setup(s => s.GetCacheValue(_cancellationToken))
            .ReturnsAsync(errorResult);

        // Act
        var result = await _controller.Get(_cancellationToken);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
}