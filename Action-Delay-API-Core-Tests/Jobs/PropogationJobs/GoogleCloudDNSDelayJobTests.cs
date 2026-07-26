using Action_Delay_API_Core_Tests;
using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Jobs.PropagationJobs.Google;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.DNS;
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

public class GoogleCloudDNSDelayJobTests : IDisposable
{
    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<GoogleCloudDNSDelayJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly Mock<IGoogleCloudAPIBroker> _brokerMock;

    public GoogleCloudDNSDelayJobTests()
    {
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase($"GoogleDnsDb_{Guid.NewGuid()}")
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
            GoogleCloudDNSJob = new GoogleCloudDNSDelayJobConfig
            {
                ServiceAccountJson = "{}",
                ProjectId = "test-project",
                ZoneName = "test-zone",
                RecordName = "delay.example.com",
                NameServers = "8.8.8.8",
            }
        });

        _loggerMock = new Mock<ILogger<GoogleCloudDNSDelayJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();
        _brokerMock = new Mock<IGoogleCloudAPIBroker>();
    }

    [Fact]
    public async Task BaseRun_UpdatesRecordAndDetectsChangeOnEdge_MarksDeployed()
    {
        // The job builds an unpredictable marker at runtime and pushes it as the TXT rrdata (quoted).
        // Capture that rrdata from the update call, then echo it back from every edge DNS query so all
        // locations "see" the change. GCP returns TXT values wrapped in quotes, which the job strips.
        string capturedRrdata = "";
        _brokerMock
            .Setup(b => b.UpdateDNSRecord(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<UpdateGCPRRSetRequest>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Callback<string, string, string, UpdateGCPRRSetRequest, string, CancellationToken>(
                (_, _, _, request, _, _) => capturedRrdata = request.Rrdatas.First())
            .ReturnsAsync(Result.Ok(new GoogleCloudAPIResponse { ResponseTimeMs = 5 }));

        _queueMock
            .Setup(q => q.DNS(It.IsAny<NATSDNSRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => Result.Ok(new SerializableDNSResponse
            {
                ResponseCode = "NoError",
                ProxyFailure = false,
                Answers = new List<SerializableDnsAnswer>
                {
                    new() { Value = capturedRrdata, RecordType = "TXT" }
                },
                ResponseUTC = DateTime.UtcNow,
                ResponseTimeMs = 10,
            }));

        var job = new GoogleCloudDNSDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        // Act
        await job.BaseRun();

        // Assert: the DNS record was patched via the Google broker.
        _brokerMock.Verify(b => b.UpdateDNSRecord("test-project", "test-zone", "delay.example.com",
            It.IsAny<UpdateGCPRRSetRequest>(), "{}", It.IsAny<CancellationToken>()), Times.AtLeastOnce);

        // With all locations reporting the new TXT value, the job is Deployed.
        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "googledns");
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData!.CurrentRunStatus);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
