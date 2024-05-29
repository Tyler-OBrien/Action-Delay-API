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
using Action_Delay_API_Core.Models.Local;
using System.Runtime.ConstrainedExecution;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Jobs.SimpleJob
{
    /* WIP - Creating Certs currently */
    public class CertificateDelayJob : BaseJob
    {
        public CertificateDelayJob(ICloudflareAPIBroker apiBroker, IOptions<LocalConfig> config, ILogger<CertificateDelayJob> logger, IQueue queue, IClickHouseService clickHouse, ActionDelayDatabaseContext dbContext) : base(apiBroker, config, logger, clickHouse, dbContext, queue)
        {
        }
        public override int TargetExecutionSecond => 25;
        public override bool Enabled => _config.CertRenewalDelayJob != null && (_config.CertRenewalDelayJob.Enabled.HasValue == false || _config.CertRenewalDelayJob is { Enabled: true });

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
                    };
                    _dbContext.JobData.Add(newJobData);
                    await TrySave(true);
                    JobData = await _dbContext.JobData.AsTracking().FirstAsync(job => job.InternalJobName == InternalName);
                    JobData.CurrentRunStatus = Status.STATUS_PENDING;
                    JobData.CurrentRunLengthMs = null;
                    JobData.CurrentRunTime = DateTime.UtcNow;
                }
                /*
                else
                {
                    JobData.LastRunStatus = JobData.CurrentRunStatus;
                    JobData.LastRunLengthMs = JobData.CurrentRunLengthMs;
                    JobData.LastRunTime = JobData.CurrentRunTime;
                }
                */

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
                    await InsertRunFailure(Status.STATUS_API_ERROR, ex);
                    throw;
                }
                catch (Exception)
                {
                    this.JobData.CurrentRunStatus = Status.STATUS_ERRORED;
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



            var listCertificatePacks = await _apiBroker.ListCertificatePacks(_config.CertRenewalDelayJob.ZoneId,
                _config.CertRenewalDelayJob.API_Key, CancellationToken.None);
            if (listCertificatePacks.IsFailed)
            {
                _logger.LogCritical($"Failure listing certificate packs, logs: {listCertificatePacks.Errors?.FirstOrDefault()?.Message}");
                if (listCertificatePacks.Errors?.FirstOrDefault() is CustomAPIError apiError) throw apiError;
                throw new CustomAPIError(
                    $"Failure  listing certificate packs, logs: {listCertificatePacks.Errors?.FirstOrDefault()?.Message}");
                return;
            }


            var getAutomatedCertificatePacks = listCertificatePacks.Value.Result.Where(cert =>
                cert.Hosts.Any(host =>
                    host.EndsWith(_config.CertRenewalDelayJob.TargetHostname, StringComparison.OrdinalIgnoreCase))).ToList();

            var certsWithoutPrimaryCert = getAutomatedCertificatePacks.Count(cert => cert.GetPrimaryCertificate == null);
            if (certsWithoutPrimaryCert > 0) 
                _logger.LogWarning($"{certsWithoutPrimaryCert} certs without primary cert, ex: {String.Join(",", getAutomatedCertificatePacks.Where(cert => cert.GetPrimaryCertificate == null).Select(cert => cert.Id))}");

            var groupByDayCreatedOn =
                getAutomatedCertificatePacks.GroupBy(cert =>
                    new DateTime(cert.CreatedOn.Date.Ticks +
                                 (cert.CreatedOn.Hour >= 12 ? TimeSpan.FromHours(12).Ticks : 0))).ToList();
            var groupByDay =
                getAutomatedCertificatePacks.GroupBy(cert =>
                    new DateTime((cert.GetPrimaryCertificate?.ExpiresOn.Date.Ticks ?? 0) +
                        (cert.GetPrimaryCertificate?.ExpiresOn.Hour >= 12
                            ? TimeSpan.FromHours(12).Ticks
                            : 0))).ToList();
            foreach (var groupedByDay in groupByDay.Where(grp => grp.Count() > 1))
            {
                var certsGroupedByDay = groupedByDay.ToList();

                var certsTooFar = certsGroupedByDay.Where(cert =>
                    (cert.GetPrimaryCertificate?.ExpiresOn - groupedByDay.Key ?? TimeSpan.Zero).TotalHours > 12).ToList();
                if (certsTooFar.Any())
                {
                    _logger.LogWarning(
                        $"Found {String.Join(", ", certsTooFar.Select(cert => cert.Id))} certs too far from key {groupedByDay.Key}, {String.Join(", ", certsTooFar.Select(cert => cert.GetPrimaryCertificate?.ExpiresOn))}, removing");
                    foreach (var certToRemove in certsTooFar)
                    {
                        certsGroupedByDay.Remove(certToRemove);
                    }

                    if (certsGroupedByDay.Any())
                    {
                        _logger.LogWarning($"Not enough certs to delete to continue, aborting");
                        continue;
                    }
                }

                var firstCert = certsGroupedByDay.OrderBy(cert => cert.CreatedOn).First();
                _logger.LogWarning(
                    $"Found {String.Join(", ", certsGroupedByDay.Select(cert => cert.Id))} certs expiring on same day of {groupedByDay.Key}, {String.Join(", ", certsGroupedByDay.Select(cert => cert.GetPrimaryCertificate?.ExpiresOn))}, keeping {firstCert.Id} since it was newest");
                foreach (var certToDelete in certsGroupedByDay.Except(new[] { firstCert }))
                {
                    var deleteCertificatePack = await _apiBroker.DeleteCertificatePack(certToDelete.Id,
                        _config.CertRenewalDelayJob.ZoneId,
                        _config.CertRenewalDelayJob.API_Key, CancellationToken.None);
                    if (deleteCertificatePack.IsFailed)
                    {
                        _logger.LogCritical(
                            $"Failure deleting certificate pack {certToDelete.Id}, logs: {deleteCertificatePack.Errors?.FirstOrDefault()?.Message}");

                    }
                }
            }

            var adjustedNow =
                new DateTime(
                    DateTime.UtcNow.Date.Ticks +
                    (DateTime.UtcNow.Hour >= 12
                        ? TimeSpan.FromHours(12).Ticks
                        : 0));
            var fourTeenDaysFromNow = 
                new DateTime(
                    DateTime.UtcNow.AddDays(14).Date.Ticks +
                   (DateTime.UtcNow.Hour >= 12
                        ? TimeSpan.FromHours(12).Ticks
                        : 0));
            if (groupByDay.Any(cert =>
                    cert.Key == fourTeenDaysFromNow) == false)
            {
                var certcreatedToday = (groupByDayCreatedOn.Any(cert =>
                    cert.Key == adjustedNow));
                if (certcreatedToday)
                {
                    _logger.LogInformation($"No current certificate for 14 days from today {fourTeenDaysFromNow}, but we've already issued a certificate today...");
                }
                else
                {
                    _logger.LogInformation(
                        $"No Cert expiring 14 days from now on {fourTeenDaysFromNow}, creating certificate now");
                    var certificateArrayToUse = _config.CertRenewalDelayJob.OtherCertificateHostnames.ToList() ??
                                                new List<string>();

                    certificateArrayToUse.Add($"{Guid.NewGuid().ToString("N")}.{_config.CertRenewalDelayJob.TargetHostname}");

                    var deleteCertificatePack = await _apiBroker.CreateCertificatePack(_config.CertRenewalDelayJob.ZoneId, certificateArrayToUse.ToArray(),
                        _config.CertRenewalDelayJob.API_Key, CancellationToken.None);
                    if (deleteCertificatePack.IsFailed)
                    {
                        _logger.LogCritical(
                            $"Failure creating certificate pack, logs: {deleteCertificatePack.Errors?.FirstOrDefault()?.Message}");
                    }
                }

            }
            else
            {
                _logger.LogInformation($"Found certificate expiring 14 days from now {fourTeenDaysFromNow}, not going to create another.");
            }

            // calculate delay

            TimeSpan maxSpan = TimeSpan.MinValue;
            foreach (var automatedCertPack in getAutomatedCertificatePacks)
            {
                if (automatedCertPack.GetPrimaryCertificate != null)
                {
                    // renewal is 3 days before expiration
                    var renewalDate = automatedCertPack.GetPrimaryCertificate.ExpiresOn.AddDays(-3);
                    if (DateTimeOffset.UtcNow > renewalDate)
                    {
                        var timeOver = DateTimeOffset.UtcNow - renewalDate;
                        if (timeOver > maxSpan)
                        { maxSpan = timeOver; }
                    }
                }
            }
            this.JobData.APIResponseTimeUtc = listCertificatePacks.Value.ResponseTimeMs;

            if (TimeSpan.MinValue == maxSpan)
            {
                _logger.LogInformation($"Couldn't get max cert delay");
                if (this.JobData.CurrentRunStatus == Status.STATUS_UNDEPLOYED)
                {
                    this.JobData.CurrentRunStatus = Models.Jobs.Status.STATUS_DEPLOYED;
                    await InsertRunResult();
                    this.JobData.LastRunLengthMs = this.JobData.CurrentRunLengthMs;
                    this.JobData.LastRunStatus = Models.Jobs.Status.STATUS_DEPLOYED;
                    this.JobData.LastRunTime = DateTime.UtcNow;
                    JobData.CurrentRunStatus = Status.STATUS_PENDING;
                    JobData.CurrentRunLengthMs = null;
                    JobData.CurrentRunTime = DateTime.UtcNow;
                    await TrySave(true);

                }
            }
            else
            {
                _logger.LogInformation($"Found max certificate delay of {maxSpan.TotalHours.ToString("F")} hours");

                this.JobData.CurrentRunLengthMs = (ulong?)maxSpan.TotalMilliseconds;
                this.JobData.CurrentRunStatus = Models.Jobs.Status.STATUS_UNDEPLOYED;
                this.JobData.CurrentRunTime = DateTime.UtcNow;
                await TrySave(true);
            }
            
            
        }



        public override string Name => "Certificate Renewal Delay Job";
        public override string InternalName => "cert";
    }
}
