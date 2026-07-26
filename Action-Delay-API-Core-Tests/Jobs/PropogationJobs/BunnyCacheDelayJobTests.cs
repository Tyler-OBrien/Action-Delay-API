using Action_Delay_API_Core_Tests;
using Action_Delay_API_Core.Services.Locations;
using System.Net;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Jobs.PropagationJobs;
using Action_Delay_API_Core.Jobs.PropagationJobs.Bunny;
using Action_Delay_API_Core.Models.BunnyAPI;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace Action_Delay_API_Core_Tests.Jobs.PropogationJobs;

public class BunnyCacheDelayJobTests : IDisposable
{
    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<BunnyCacheDelayJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly Mock<IBunnyAPIBroker> _brokerMock;

    private const string TestUrl = "https://delay.bunny.example/v1/cache-bunny";

    public BunnyCacheDelayJobTests()
    {
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase($"BunnyCacheDb_{Guid.NewGuid()}")
            .Options;
        _context = new ActionDelayDatabaseContext(_dbContextOptions);

        var locations = new List<Location>
        {
            new Location { Name = "loc1", DisplayName = "Loc 1", Disabled = false },
            new Location { Name = "loc2", DisplayName = "Loc 2", Disabled = false },
        };

        _configMock = new Mock<IOptions<LocalConfig>>();
        _configMock.Setup(x => x.Value).Returns(new LocalConfig
        {
            Locations = locations,
            BunnyCacheJob = new BunnyCacheDelayJobConfig
            {
                API_Key = "test-key",
                URL = TestUrl,
            }
        });

        _loggerMock = new Mock<ILogger<BunnyCacheDelayJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();
        _brokerMock = new Mock<IBunnyAPIBroker>();
    }

    [Fact]
    public async Task BaseRun_PurgesAndDetectsChangeOnEdge_MarksDeployed()
    {
        // Arrange: purge succeeds.
        _brokerMock
            .Setup(b => b.PurgeSingleURLCache(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Ok(new BunnyAPIResponse { Success = true, ResponseTimeMs = 5 }));

        // Every edge fetch returns the marker the job just wrote to the origin, so all
        // locations "see" the purge. A fresh short-lived context avoids concurrent access
        // to the job's DbContext during the parallel location fan-out.
        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(), It.IsAny<int>()))
            .ReturnsAsync(() =>
            {
                using var readContext = new ActionDelayDatabaseContext(_dbContextOptions);
                var marker = readContext.GenericJobData
                    .AsNoTracking()
                    .FirstOrDefault(d => d.JobName == "bunnypurge")?.Value ?? "";
                return Result.Ok(new SerializableHttpResponse
                {
                    WasSuccess = true,
                    StatusCode = HttpStatusCode.OK,
                    Headers = new Dictionary<string, string>(),
                    Body = marker,
                    ResponseUTC = DateTime.UtcNow,
                    ResponseTimeMs = 10,
                });
            });

        var job = new BunnyCacheDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        // Act
        await job.BaseRun();

        // Assert: the Bunny purge API was invoked with the configured URL + key.
        _brokerMock.Verify(b => b.PurgeSingleURLCache(TestUrl, "test-key", It.IsAny<CancellationToken>()),
            Times.AtLeastOnce);

        // A unique marker was persisted under the Bunny origin's job name.
        var markerRow = await _context.GenericJobData.FirstOrDefaultAsync(d => d.JobName == "bunnypurge");
        Assert.NotNull(markerRow);
        Assert.False(string.IsNullOrEmpty(markerRow!.Value));

        // With all locations reporting the new value, the job is Deployed.
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "bunnypurge");
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData!.CurrentRunStatus);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
