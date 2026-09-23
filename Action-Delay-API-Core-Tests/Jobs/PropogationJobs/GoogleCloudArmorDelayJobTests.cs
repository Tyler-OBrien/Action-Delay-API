using Action_Delay_API_Core_Tests;
using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Jobs.PropagationJobs.Google;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.GoogleCloudAPI;
using Action_Delay_API_Core.Models.GoogleCloudAPI.Compute;
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
using System.Net;

namespace Action_Delay_API_Core_Tests.Jobs.PropogationJobs;

public class GoogleCloudArmorDelayJobTests : IDisposable
{
    private const string ProbeHeader = "x-adapi-armor";

    private readonly DbContextOptions<ActionDelayDatabaseContext> _dbContextOptions;
    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<GoogleCloudArmorDelayJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;
    private readonly Mock<IGoogleComputeAPIBroker> _brokerMock;

    public GoogleCloudArmorDelayJobTests()
    {
        _dbContextOptions = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase($"GoogleArmorDb_{Guid.NewGuid()}")
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
            GoogleCloudArmorJob = new GoogleCloudArmorDelayJobConfig
            {
                ServiceAccountJson = "{}",
                ProjectId = "test-project",
                SecurityPolicyName = "adapi-armor",
                RulePriority = 1000,
                ProbeHeaderName = ProbeHeader,
                ProbePath = "/armor-probe",
                LbHostname = "lb.delay.example.com",
            }
        });

        _loggerMock = new Mock<ILogger<GoogleCloudArmorDelayJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();
        _brokerMock = new Mock<IGoogleComputeAPIBroker>();
    }

    [Fact]
    public async Task BaseRun_PatchesRuleAndSeesBlockOnEdge_MarksDeployed()
    {
        // The marker lives in the request, so the fake edge behaves like Cloud Armor does: it denies only
        // when the probe carries the exact value the rule the job just wrote matches on. A location can
        // therefore never report Deployed off a stale rule.
        string capturedExpression = "";
        _brokerMock
            .Setup(b => b.PatchSecurityPolicyRule(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(),
                It.IsAny<PatchSecurityPolicyRuleRequest>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Callback<string, string, int, PatchSecurityPolicyRuleRequest, string, CancellationToken>(
                (_, _, _, request, _, _) => capturedExpression = request.Match.Expr.Expression)
            .ReturnsAsync(Result.Ok(new GoogleCloudAPIResponse { ResponseTimeMs = 5 }));

        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(),
                It.IsAny<int>()))
            .ReturnsAsync((NATSHttpRequest request, Location _, CancellationToken _, int _) =>
                Result.Ok(BuildEdgeResponse(request, capturedExpression)));

        var job = new GoogleCloudArmorDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        await job.BaseRun();

        _brokerMock.Verify(b => b.PatchSecurityPolicyRule("test-project", "adapi-armor", 1000,
            It.Is<PatchSecurityPolicyRuleRequest>(r => r.Action == "deny(403)" && r.Preview == false),
            "{}", It.IsAny<CancellationToken>()), Times.AtLeastOnce);

        var jobData = await _context.JobData.FirstOrDefaultAsync(j => j.InternalJobName == "googlearmor");
        Assert.NotNull(jobData);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData!.CurrentRunStatus);
    }

    [Fact]
    public async Task RunLocation_EdgeStillEnforcingPreviousRule_ReportsUndeployed()
    {
        string capturedExpression = "";
        _brokerMock
            .Setup(b => b.PatchSecurityPolicyRule(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(),
                It.IsAny<PatchSecurityPolicyRuleRequest>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Callback<string, string, int, PatchSecurityPolicyRuleRequest, string, CancellationToken>(
                (_, _, _, request, _, _) => capturedExpression = request.Match.Expr.Expression)
            .ReturnsAsync(Result.Ok(new GoogleCloudAPIResponse { ResponseTimeMs = 5 }));

        _queueMock
            .Setup(q => q.HTTP(It.IsAny<NATSHttpRequest>(), It.IsAny<Location>(), It.IsAny<CancellationToken>(),
                It.IsAny<int>()))
            .ReturnsAsync((NATSHttpRequest request, Location _, CancellationToken _, int _) =>
                Result.Ok(BuildEdgeResponse(request, capturedExpression)));

        var job = new GoogleCloudArmorDelayJob(_brokerMock.Object, _configMock.Object, _loggerMock.Object,
            _queueMock.Object, _clickhouseMock.Object, _context, StaticLocationProvider.From(_configMock.Object));

        // Run once to give the job a live marker, then pin the fake edge to a rule from an earlier run.
        await job.BaseRun();
        capturedExpression = "request.headers['x-adapi-armor'] == 'a-previous-run-marker'";

        var result = await job.RunLocation(new Location { Name = "loc1", DisplayName = "Loc 1" },
            CancellationToken.None);

        Assert.False(result.Done);
        Assert.False(result.Errored);
    }

    /// <summary>Stands in for the edge: 403 when the rule in force matches the probe's marker header, else 200.</summary>
    private static SerializableHttpResponse BuildEdgeResponse(NATSHttpRequest request, string ruleExpression)
    {
        var blocked = request.Headers.TryGetValue(ProbeHeader, out var marker)
                      && string.IsNullOrEmpty(marker) == false
                      && ruleExpression.Contains($"'{marker}'");

        return new SerializableHttpResponse
        {
            WasSuccess = blocked == false,
            StatusCode = blocked ? HttpStatusCode.Forbidden : HttpStatusCode.OK,
            Headers = new Dictionary<string, string>(),
            ResponseUTC = DateTime.UtcNow,
            ResponseTimeMs = 10,
        };
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
