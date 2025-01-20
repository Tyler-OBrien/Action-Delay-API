using Action_Delay_API_Core.Models.Services.ClickHouse;
using Action_Delay_API.Controllers.v2;
using Action_Delay_API.Models.API.Requests.DTOs.v2.Analytics;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.API.Responses.DTOs.v2.Analytics;
using Action_Delay_API.Models.Services.v2;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Action_Delay_API_Tests.Controllers.v2
{
    public class AnalyticsControllerTests
    {
        private readonly Mock<IAnalyticsService> _mockAnalyticsService;
        private readonly Mock<ILogger<AnalyticsController>> _mockLogger;
        private readonly AnalyticsController _controller;
        private readonly CancellationToken _cancellationToken;

        public AnalyticsControllerTests()
        {
            _mockAnalyticsService = new Mock<IAnalyticsService>();
            _mockLogger = new Mock<ILogger<AnalyticsController>>();
            _controller = new AnalyticsController(_mockAnalyticsService.Object, _mockLogger.Object);
            _cancellationToken = CancellationToken.None;
        }

        #region Query Parameter Validation Tests

        [Fact]
        public async Task GetJobAnalytics_NullStartDate_ReturnsBadRequest()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParams
            {
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            // Act
            var result = await _controller.GetJobAnalytics("testJob", queryParams, _cancellationToken);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            var response = Assert.IsType<ErrorResponse>(objectResult.Value);
            Assert.Equal("bad_query_param", response.Error.Type);
        }

        [Fact]
        public async Task GetJobAnalytics_DateBeforeYear2000_ReturnsBadRequest()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParams
            {
                StartDateTime = new DateTime(1999, 12, 31),
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            // Act
            var result = await _controller.GetJobAnalytics("testJob", queryParams, _cancellationToken);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            var response = Assert.IsType<ErrorResponse>(objectResult.Value);
            Assert.Equal("bad_query_param", response.Error.Type);
        }

        [Fact]
        public async Task GetJobAnalytics_EmptyMetrics_ReturnsBadRequest()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParams
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = ""
            };

            // Act
            var result = await _controller.GetJobAnalytics("testJob", queryParams, _cancellationToken);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            var response = Assert.IsType<ErrorResponse>(objectResult.Value);
            Assert.Equal("bad_query_param", response.Error.Type);
        }

        #endregion

        #region Service Integration Tests

        [Fact]
        public async Task GetJobAnalytics_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParams
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            var expectedResponse = Result.Ok(new DataResponse<NormalJobAnalyticsDTO>(
                new NormalJobAnalyticsDTO()
            ));

            _mockAnalyticsService
                .Setup(x => x.GetJobAnalytics(
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<JobAnalyticsRequestOptions>(),
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()))
                .ReturnsAsync(expectedResponse)
                .Verifiable();
            // Act
            var result = await _controller.GetJobAnalytics("testJob", queryParams, _cancellationToken);

            // Assert
            _mockAnalyticsService.Verify();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<NormalJobAnalyticsDTO>>(okResult.Value);
            Assert.Equal(response.Data, response.Data);
        }

        [Fact]
        public async Task GetJobErrorAnalytics_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParams
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            var expectedResponse = Result.Ok(new DataResponse<ErrorJobAnalyticsDTO>(
                new ErrorJobAnalyticsDTO()
            ));

            _mockAnalyticsService
                .Setup(x => x.GetErrorAnalyticsForJob(
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetJobErrorAnalytics("testJob", queryParams, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<ErrorJobAnalyticsDTO>>(okResult.Value);
        }

        #endregion

        #region Location Analytics Tests

        [Fact]
        public async Task GetJobLocationAnalytics_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParamsLocations
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            var expectedResponse = Result.Ok(new DataResponse<NormalJobLocationAnalyticsDTO>(
                new NormalJobLocationAnalyticsDTO()
            ));

            _mockAnalyticsService
                .Setup(x => x.GetJobAnalyticsLocation(
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<JobAnalyticsRequestOptions>(),
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetJobLocationAnalytics("testJob", "testLocation", queryParams, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<NormalJobLocationAnalyticsDTO>>(okResult.Value);
        }

        [Fact]
        public async Task GetJobLocationAnalyticsByRegion_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParamsLocations
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            var expectedResponse = Result.Ok(new DataResponse<NormalJobLocationAnalyticsDTO>(
                new NormalJobLocationAnalyticsDTO()
            ));

            _mockAnalyticsService
                .Setup(x => x.GetJobAnalyticsLocationRegion(
                    It.IsAny<string[]>(),
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<JobAnalyticsRequestOptions>(),
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetJobLocationAnalyticsByRegion("testJob", "testRegion", queryParams, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<NormalJobLocationAnalyticsDTO>>(okResult.Value);
        }

        [Fact]
        public async Task GetJobLocationAnalyticsByRegionMultiple_ValidRequest_ReturnsSuccess()
        {
            // Arrange
            var queryParams = new AnalyticsQueryParamsLocations
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = "MinRunLength,MaxRunLength"
            };

            var expectedResponse = Result.Ok(new DataResponse<NormalJobLocationAnalyticsDTO>(
                new NormalJobLocationAnalyticsDTO()
            ));

            _mockAnalyticsService
                .Setup(x => x.GetJobAnalyticsLocationRegion(
                    It.IsAny<string[]>(),
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<JobAnalyticsRequestOptions>(),
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.GetJobLocationAnalyticsByRegionMultiple("testRegion", "job1,job2", queryParams, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<NormalJobLocationAnalyticsDTO>>(okResult.Value);
        }

        #endregion

        #region Metrics Processing Tests

        [Theory]
        [InlineData("MinRunLength", JobAnalyticsRequestOptions.MinRunLength)]
        [InlineData("MaxRunLength", JobAnalyticsRequestOptions.MaxRunLength)]
        [InlineData("AvgRunLength", JobAnalyticsRequestOptions.AvgRunLength)]
        [InlineData("MedianRunLength", JobAnalyticsRequestOptions.MedianRunLength)]
        [InlineData("MinApiResponseLatency", JobAnalyticsRequestOptions.MinResponseLatency)]
        [InlineData("MaxEdgeResponseLatency", JobAnalyticsRequestOptions.MaxResponseLatency)]
        [InlineData("AvgApiResponseLatency", JobAnalyticsRequestOptions.AvgResponseLatency)]
        [InlineData("MedianEdgeResponseLatency", JobAnalyticsRequestOptions.MedianResponseLatency)]
        public async Task GetJobAnalytics_DifferentMetrics_ProcessesCorrectly(string metric, JobAnalyticsRequestOptions expectedOption)
        {
            // Arrange
            var queryParams = new AnalyticsQueryParams
            {
                StartDateTime = DateTime.UtcNow.AddDays(-1),
                EndDateTime = DateTime.UtcNow,
                Metrics = metric
            };

            _mockAnalyticsService
                .Setup(x => x.GetJobAnalytics(
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    expectedOption,
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()))
                .ReturnsAsync(Result.Ok(new DataResponse<NormalJobAnalyticsDTO>(new NormalJobAnalyticsDTO())));

            // Act
            var result = await _controller.GetJobAnalytics("testJob", queryParams, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            _mockAnalyticsService.Verify(
                x => x.GetJobAnalytics(
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>(),
                    expectedOption,
                    It.IsAny<CancellationToken>(),
                    It.IsAny<int>()),
                Times.Once);
        }

        #endregion
    }
}