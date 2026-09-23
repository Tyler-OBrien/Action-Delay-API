using Action_Delay_API_Core.Services.Locations;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.CloudflareAPI.SSL;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Jobs.SimpleJob
{
    /// <summary>
    /// Maintains a rolling ladder of short-lived certificate packs on one zone so that Cloudflare's
    /// auto-renew fires continuously, and reports how late those renewals are.
    /// </summary>
    /// <remarks>
    /// The ladder is self-sustaining: Cloudflare renews each pack a few days before it expires, which
    /// pushes its expiry forward. This job only tops the ladder up when a gap opens near the far end,
    /// and prunes rungs that have bunched together. Everything here is spacing arithmetic on
    /// <c>expires_on</c> - deliberately not on the slot a pack was originally ordered for, since
    /// renewals move expiry times far away from that over a pack's lifetime.
    /// </remarks>
    public class CertificateDelayJob : BaseJob
    {
        private readonly ICloudflareAPIBroker _apiBroker;

        /// <summary>
        /// Half-width of a ladder rung. Two packs expiring closer together than this are redundant, and
        /// the job orders a replacement only when nothing expires within this distance of the target.
        /// One threshold drives both decisions so they can never disagree and undo each other's work.
        /// </summary>
        public static readonly TimeSpan SlotRadius = TimeSpan.FromHours(6);

        /// <summary>
        /// How far ahead of expiry Cloudflare renews. Anything still un-renewed past this point is late,
        /// and the overshoot is what this job publishes as the delay.
        /// </summary>
        public const int RenewalWindowDays = 4;

        /// <summary>
        /// Ceiling on deletions in a single run. The ladder only ever needs to shed a rung at a time, so
        /// anything above this means the pack list is not what we think it is - stop and let a human look.
        /// </summary>
        public const int MaxDeletesPerRun = 2;

        /// <summary>Length of the <c>Guid.ToString("N")</c> label this job prepends when ordering.</summary>
        private const int GeneratedLabelLength = 32;

        public CertificateDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CertificateDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext, ILocationProvider locationProvider) : base(config, logger, clickHouse, dbContext, queue, locationProvider)
        {
            _apiBroker = apiBroker;
        }
        public override int TargetExecutionSecond => 25;
        public override bool Enabled => _config.CertRenewalDelayJob != null && (_config.CertRenewalDelayJob.Enabled.HasValue == false || _config.CertRenewalDelayJob is { Enabled: true });

        /// <summary>Overridable so tests can place a run at a chosen instant.</summary>
        protected virtual DateTime UtcNow => DateTime.UtcNow;

        public async override Task BaseRun()
        {
            using var scope = _logger.BeginScope(Name);
            using var sentryScope = SentrySdk.PushScope();

            SentrySdk.AddBreadcrumb($"Starting Job {Name}");
            try
            {
                var cancellationTokenSource = new CancellationTokenSource();
                // Pre-init job and locations in database
                _logger.LogInformation($"Trying to find job {Name} in dbContext {_dbContext.ContextId}");
                JobData = await _dbContext.JobData.AsTracking().FirstOrDefaultAsync(job => job.InternalJobName == InternalName);
                if (JobData == null)
                {
                    var newJobData = new JobData()
                    {
                        JobName = Name,
                        InternalJobName = InternalName,
                        JobDescription = JobDescription,
                        JobType = JobType,
                    };
                    _dbContext.JobData.Add(newJobData);
                    await TrySave(true);
                    JobData = await _dbContext.JobData.AsTracking().FirstAsync(job => job.InternalJobName == InternalName);
                    JobData.CurrentRunStatus = Status.STATUS_PENDING;
                    JobData.CurrentRunLengthMs = null;
                    JobData.CurrentRunTime = DateTime.UtcNow;
                }
                /*
                 Deliberately no "else" branch rolling Current* into Last*: unlike every other job, this one
                 carries CurrentRunStatus across runs as a state machine. A pack that is overdue leaves the
                 job Undeployed until the renewal lands, and that transition is what publishes the delay.
                */

                JobData.JobType = JobType;
                JobData.JobDescription = JobDescription;

                SentrySdk.AddBreadcrumb($"Got Job Data: {JobData.CurrentRunStatus}");

                // Execute the action for this Job
                try
                {
                    await RunAction();
                }
                catch (CustomAPIError ex)
                {
                    _logger.LogWarning(ex, "Run for {jobName} failed due to API Issues: {err}", this.Name, ex.Message);
                    this.JobData.CurrentRunStatus = Status.STATUS_API_ERROR;
                    JobRunOutcome = RunOutcome.ApiError;
                    await InsertRunFailure(Status.STATUS_API_ERROR, ex);
                    throw;
                }
                catch (Exception)
                {
                    this.JobData.CurrentRunStatus = Status.STATUS_ERRORED;
                    JobRunOutcome = RunOutcome.JobError;
                    await InsertRunFailure(Status.STATUS_ERRORED, null);
                    throw;
                }

            }
            finally
            {
                await TrySave(true);
                // await _queue.DisposeAsync();
            }
        }

        public override async Task RunAction()
        {
            var config = _config.CertRenewalDelayJob;

            var listCertificatePacks = await _apiBroker.ListCertificatePacks(config.ZoneId,
                config.API_Key, CancellationToken.None);
            if (listCertificatePacks.IsFailed)
            {
                var listError = listCertificatePacks.Errors?.FirstOrDefault();
                _logger.LogCritical("Failure listing certificate packs, logs: {error}", listError?.Message);
                if (listError is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError($"Failure listing certificate packs, logs: {listError?.Message}");
            }

            this.JobData.APIResponseTimeUtc = listCertificatePacks.Value.ResponseTimeMs;

            var allPacks = listCertificatePacks.Value.Result ?? Array.Empty<GetCertificatePacksResponse.CertificatePack>();

            // Broad first pass: anything mentioning our hostname is ours to reason about. Deleting needs a
            // far stricter test (IsOurCertificatePack) - this one only decides what we look at.
            var ourPacks = allPacks
                .Where(pack => pack.Hosts != null && pack.Hosts.Any(host => IsUnderHostname(host, config.TargetHostname)))
                .ToList();

            var activePacks = ourPacks.Where(pack => pack.IsActive).ToList();
            var pendingPacks = ourPacks.Where(pack => pack.IsPending).ToList();
            var deadPacks = ourPacks.Where(pack => pack.IsDead).ToList();
            var otherPacks = ourPacks.Where(pack => !pack.IsActive && !pack.IsPending && !pack.IsDead).ToList();

            _logger.LogInformation(
                "Certificate packs: {totalOnZone} on zone, {ourCount} under {targetHostname} - {activeCount} active, {pendingCount} pending, {deadCount} dead, {otherCount} other. Statuses: {statusBreakdown}",
                allPacks.Length, ourPacks.Count, config.TargetHostname,
                activePacks.Count, pendingPacks.Count, deadPacks.Count, otherPacks.Count,
                DescribeStatuses(ourPacks));

            // Anything not counting towards the ladder gets named. This is the line that makes a stuck pack
            // obvious instead of it silently poisoning the dedupe for two months.
            foreach (var pack in pendingPacks)
                _logger.LogInformation("Pack {packId} is in flight ({status}, ordered {createdOn:u}) - not a ladder rung yet, and never a delete candidate", pack.Id, pack.Status, pack.CreatedOn);
            foreach (var pack in deadPacks)
                _logger.LogWarning("Pack {packId} is dead ({status}, ordered {createdOn:u}) - it will never issue a certificate", pack.Id, pack.Status, pack.CreatedOn);
            foreach (var pack in otherPacks)
                _logger.LogInformation("Pack {packId} is {status} with primaryCertificate={hasPrimary} - ignoring, neither a ladder rung nor safe to touch", pack.Id, pack.Status, pack.GetPrimaryCertificate != null);

            var deletedPackIds = await PruneCertificatePacks(config, activePacks, deadPacks);
            if (deletedPackIds.Count > 0)
            {
                // Keep the working set honest: the delay figure below must not count packs we just removed.
                activePacks.RemoveAll(pack => deletedPackIds.Contains(pack.Id));
                ourPacks.RemoveAll(pack => deletedPackIds.Contains(pack.Id));
            }

            await MaintainLadder(config, activePacks, pendingPacks, ourPacks);

            await ReportRenewalDelay(activePacks);
        }

        /// <summary>
        /// Removes packs that can never issue, and rungs that have bunched together closer than
        /// <see cref="SlotRadius"/>. Returns the ids actually deleted.
        /// </summary>
        private async Task<HashSet<string>> PruneCertificatePacks(
            CertificateRenewalDelayJob config,
            List<GetCertificatePacksResponse.CertificatePack> activePacks,
            List<GetCertificatePacksResponse.CertificatePack> deadPacks)
        {
            var candidates = new List<(GetCertificatePacksResponse.CertificatePack Pack, string Reason)>();

            // Dead packs never age out of the list on their own, and an unissued pack has no expiry date.
            // Left in place they collide with every freshly ordered pack forever.
            foreach (var deadPack in deadPacks)
                candidates.Add((deadPack, $"dead: {deadPack.Status} since {deadPack.CreatedOn:u}"));

            // Walk the ladder in expiry order and drop rungs sitting on top of an existing one. Anchoring on
            // the pack we decided to keep (rather than comparing neighbours pairwise) guarantees we never
            // schedule a pack for deletion and then measure the next one against it.
            var byExpiry = activePacks
                .OrderBy(pack => pack.GetPrimaryCertificate!.ExpiresOn)
                .ToList();
            var anchor = byExpiry.FirstOrDefault();
            for (var index = 1; index < byExpiry.Count; index++)
            {
                var current = byExpiry[index];
                var apart = current.GetPrimaryCertificate!.ExpiresOn - anchor!.GetPrimaryCertificate!.ExpiresOn;
                if (apart >= SlotRadius)
                {
                    anchor = current;
                    continue;
                }

                // Keep the older pack - it is the established rung and the one Cloudflare has been renewing.
                var keep = anchor.CreatedOn <= current.CreatedOn ? anchor : current;
                var drop = ReferenceEquals(keep, anchor) ? current : anchor;
                candidates.Add((drop, $"redundant: expires {apart.TotalHours:F1}h from {keep.Id}, keeping {keep.Id} since it was oldest (ordered {keep.CreatedOn:u})"));
                anchor = keep;
            }

            var deletedPackIds = new HashSet<string>(StringComparer.Ordinal);
            if (candidates.Count == 0)
                return deletedPackIds;

            var attempted = 0;
            foreach (var (pack, reason) in candidates)
            {
                if (attempted >= MaxDeletesPerRun)
                {
                    _logger.LogWarning(
                        "Delete cap of {cap} reached, leaving {remaining} pack(s) until the next run: {skipped}",
                        MaxDeletesPerRun, candidates.Count - attempted,
                        String.Join(", ", candidates.Skip(attempted).Select(candidate => candidate.Pack.Id)));
                    break;
                }

                if (IsOurCertificatePack(pack, config) == false)
                {
                    _logger.LogWarning(
                        "Refusing to delete pack {packId} ({reason}): hosts [{hosts}] type={type} validityDays={validityDays} do not fingerprint as a pack this job ordered",
                        pack.Id, reason, String.Join(", ", pack.Hosts ?? Array.Empty<string>()), pack.Type, pack.ValidityDays);
                    continue;
                }

                attempted++;
                _logger.LogWarning("Deleting certificate pack {packId} - {reason}", pack.Id, reason);

                var deleteCertificatePack = await _apiBroker.DeleteCertificatePack(pack.Id,
                    config.ZoneId, config.API_Key, CancellationToken.None);
                if (deleteCertificatePack.IsFailed)
                {
                    // Non-fatal: a pack we could not remove is untidy, not broken. The next run retries it.
                    _logger.LogError("Failure deleting certificate pack {packId}, logs: {error}",
                        pack.Id, deleteCertificatePack.Errors?.FirstOrDefault()?.Message);
                    continue;
                }

                deletedPackIds.Add(pack.Id);
            }

            return deletedPackIds;
        }

        /// <summary>
        /// Orders one pack when a gap has opened near the far end of the ladder, and nothing already in
        /// flight covers it.
        /// </summary>
        private async Task MaintainLadder(
            CertificateRenewalDelayJob config,
            List<GetCertificatePacksResponse.CertificatePack> activePacks,
            List<GetCertificatePacksResponse.CertificatePack> pendingPacks,
            List<GetCertificatePacksResponse.CertificatePack> ourPacks)
        {
            var target = UtcNow.AddDays(OrderCertificatePackRequest.DefaultValidityDays);

            // Distance from a moving target, not occupancy of a fixed slot. Renewal drift means a pack no
            // longer expires anywhere near the slot it was ordered for, so slot equality reports phantom
            // gaps next to slots holding two packs - and the job then orders and deletes in the same run.
            GetCertificatePacksResponse.CertificatePack? nearestPack = null;
            var nearestDistance = TimeSpan.MaxValue;
            foreach (var pack in activePacks)
            {
                var distance = (pack.GetPrimaryCertificate!.ExpiresOn - target).Duration();
                if (distance >= nearestDistance) continue;
                nearestDistance = distance;
                nearestPack = pack;
            }

            var nearestDescription = nearestPack == null
                ? "none"
                : $"{nearestDistance.TotalHours:F1}h ({nearestPack.Id}, expires {nearestPack.GetPrimaryCertificate!.ExpiresOn:u})";

            // A pack ordered within the last rung is either still validating or has only just gone active.
            // Either way it already fills the gap, and without this the job re-orders every single run.
            var recentlyOrdered = ourPacks.Where(pack => pack.CreatedOn > UtcNow - SlotRadius).ToList();

            string? skipReason = null;
            if (nearestPack != null && nearestDistance < SlotRadius)
                skipReason = $"pack {nearestPack.Id} already expires {nearestDistance.TotalHours:F1}h from it";
            else if (pendingPacks.Count > 0)
                skipReason = $"{pendingPacks.Count} order(s) still validating ({String.Join(", ", pendingPacks.Select(pack => pack.Id))})";
            else if (recentlyOrdered.Count > 0)
                skipReason = $"{recentlyOrdered.Count} pack(s) ordered within the last {SlotRadius.TotalHours:F0}h ({String.Join(", ", recentlyOrdered.Select(pack => pack.Id))})";

            if (skipReason != null)
            {
                _logger.LogInformation(
                    "Not ordering for {target:u}: {reason}. Nearest active expiry {nearest}, slot radius {radius}h.",
                    target, skipReason, nearestDescription, SlotRadius.TotalHours);
                return;
            }

            var hostsToOrder = (config.OtherCertificateHostnames ?? Array.Empty<string>()).ToList();
            hostsToOrder.Add($"{Guid.NewGuid():N}.{config.TargetHostname}");

            _logger.LogInformation(
                "Ordering a certificate for {target:u}: nearest active expiry {nearest} is outside the {radius}h slot radius. Hosts: {hosts}",
                target, nearestDescription, SlotRadius.TotalHours, String.Join(", ", hostsToOrder));

            var createCertificatePack = await _apiBroker.CreateCertificatePack(config.ZoneId,
                hostsToOrder.ToArray(), config.API_Key, CancellationToken.None);
            if (createCertificatePack.IsFailed)
            {
                // Throw only after the call has been made. Worker.RunJobAsync retries BaseRun on a fresh
                // scope, and throwing any earlier would let a retry place a second order.
                var createError = createCertificatePack.Errors?.FirstOrDefault();
                _logger.LogCritical("Failure creating certificate pack, logs: {error}", createError?.Message);
                if (createError is CustomAPIError createApiError) throw createApiError;
                throw new CustomAPIError($"Failure creating certificate pack, logs: {createError?.Message}");
            }

            _logger.LogInformation("Ordered certificate pack {packId} ({status}) for {target:u}",
                createCertificatePack.Value.Result?.Id, createCertificatePack.Value.Result?.Status, target);
        }

        /// <summary>
        /// Publishes how far past its renewal date the most overdue pack is, and flips the job back to
        /// Deployed once everything has caught up.
        /// </summary>
        private async Task ReportRenewalDelay(List<GetCertificatePacksResponse.CertificatePack> activePacks)
        {
            // Active packs only: a pending pack has nothing to renew, and a dead or deactivating one would
            // sit past its renewal date forever and peg this figure permanently.
            TimeSpan maxSpan = TimeSpan.MinValue;
            GetCertificatePacksResponse.CertificatePack? latestPack = null;
            foreach (var automatedCertPack in activePacks)
            {
                var renewalDate = automatedCertPack.GetPrimaryCertificate!.ExpiresOn.AddDays(-RenewalWindowDays);
                if (UtcNow <= renewalDate) continue;

                var timeOver = UtcNow - renewalDate;
                if (timeOver <= maxSpan) continue;
                maxSpan = timeOver;
                latestPack = automatedCertPack;
            }

            if (TimeSpan.MinValue == maxSpan)
            {
                _logger.LogInformation("No pack is past its renewal date ({window} days before expiry) - nothing overdue across {activeCount} active pack(s)",
                    RenewalWindowDays, activePacks.Count);
                // Only the overdue -> caught-up edge is a measurement. Steady-state "nothing is late" says
                // nothing new, so it stays unrecorded.
                if (this.JobData.CurrentRunStatus == Status.STATUS_UNDEPLOYED)
                {
                    this.JobData.CurrentRunStatus = Status.STATUS_DEPLOYED;
                    JobRunOutcome = RunOutcome.Deployed;
                    await InsertRunResult();
                    this.JobData.LastRunLengthMs = this.JobData.CurrentRunLengthMs;
                    this.JobData.LastRunStatus = Status.STATUS_DEPLOYED;
                    this.JobData.LastRunTime = DateTime.UtcNow;
                    JobData.CurrentRunStatus = Status.STATUS_PENDING;
                    JobData.CurrentRunLengthMs = null;
                    JobData.CurrentRunTime = DateTime.UtcNow;
                    await TrySave(true);
                }
            }
            else
            {
                _logger.LogInformation("Pack {packId} is {hours} hours past its renewal date (expires {expiresOn:u}) - reporting it as the current certificate delay",
                    latestPack!.Id, maxSpan.TotalHours.ToString("F"), latestPack.GetPrimaryCertificate!.ExpiresOn);

                this.JobData.CurrentRunLengthMs = (ulong?)maxSpan.TotalMilliseconds;
                this.JobData.CurrentRunStatus = Status.STATUS_UNDEPLOYED;
                this.JobData.CurrentRunTime = DateTime.UtcNow;
                await TrySave(true);
            }
        }

        /// <summary>
        /// Matches a hostname on a label boundary. Plain EndsWith also matches "nottarget.example.com"
        /// against "target.example.com".
        /// </summary>
        public static bool IsUnderHostname(string host, string targetHostname)
        {
            if (String.IsNullOrWhiteSpace(host) || String.IsNullOrWhiteSpace(targetHostname)) return false;
            if (host.Equals(targetHostname, StringComparison.OrdinalIgnoreCase)) return true;
            return host.Length > targetHostname.Length + 1
                   && host.EndsWith(targetHostname, StringComparison.OrdinalIgnoreCase)
                   && host[host.Length - targetHostname.Length - 1] == '.';
        }

        /// <summary>
        /// True only for packs this job demonstrably ordered: exactly the configured hostname set plus one
        /// "{guid}.{TargetHostname}" label, as a short-lived advanced pack.
        /// </summary>
        /// <remarks>
        /// Deleting a certificate pack cannot be undone, and <see cref="IsUnderHostname"/> is far too loose
        /// to authorise it - a hand-created pack covering the same hostname would sail straight through.
        /// </remarks>
        public static bool IsOurCertificatePack(GetCertificatePacksResponse.CertificatePack pack, CertificateRenewalDelayJob config)
        {
            if (pack.Hosts == null) return false;
            if ("advanced".Equals(pack.Type, StringComparison.OrdinalIgnoreCase) == false) return false;
            if (pack.ValidityDays != OrderCertificatePackRequest.DefaultValidityDays) return false;

            var otherHostnames = config.OtherCertificateHostnames ?? Array.Empty<string>();
            if (pack.Hosts.Length != otherHostnames.Length + 1) return false;

            // Cloudflare returns hosts in its own order, so match as a set rather than a sequence.
            var remaining = pack.Hosts.ToList();
            foreach (var expected in otherHostnames)
            {
                var match = remaining.FirstOrDefault(host => host.Equals(expected, StringComparison.OrdinalIgnoreCase));
                if (match == null) return false;
                remaining.Remove(match);
            }

            return remaining.Count == 1 && IsGeneratedHost(remaining[0], config.TargetHostname);
        }

        /// <summary>Matches the "{Guid:N}.{TargetHostname}" label this job generates when ordering.</summary>
        public static bool IsGeneratedHost(string host, string targetHostname)
        {
            if (String.IsNullOrWhiteSpace(host) || String.IsNullOrWhiteSpace(targetHostname)) return false;
            if (host.Length != GeneratedLabelLength + 1 + targetHostname.Length) return false;
            if (host[GeneratedLabelLength] != '.') return false;
            if (host.EndsWith(targetHostname, StringComparison.OrdinalIgnoreCase) == false) return false;

            for (var index = 0; index < GeneratedLabelLength; index++)
            {
                if (Uri.IsHexDigit(host[index]) == false) return false;
            }

            return true;
        }

        private static string DescribeStatuses(IEnumerable<GetCertificatePacksResponse.CertificatePack> packs) =>
            String.Join(", ", packs
                .GroupBy(pack => pack.Status ?? "(null)")
                .OrderByDescending(group => group.Count())
                .Select(group => $"{group.Key} x{group.Count()}"));

        public override string Name => "Certificate Renewal Delay Job";
        public override string InternalName => "cert";

        public override string JobType => "CloudflareDelay";

        public override string JobDescription => "Tracking delay of certificates being renewed";

    }
}
