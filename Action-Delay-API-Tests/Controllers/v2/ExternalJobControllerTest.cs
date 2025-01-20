using Action_Delay_API.Controllers.v2;
using Action_Delay_API.Models.API.Local;
using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Models.Services.v2;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace Action_Delay_API_Tests.Controllers.v2
{
    public class ExternalJobControllerTests
    {
        private readonly Mock<IExternalJobService> _mockExternalJobService;
        private readonly Mock<ILogger<ExternalJobController>> _mockLogger;
        private readonly Mock<IOptions<APIConfig>> _mockApiConfig;
        private readonly ExternalJobController _controller;
        private readonly CancellationToken _cancellationToken;
        private const string ValidApiKey = "valid-api-key-12345";

        public ExternalJobControllerTests()
        {
            _mockExternalJobService = new Mock<IExternalJobService>();
            _mockLogger = new Mock<ILogger<ExternalJobController>>();
            _mockApiConfig = new Mock<IOptions<APIConfig>>();

            // Setup API config
            _mockApiConfig.Setup(x => x.Value)
                .Returns(new APIConfig { ExternalJobAPIKey = ValidApiKey });

            _controller = new ExternalJobController(
                _mockExternalJobService.Object,
                _mockLogger.Object,
                _mockApiConfig.Object);

            // Setup default HttpContext
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            _cancellationToken = CancellationToken.None;
        }

        #region API Key Validation Tests

        [Fact]
        public async Task GetLocations_NoApiKeyHeader_ReturnsUnauthorized()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            var unauthorizedResult = Assert.IsType<ObjectResult>(result);
            var response = Assert.IsType<ErrorResponse>(unauthorizedResult.Value);
            Assert.Equal("no_apikey_header", response.Error.Type);
        }

        [Fact]
        public async Task GetLocations_InvalidApiKey_ReturnsUnauthorized()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();
            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = "invalid-key";

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            var unauthorizedResult = Assert.IsType<ObjectResult>(result);
            var response = Assert.IsType<ErrorResponse>(unauthorizedResult.Value);
            Assert.Equal("invalid_api_key", response.Error.Type);
        }

        [Fact]
        public async Task GetLocations_ValidApiKey_ProcessesRequest()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();
            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = ValidApiKey;

            _mockExternalJobService
                .Setup(x => x.SendJobResult(
                    It.IsAny<JobResultRequestDTO>(),
                    It.IsAny<int>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result.Ok(new DataResponse<bool>(true)));

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<bool>>(okResult.Value);
            Assert.True(response.Data);
        }

        #endregion

        #region Colo Header Tests

        [Fact]
        public async Task GetLocations_WithValidColoHeader_ProcessesColoId()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();
            var expectedColoId = 42;

            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = ValidApiKey;
            _controller.ControllerContext.HttpContext.Request.Headers["colo"] = expectedColoId.ToString();

            _mockExternalJobService
                .Setup(x => x.SendJobResult(
                    It.IsAny<JobResultRequestDTO>(),
                    expectedColoId,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result.Ok(new DataResponse<bool>(true)))
                .Verifiable();

            // Act
            
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            _mockExternalJobService.Verify();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<bool>>(okResult.Value);
            Assert.Equal(response.Data, true);
        }

        [Fact]
        public async Task GetLocations_WithInvalidColoHeader_UsesDefaultColoId()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();
            var invalidColoId = "invalid-colo";

            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = ValidApiKey;
            _controller.ControllerContext.HttpContext.Request.Headers["colo"] = invalidColoId;

            _mockExternalJobService
                .Setup(x => x.SendJobResult(
                    It.IsAny<JobResultRequestDTO>(),
                    0, // Default coloId
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result.Ok())
                .Verifiable();

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            _mockExternalJobService.Verify();
            var okResult = Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetLocations_NoColoHeader_UsesDefaultColoId()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();

            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = ValidApiKey;

            _mockExternalJobService
                .Setup(x => x.SendJobResult(
                    It.IsAny<JobResultRequestDTO>(),
                    0, // Default coloId
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result.Ok())
                .Verifiable();

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            _mockExternalJobService.Verify();
            var okResult = Assert.IsType<OkObjectResult>(result);
        }

        #endregion

        #region Service Integration Tests

        [Fact]
        public async Task GetLocations_ServiceFailure_ReturnsError()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO();
            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = ValidApiKey;

            var expectedError = new ErrorResponse(500, "Service error", "service_error");
            _mockExternalJobService
                .Setup(x => x.SendJobResult(
                    It.IsAny<JobResultRequestDTO>(),
                    It.IsAny<int>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result.Fail(expectedError));

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            var errorResult = Assert.IsType<ObjectResult>(result);
            var response = Assert.IsType<ErrorResponse>(errorResult.Value);
            Assert.Equal(expectedError.Error.Type, response.Error.Type);
            Assert.Equal(expectedError.Message, response.Message);
        }

        [Fact]
        public async Task GetLocations_ServiceSuccess_ReturnsSuccess()
        {
            // Arrange
            var jobResult = new JobResultRequestDTO
            {
                // Add required properties here based on DTO definition
            };
            _controller.ControllerContext.HttpContext.Request.Headers["APIKEY"] = ValidApiKey;

            _mockExternalJobService
                .Setup(x => x.SendJobResult(
                    It.IsAny<JobResultRequestDTO>(),
                    It.IsAny<int>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(Result.Ok(new DataResponse<bool>(true)));

            // Act
            var result = await _controller.SendJobResult(jobResult, _cancellationToken);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<DataResponse<bool>>(okResult.Value);
            Assert.True(response.Data);
        }

        #endregion
    }
}