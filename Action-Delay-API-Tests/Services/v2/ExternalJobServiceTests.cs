using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API.Models.API.Requests.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Services.v2;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json.Nodes;

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


    [Fact]
    public void ConvertJsonNodeToValue_NullValue_ReturnsDBNull()
    {
        // Arrange
        JsonNode nullNode = null;

        // Act
        var result = _service.ConvertJsonNodeToValue(nullNode);

        // Assert
        Assert.Equal(DBNull.Value, result);
    }

    [Theory]
    [InlineData("test string")]
    [InlineData("")]
    public void ConvertJsonNodeToValue_StringValue_ReturnsString(string inputString)
    {
        // Arrange
        JsonNode stringNode = JsonValue.Create(inputString);

        // Act
        var result = _service.ConvertJsonNodeToValue(stringNode);

        // Assert
        Assert.Equal(inputString, result);
    }

    [Theory]
    [InlineData(42L)]
    [InlineData(-100L)]
    public void ConvertJsonNodeToValue_LongValue_ReturnsLong(long inputLong)
    {
        // Arrange
        JsonNode longNode = JsonValue.Create(inputLong);

        // Act
        var result = _service.ConvertJsonNodeToValue(longNode);

        // Assert
        Assert.Equal(inputLong, result);
    }

    [Theory]
    [InlineData(3.14)]
    [InlineData(-0.001)]
    public void ConvertJsonNodeToValue_DoubleValue_ReturnsDouble(double inputDouble)
    {
        // Arrange
        JsonNode doubleNode = JsonValue.Create(inputDouble);

        // Act
        var result = _service.ConvertJsonNodeToValue(doubleNode);

        // Assert
        Assert.Equal(inputDouble, result);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void ConvertJsonNodeToValue_BoolValue_ReturnsBool(bool inputBool)
    {
        // Arrange
        JsonNode boolNode = JsonValue.Create(inputBool);

        // Act
        var result = _service.ConvertJsonNodeToValue(boolNode);

        // Assert
        Assert.Equal(inputBool, result);
    }

    [Fact]
    public void ConvertJsonNodeToValue_JsonArray_ReturnsConvertedArray()
    {
        // Arrange
        var jsonArray = new JsonArray
        {
            JsonValue.Create("test"),
            JsonValue.Create(42L),
            JsonValue.Create(3.14)
        };

        // Act
        var result = _service.ConvertJsonNodeToValue(jsonArray);

        // Assert
        Assert.IsType<object[]>(result);
        var convertedArray = result as object[];
        Assert.NotNull(convertedArray);
        Assert.Equal(3, convertedArray.Length);
        Assert.Equal("test", convertedArray[0]);
        Assert.Equal(42L, convertedArray[1]);
        Assert.Equal(3.14, convertedArray[2]);
    }

    [Fact]
    public void ConvertJsonNodeToValue_JsonObject_ReturnsJsonObject()
    {
        // Arrange
        var jsonObject = new JsonObject
        {
            ["key1"] = "value1",
            ["key2"] = 42L
        };

        // Act
        var result = _service.ConvertJsonNodeToValue(jsonObject);

        // Assert
        Assert.Equal(jsonObject, result);
    }

    [Fact]
    public void ConvertJsonNodeToValue_UnknownType_ReturnsStringRepresentation()
    {
        // Arrange
        var complexNode = JsonValue.Create(new { test = 7 });

        // Act
        var result = _service.ConvertJsonNodeToValue(complexNode);

        // Assert
        Assert.Equal(complexNode.ToString(), result);
    }

    [Fact]
    public void ProcessDataGroup_SingleGroup_CorrectlyProcessesData()
    {
        // Arrange
        var dataPoints = new List<GenericDataPoint>
        {
            new GenericDataPoint
            {
                InputType = "type1",
                Data = new JsonObject
                {
                    ["Name"] = "John",
                    ["Age"] = 30L,
                    ["IsActive"] = true
                }
            }
        };
        var grouping = dataPoints.GroupBy(d => d.InputType).First();

        // Act
        var (dataRows, columnNames) = _service.ProcessDataGroup(grouping);

        // Assert
        Assert.Equal(new[] { "Name", "Age", "IsActive" }, columnNames);
        Assert.Single(dataRows);
        var row = dataRows[0];
        Assert.Equal(new object[] { "John", 30L, true }, row);
    }

    [Fact]
    public void ProcessDataGroup_MultipleGroups_CorrectlyProcessesData()
    {
        // Arrange
        var dataPoints = new List<GenericDataPoint>
        {
            new GenericDataPoint
            {
                InputType = "type1",
                Data = new JsonObject
                {
                    ["Name"] = "John",
                    ["Age"] = 30L
                }
            },
            new GenericDataPoint
            {
                InputType = "type1",
                Data = new JsonObject
                {
                    ["Name"] = "Jane",
                    ["Age"] = 25L
                }
            }
        };
        var grouping = dataPoints.GroupBy(d => d.InputType).First();

        // Act
        var (dataRows, columnNames) = _service.ProcessDataGroup(grouping);

        // Assert
        Assert.Equal(new[] { "Name", "Age" }, columnNames);
        Assert.Equal(2, dataRows.Count);
        Assert.Equal(new object[] { "John", 30L }, dataRows[0]);
        Assert.Equal(new object[] { "Jane", 25L }, dataRows[1]);
    }

    [Fact]
    public void ProcessDataGroup_NonJsonObjectData_LogsWarningAndSkips()
    {
        // Arrange
        var dataPoints = new List<GenericDataPoint>
        {
            new GenericDataPoint
            {
                InputType = "type1",
                Data = JsonValue.Create("not an object")
            }
        };
        var grouping = dataPoints.GroupBy(d => d.InputType).First();

        // Act
        var (dataRows, columnNames) = _service.ProcessDataGroup(grouping);

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Skipping non-object data for type type1")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception, string>>()
            ),
            Times.Once
        );
        Assert.Empty(dataRows);
        Assert.Null(columnNames);
    }

    [Fact]
    public async Task IngestGenericMetric_SuccessfulInsertion_ReturnsTrue()
    {
        // Arrange
        var jobRequest = new GenericDataIngestDTO
        {
            Data = new List<GenericDataPoint>
            {
                new GenericDataPoint
                {
                    InputType = "type1",
                    Data = new JsonObject
                    {
                        ["Name"] = "John",
                        ["Age"] = 30L
                    }
                },
                new GenericDataPoint
                {
                    InputType = "type2",
                    Data = new JsonObject
                    {
                        ["City"] = "New York",
                        ["Population"] = 8_400_000L
                    }
                }
            }
        };
        _mockClickHouseService
            .Setup(x => x.InsertGeneric(
                It.IsAny<List<object[]>>(),
                It.IsAny<string[]>(),
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.IngestGenericMetric(jobRequest,  _cancellationToken);

        // Assert
        Assert.True(result.Value.Data);
        _mockClickHouseService.Verify(
            x => x.InsertGeneric(
                It.IsAny<List<object[]>>(),
                It.IsAny<string[]>(),
                It.Is<string>(t => t == "type1" || t == "type2"),
                _cancellationToken
            ),
            Times.Exactly(2)
        );
    }

    [Fact]
    public async Task IngestGenericMetric_ExceptionThrown_ReturnsFailureResult()
    {
        // Arrange
        var jobRequest = new GenericDataIngestDTO
        {
            Data = new List<GenericDataPoint>
            {
                new GenericDataPoint
                {
                    InputType = "type1",
                    Data = new JsonObject
                    {
                        ["Name"] = "John"
                    }
                }
            }
        };
        _mockClickHouseService
            .Setup(x => x.InsertGeneric(
                It.IsAny<List<object[]>>(),
                It.IsAny<string[]>(),
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Test exception"));

        // Act
        var result = await _service.IngestGenericMetric(jobRequest, _cancellationToken);

        // Assert
        Assert.True(result.IsFailed);
        Assert.Equal("Internal Error on inserting into Clickhouse", result.Errors.First().Message);
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error inserting run failure")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()
            ),
            Times.Once
        );
    }

    [Fact]
    public void ConvertJsonNodeToValue_ISODateTimeUTC_ReturnsParsedDateTime()
    {
        // Arrange
        string isoDateTime = "2023-06-15T14:30:00Z";
        JsonNode dateNode = JsonValue.Create(isoDateTime);

        // Act
        var result = _service.ConvertJsonNodeToValue(dateNode);

        // Assert
        Assert.IsType<DateTime>(result);
        Assert.Equal(DateTime.Parse(isoDateTime, System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.AdjustToUniversal), result);
    }

    [Fact]
    public void ConvertJsonNodeToValue_ISODateTimeJS_ReturnsParsedDateTime()
    {
        // Arrange
        string isoDateTime = "2025-03-16T05:59:12.275Z";
        JsonNode dateNode = JsonValue.Create(isoDateTime);

        // Act
        var result = _service.ConvertJsonNodeToValue(dateNode);

        // Assert
        Assert.IsType<DateTime>(result);
        Assert.Equal(DateTime.Parse(isoDateTime, System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.AdjustToUniversal), result);
    }

    [Fact]
    public void ConvertJsonNodeToValue_ISODateTimeWithMilliseconds_ReturnsParsedDateTime()
    {
        // Arrange
        string isoDateTime = "2023-06-15T14:30:00.123Z";
        JsonNode dateNode = JsonValue.Create(isoDateTime);

        // Act
        var result = _service.ConvertJsonNodeToValue(dateNode);

        // Assert
        Assert.IsType<DateTime>(result);
        Assert.Equal(DateTime.Parse(isoDateTime, System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.AdjustToUniversal), result);
    }

    [Fact]
    public void ConvertJsonNodeToValue_InvalidDateTimeString_ReturnsOriginalString()
    {
        // Arrange
        string invalidDateTime = "2023/06/15 14:30:00";
        JsonNode dateNode = JsonValue.Create(invalidDateTime);

        // Act
        var result = _service.ConvertJsonNodeToValue(dateNode);

        // Assert
        Assert.IsType<string>(result);
        Assert.Equal(invalidDateTime, result);
    }



    public void Dispose()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }
}