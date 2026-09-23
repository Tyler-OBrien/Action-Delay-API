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
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object),
            LocalContextFactory());

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

    // Bunny sends no standard Age header - freshness arrives as an absolute CDN-CacheDat timestamp,
    // so the warm loop derives the age itself. These pin that derivation down.

    [Fact]
    public void TryGetCacheAgeSeconds_CdnCacheDat_ReturnsAgeAgainstResponseTime()
    {
        var responseUtc = new DateTime(2026, 7, 28, 1, 9, 50, DateTimeKind.Utc);
        var response = ResponseWithHeaders(responseUtc, new Dictionary<string, string>
        {
            ["cdn-cache"] = "HIT",
            ["cdn-cachedat"] = "07/28/2026 01:09:24",
        });

        Assert.True(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out var ageSeconds));
        Assert.Equal(26, ageSeconds, 3);
    }

    [Fact]
    public void TryGetCacheAgeSeconds_FreshlyCachedObject_IsBelowWarmThreshold()
    {
        var responseUtc = DateTime.UtcNow;
        var response = ResponseWithHeaders(responseUtc, new Dictionary<string, string>
        {
            ["cdn-cache"] = "HIT",
            ["cdn-cachedat"] = responseUtc.AddSeconds(-2).ToString("MM/dd/yyyy HH:mm:ss"),
        });

        Assert.True(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out var ageSeconds));
        Assert.InRange(ageSeconds, 1, 3);
    }

    // Any Age on a Bunny response came from the origin and is replayed frozen, so it says nothing
    // about how long this edge held the object. CDN-CacheDat is the only source consulted.
    [Fact]
    public void TryGetCacheAgeSeconds_IgnoresOriginSuppliedAge()
    {
        var responseUtc = new DateTime(2026, 7, 28, 1, 9, 50, DateTimeKind.Utc);
        var response = ResponseWithHeaders(responseUtc, new Dictionary<string, string>
        {
            ["age"] = "60",
            ["cdn-cachedat"] = "07/28/2026 01:09:48",
        });

        Assert.True(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out var ageSeconds));
        Assert.Equal(2, ageSeconds, 3);
    }

    [Fact]
    public void TryGetCacheAgeSeconds_AgeWithoutCacheDat_ReturnsFalse()
    {
        var response = ResponseWithHeaders(DateTime.UtcNow, new Dictionary<string, string>
        {
            ["cdn-cache"] = "HIT",
            ["age"] = "30",
        });

        Assert.False(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out _));
    }

    [Fact]
    public void TryGetCacheAgeSeconds_ClockSkewedFutureTimestamp_ClampsToZero()
    {
        var responseUtc = new DateTime(2026, 7, 28, 1, 9, 50, DateTimeKind.Utc);
        var response = ResponseWithHeaders(responseUtc, new Dictionary<string, string>
        {
            ["cdn-cache"] = "HIT",
            ["cdn-cachedat"] = "07/28/2026 01:10:20",
        });

        Assert.True(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out var ageSeconds));
        Assert.Equal(0, ageSeconds);
    }

    [Theory]
    [InlineData("not-a-date")]
    [InlineData("")]
    public void TryGetCacheAgeSeconds_UnparseableCacheDat_ReturnsFalse(string cachedAt)
    {
        var response = ResponseWithHeaders(DateTime.UtcNow, new Dictionary<string, string>
        {
            ["cdn-cache"] = "HIT",
            ["cdn-cachedat"] = cachedAt,
        });

        Assert.False(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out _));
    }

    [Fact]
    public void TryGetCacheAgeSeconds_NoCacheHeaders_ReturnsFalse()
    {
        var response = ResponseWithHeaders(DateTime.UtcNow, new Dictionary<string, string>());

        Assert.False(BunnyCacheDelayJob.TryGetCacheAgeSeconds(response, out _));
    }

    // The test config leaves PostgresConnectionStringLocal blank, so the job never asks this for a
    // context; it only has to satisfy the constructor.
    private static IDbContextFactory<LocalActionDelayDatabaseContext> LocalContextFactory() =>
        new InMemoryLocalContextFactory();

    private sealed class InMemoryLocalContextFactory : IDbContextFactory<LocalActionDelayDatabaseContext>
    {
        public LocalActionDelayDatabaseContext CreateDbContext() =>
            new LocalActionDelayDatabaseContext(
                new DbContextOptionsBuilder<LocalActionDelayDatabaseContext>()
                    .UseInMemoryDatabase($"BunnyCacheLocalDb_{Guid.NewGuid()}")
                    .Options);
    }

    private static SerializableHttpResponse ResponseWithHeaders(DateTime responseUtc, Dictionary<string, string> headers) =>
        new SerializableHttpResponse
        {
            WasSuccess = true,
            StatusCode = HttpStatusCode.OK,
            Headers = headers,
            Body = "",
            ResponseUTC = responseUtc,
            ResponseTimeMs = 10,
        };

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
