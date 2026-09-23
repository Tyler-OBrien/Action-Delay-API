using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Jobs.SimpleJob;
using Action_Delay_API_Core.Models.CloudflareAPI;
using Action_Delay_API_Core.Models.CloudflareAPI.SSL;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Pack = Action_Delay_API_Core.Models.CloudflareAPI.SSL.GetCertificatePacksResponse.CertificatePack;
using Cert = Action_Delay_API_Core.Models.CloudflareAPI.SSL.GetCertificatePacksResponse.Certificate;

namespace Action_Delay_API_Core_Tests.Jobs.SimpleJob;

/// <summary>Exposes the job's clock so a run can be placed at a chosen instant.</summary>
public class TestableCertificateDelayJob : CertificateDelayJob
{
    public TestableCertificateDelayJob(
        ICloudflareAPIBroker apiBroker,
        IOptions<LocalConfig> config,
        ILogger<CertificateDelayJob> logger,
        IQueue queue,
        IClickHouseService clickHouse,
        ActionDelayDatabaseContext dbContext)
        : base(apiBroker, config, logger, queue, clickHouse, dbContext, StaticLocationProvider.From(config))
    {
    }

    public DateTime Now { get; set; } = new DateTime(2026, 07, 27, 09, 00, 00, DateTimeKind.Utc);

    protected override DateTime UtcNow => Now;
}

public class CertificateDelayJobTests : IDisposable
{
    // Mirrors the live configuration this job runs against.
    private const string TargetHostname = "cert-test.cloudflare.chaika.me";
    private static readonly string[] OtherHostnames = { "gts-today.chaika.me", "cert.cloudflare.chaika.me" };

    private static readonly DateTime Now = new(2026, 07, 27, 09, 00, 00, DateTimeKind.Utc);

    private readonly ActionDelayDatabaseContext _context;
    private readonly Mock<ICloudflareAPIBroker> _brokerMock;
    private readonly Mock<IOptions<LocalConfig>> _configMock;
    private readonly Mock<ILogger<CertificateDelayJob>> _loggerMock;
    private readonly Mock<IClickHouseService> _clickhouseMock;
    private readonly Mock<IQueue> _queueMock;

    private readonly List<string> _deletedPackIds = new();
    private readonly List<string[]> _createdHostSets = new();

    public CertificateDelayJobTests()
    {
        var options = new DbContextOptionsBuilder<ActionDelayDatabaseContext>()
            .UseInMemoryDatabase(databaseName: $"TestCertDb_{Guid.NewGuid()}")
            .Options;
        _context = new ActionDelayDatabaseContext(options);

        _configMock = new Mock<IOptions<LocalConfig>>();
        _configMock.Setup(config => config.Value).Returns(new LocalConfig
        {
            Locations = new List<Location>(),
            CertRenewalDelayJob = new CertificateRenewalDelayJob
            {
                Enabled = true,
                API_Key = "test-token",
                ZoneId = "157b13f12106d3eab0a529ed277da0ec",
                TargetHostname = TargetHostname,
                OtherCertificateHostnames = OtherHostnames
            }
        });

        _loggerMock = new Mock<ILogger<CertificateDelayJob>>();
        _clickhouseMock = new Mock<IClickHouseService>();
        _queueMock = new Mock<IQueue>();
        _brokerMock = new Mock<ICloudflareAPIBroker>();

        _brokerMock
            .Setup(broker => broker.DeleteCertificatePack(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Returns((string packId, string _, string _, CancellationToken _) =>
            {
                _deletedPackIds.Add(packId);
                return Task.FromResult(Result.Ok(new ApiResponse<DeleteCertificatePackResponse>
                {
                    Success = true,
                    Result = new DeleteCertificatePackResponse()
                }));
            });

        _brokerMock
            .Setup(broker => broker.CreateCertificatePack(It.IsAny<string>(), It.IsAny<string[]>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .Returns((string _, string[] hosts, string _, CancellationToken _) =>
            {
                _createdHostSets.Add(hosts);
                return Task.FromResult(Result.Ok(new ApiResponse<OrderCertificatePackResponse>
                {
                    Success = true,
                    Result = new OrderCertificatePackResponse { Id = Guid.NewGuid().ToString(), Status = "initializing" }
                }));
            });
    }

    // ---------------------------------------------------------------- fixtures

    /// <summary>
    /// Builds a pack shaped like the live API response: the configured hostnames plus one generated
    /// label, and a pair of RSA/ECDSA certificates of which one is primary.
    /// </summary>
    private static Pack MakePack(string id, string status, DateTime createdOn, DateTime? expiresOn,
        string[]? hosts = null, string type = "advanced", long validityDays = 14)
    {
        var packHosts = hosts ?? OtherHostnames.Append($"{Guid.NewGuid():N}.{TargetHostname}").ToArray();

        var pack = new Pack
        {
            Id = id,
            Type = type,
            Status = status,
            Hosts = packHosts,
            CreatedOn = createdOn,
            ValidityDays = validityDays,
            ValidationMethod = "txt",
            CertificateAuthority = "google"
        };

        if (expiresOn == null)
        {
            // What Cloudflare actually returns for an unissued pack - note "0", not null.
            pack.PrimaryCertificate = "0";
            pack.Certificates = Array.Empty<Cert>();
            return pack;
        }

        var primaryId = $"{id}-rsa";
        pack.PrimaryCertificate = primaryId;
        pack.Certificates = new[]
        {
            new Cert { Id = primaryId, Hosts = packHosts, Status = "active", Signature = "SHA256WithRSA", ExpiresOn = expiresOn.Value },
            new Cert { Id = $"{id}-ecdsa", Hosts = packHosts, Status = "active", Signature = "ECDSAWithSHA256", ExpiresOn = expiresOn.Value.AddMinutes(2) }
        };
        return pack;
    }

    /// <summary>An active rung expiring <paramref name="expiresInDays"/> from the test's "now".</summary>
    private static Pack ActivePack(string id, double expiresInDays, double createdDaysAgo = 400) =>
        MakePack(id, "active", Now.AddDays(-createdDaysAgo), Now.AddDays(expiresInDays));

    private static Pack PendingPack(string id, double createdHoursAgo = 0.1) =>
        MakePack(id, "pending_validation", Now.AddHours(-createdHoursAgo), null);

    private static Pack DeadPack(string id, double createdDaysAgo = 59) =>
        MakePack(id, "validation_timed_out", Now.AddDays(-createdDaysAgo), null);

    private void GivenPacks(params Pack[] packs) =>
        _brokerMock
            .Setup(broker => broker.ListCertificatePacks(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Ok(new ApiResponse<Pack[]>
            {
                Success = true,
                Result = packs,
                ResponseTimeMs = 42
            }));

    private TestableCertificateDelayJob CreateJob(DateTime? now = null) =>
        new(_brokerMock.Object, _configMock.Object, _loggerMock.Object, _queueMock.Object,
            _clickhouseMock.Object, _context)
        {
            Now = now ?? Now
        };

    // ---------------------------------------------------------------- deletion safety

    [Fact]
    public async Task RunAction_PendingAndDeadPacksBothLackPrimaryCert_DoesNotDeletePendingPack()
    {
        // The original bug: an unissued pack has no expiry, so every pack without one collapsed into a
        // single 0001-01-01 group and the dedupe deleted the newer of them - i.e. the fresh order.
        GivenPacks(
            DeadPack("dead-pack"),
            PendingPack("fresh-order"),
            ActivePack("ladder", expiresInDays: 14));

        await CreateJob().BaseRun();

        Assert.DoesNotContain("fresh-order", _deletedPackIds);
    }

    [Fact]
    public async Task RunAction_DeadPackMatchingFingerprint_IsDeleted()
    {
        GivenPacks(DeadPack("dead-pack"), ActivePack("ladder", expiresInDays: 14));

        await CreateJob().BaseRun();

        Assert.Equal(new[] { "dead-pack" }, _deletedPackIds);
    }

    [Fact]
    public async Task RunAction_DeadPackWithForeignHostSet_IsNotDeleted()
    {
        // Same status, same zone, but not a host set this job would ever have ordered.
        var foreign = MakePack("someone-elses", "validation_timed_out", Now.AddDays(-59), null,
            hosts: new[] { "manual.cert-test.cloudflare.chaika.me" });

        GivenPacks(foreign, ActivePack("ladder", expiresInDays: 14));

        await CreateJob().BaseRun();

        Assert.Empty(_deletedPackIds);
    }

    [Fact]
    public async Task RunAction_DeadPackWithWrongValidityDays_IsNotDeleted()
    {
        var longLived = MakePack("ninety-day", "validation_timed_out", Now.AddDays(-59), null, validityDays: 90);

        GivenPacks(longLived, ActivePack("ladder", expiresInDays: 14));

        await CreateJob().BaseRun();

        Assert.Empty(_deletedPackIds);
    }

    [Fact]
    public async Task RunAction_UnrecognisedStatus_IsNeverDeleted()
    {
        // Cloudflare's published status list did not include validation_timed_out either. The next
        // undocumented status must fall through to "leave it alone".
        GivenPacks(
            MakePack("brand-new-status", "some_future_status", Now.AddDays(-59), null),
            ActivePack("ladder", expiresInDays: 14));

        await CreateJob().BaseRun();

        Assert.Empty(_deletedPackIds);
    }

    [Fact]
    public async Task RunAction_DeactivatingPack_IsNeitherDeletedNorCountedAsActive()
    {
        // A deactivating pack sits at the 14-day mark. If it counted as a rung the job would skip the
        // order; if it were deletable the job would keep re-deleting a pack already on its way out.
        GivenPacks(
            MakePack("on-its-way-out", "deactivating", Now.AddDays(-400), Now.AddDays(14)),
            ActivePack("far-away", expiresInDays: 3));

        await CreateJob().BaseRun();

        Assert.Empty(_deletedPackIds);
        Assert.Single(_createdHostSets);
    }

    [Fact]
    public async Task RunAction_TwoActivePacksSeventeenHoursApart_DeletesNeither()
    {
        // The live ladder: same calendar day, opposite half-day slots. The old bucket grouping called
        // these duplicates and culled one every run.
        GivenPacks(
            ActivePack("early", expiresInDays: 8 + (5.5 / 24)),
            ActivePack("late", expiresInDays: 8 + (22.5 / 24)));

        await CreateJob().BaseRun();

        Assert.Empty(_deletedPackIds);
    }

    [Fact]
    public async Task RunAction_TwoActivePacksThreeHoursApart_DeletesTheNewerOne()
    {
        GivenPacks(
            ActivePack("established", expiresInDays: 8, createdDaysAgo: 400),
            ActivePack("johnny-come-lately", expiresInDays: 8 + (3.0 / 24), createdDaysAgo: 30));

        await CreateJob().BaseRun();

        Assert.Equal(new[] { "johnny-come-lately" }, _deletedPackIds);
    }

    [Fact]
    public async Task RunAction_ManyRedundantPacks_StopsAtTheDeleteCap()
    {
        // Five rungs stacked an hour apart. Whatever is going on, it is not something to fix by deleting
        // the ladder in one pass.
        GivenPacks(Enumerable.Range(0, 6)
            .Select(index => ActivePack($"stacked-{index}", expiresInDays: 8 + (index / 24.0), createdDaysAgo: 400 - index))
            .ToArray());

        await CreateJob().BaseRun();

        Assert.Equal(CertificateDelayJob.MaxDeletesPerRun, _deletedPackIds.Count);
    }

    [Fact]
    public async Task RunAction_DeleteFails_DoesNotFailTheRun()
    {
        GivenPacks(DeadPack("dead-pack"), ActivePack("ladder", expiresInDays: 14));
        _brokerMock
            .Setup(broker => broker.DeleteCertificatePack(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Fail<ApiResponse<DeleteCertificatePackResponse>>("nope"));

        var job = CreateJob();
        await job.BaseRun();

        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.NotEqual(Status.STATUS_ERRORED, jobData.CurrentRunStatus);
        Assert.NotEqual(Status.STATUS_API_ERROR, jobData.CurrentRunStatus);
    }

    // ---------------------------------------------------------------- order decision

    [Fact]
    public async Task RunAction_PackExpiringNearTheTarget_DoesNotOrder()
    {
        GivenPacks(ActivePack("covers-it", expiresInDays: 14 + (4.0 / 24)));

        await CreateJob().BaseRun();

        Assert.Empty(_createdHostSets);
    }

    [Fact]
    public async Task RunAction_GapAtTheTarget_OrdersExactlyOnePack()
    {
        GivenPacks(
            ActivePack("near-side", expiresInDays: 13),
            ActivePack("far-side", expiresInDays: 15));

        await CreateJob().BaseRun();

        var ordered = Assert.Single(_createdHostSets);
        Assert.Equal(OtherHostnames.Length + 1, ordered.Length);
        Assert.All(OtherHostnames, hostname => Assert.Contains(hostname, ordered));
        Assert.Contains(ordered, host => CertificateDelayJob.IsGeneratedHost(host, TargetHostname));
    }

    [Fact]
    public async Task RunAction_OrderInFlight_DoesNotOrderAgain()
    {
        GivenPacks(
            ActivePack("far-away", expiresInDays: 3),
            PendingPack("already-ordered"));

        await CreateJob().BaseRun();

        Assert.Empty(_createdHostSets);
    }

    [Fact]
    public async Task RunAction_PackOrderedTwoHoursAgo_DoesNotOrderAgain()
    {
        // The brake that stops the order/delete loop: a pack that has only just gone active still counts.
        GivenPacks(MakePack("just-issued", "active", Now.AddHours(-2), Now.AddDays(3)));

        await CreateJob().BaseRun();

        Assert.Empty(_createdHostSets);
    }

    [Theory]
    [InlineData(9)]
    [InlineData(13)]
    public async Task RunAction_OrderDecisionDoesNotDependOnTimeOfDay(int hourOfDay)
    {
        // The old half-day bucketing flipped behaviour as the clock crossed noon.
        var now = new DateTime(2026, 07, 27, hourOfDay, 00, 00, DateTimeKind.Utc);
        GivenPacks(MakePack("near-side", "active", now.AddDays(-400), now.AddDays(13)));

        await CreateJob(now).BaseRun();

        Assert.Single(_createdHostSets);
    }

    [Fact]
    public async Task RunAction_CreateFails_RecordsAnApiError()
    {
        GivenPacks(ActivePack("far-away", expiresInDays: 3));
        _brokerMock
            .Setup(broker => broker.CreateCertificatePack(It.IsAny<string>(), It.IsAny<string[]>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Fail<ApiResponse<OrderCertificatePackResponse>>("rate limited"));

        var job = CreateJob();

        await Assert.ThrowsAsync<CustomAPIError>(() => job.BaseRun());

        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.Equal(Status.STATUS_API_ERROR, jobData.CurrentRunStatus);
    }

    [Fact]
    public async Task RunAction_ListFails_RecordsAnApiErrorAndTouchesNothing()
    {
        _brokerMock
            .Setup(broker => broker.ListCertificatePacks(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Fail<ApiResponse<Pack[]>>("upstream down"));

        var job = CreateJob();

        await Assert.ThrowsAsync<CustomAPIError>(() => job.BaseRun());

        Assert.Empty(_deletedPackIds);
        Assert.Empty(_createdHostSets);
        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.Equal(Status.STATUS_API_ERROR, jobData.CurrentRunStatus);
    }

    // ---------------------------------------------------------------- delay metric

    [Fact]
    public async Task RunAction_OverduePack_ReportsTheOvershootAndGoesUndeployed()
    {
        // Renewal is due 4 days before expiry; this pack is 6 hours past that.
        GivenPacks(ActivePack("overdue", expiresInDays: CertificateDelayJob.RenewalWindowDays - (6.0 / 24)));

        var job = CreateJob();
        await job.BaseRun();

        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.Equal(Status.STATUS_UNDEPLOYED, jobData.CurrentRunStatus);
        Assert.Equal(TimeSpan.FromHours(6).TotalMilliseconds, jobData.CurrentRunLengthMs!.Value, 1000d);
    }

    [Fact]
    public async Task RunAction_OverduePackIsNotActive_IsExcludedFromTheDelay()
    {
        // A deactivating pack whose certificate expired months ago would otherwise peg the metric forever.
        GivenPacks(
            MakePack("long-abandoned", "deactivating", Now.AddDays(-400), Now.AddDays(-90)),
            ActivePack("healthy", expiresInDays: 14));

        var job = CreateJob();
        await job.BaseRun();

        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.NotEqual(Status.STATUS_UNDEPLOYED, jobData.CurrentRunStatus);
    }

    [Fact]
    public async Task RunAction_NothingOverdue_DoesNotFlipStatusOrRecordARun()
    {
        GivenPacks(ActivePack("healthy", expiresInDays: 14));

        var job = CreateJob();
        await job.BaseRun();

        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.NotEqual(Status.STATUS_UNDEPLOYED, jobData.CurrentRunStatus);
        Assert.NotEqual(Status.STATUS_DEPLOYED, jobData.CurrentRunStatus);
        _clickhouseMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task RunAction_OverdueThenCaughtUp_PublishesTheDelayOnce()
    {
        // The measurement is the overdue -> caught-up edge, and it is the only thing that reaches ClickHouse.
        GivenPacks(ActivePack("overdue", expiresInDays: CertificateDelayJob.RenewalWindowDays - (6.0 / 24)));
        var job = CreateJob();
        await job.BaseRun();

        GivenPacks(ActivePack("overdue", expiresInDays: 14));
        await CreateJob().BaseRun();

        var jobData = await _context.JobData.FirstAsync(data => data.InternalJobName == job.InternalName);
        Assert.Equal(Status.STATUS_DEPLOYED, jobData.LastRunStatus);
        Assert.Equal(TimeSpan.FromHours(6).TotalMilliseconds, jobData.LastRunLengthMs!.Value, 1000d);
    }

    // ---------------------------------------------------------------- host matching

    [Theory]
    [InlineData("cert-test.cloudflare.chaika.me", true)]
    [InlineData("abc.cert-test.cloudflare.chaika.me", true)]
    [InlineData("notcert-test.cloudflare.chaika.me", false)]
    [InlineData("cert-test.cloudflare.chaika.me.evil.com", false)]
    [InlineData("", false)]
    public void IsUnderHostname_MatchesOnLabelBoundaries(string host, bool expected) =>
        Assert.Equal(expected, CertificateDelayJob.IsUnderHostname(host, TargetHostname));

    [Theory]
    [InlineData("0810281b8e1244dc8de0b3311d05d007.cert-test.cloudflare.chaika.me", true)]
    [InlineData("0810281B8E1244DC8DE0B3311D05D007.cert-test.cloudflare.chaika.me", true)]
    [InlineData("manual.cert-test.cloudflare.chaika.me", false)]
    [InlineData("0810281b8e1244dc8de0b3311d05d0zz.cert-test.cloudflare.chaika.me", false)]
    [InlineData("0810281b8e1244dc8de0b3311d05d00.cert-test.cloudflare.chaika.me", false)]
    public void IsGeneratedHost_MatchesOnlyTheGuidLabelWeIssue(string host, bool expected) =>
        Assert.Equal(expected, CertificateDelayJob.IsGeneratedHost(host, TargetHostname));

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
