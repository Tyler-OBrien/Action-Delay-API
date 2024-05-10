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
            var groupByDayCreatedOn =
                getAutomatedCertificatePacks.GroupBy(cert =>
                    new DateTime(cert.CreatedOn.UtcDateTime.Date.Ticks +
                                 (cert.CreatedOn.UtcDateTime.Hour >= 12 ? TimeSpan.FromHours(12).Ticks : 0))).ToList();
            var groupByDay =
                getAutomatedCertificatePacks.GroupBy(cert =>
                    new DateTime(cert.GetPrimaryCertificate?.ExpiresOn.UtcDateTime.Date.Ticks ?? 0 +
                        (cert.GetPrimaryCertificate != null &&
                         cert.GetPrimaryCertificate.ExpiresOn.UtcDateTime.Hour >= 12
                            ? TimeSpan.FromHours(12).Ticks
                            : 0))).ToList();
            foreach (var groupedByDay in groupByDay.Where(grp => grp.Count() > 1))
            {
                var certsGroupedByDay = groupedByDay.ToList();
                var firstCert = certsGroupedByDay.OrderBy(cert => cert.CreatedOn).First();
                _logger.LogWarning(
                    $"Found {String.Join(", ", certsGroupedByDay.Select(cert => cert.Id))} certs expiring on same day of {groupedByDay.Key}, keeping {firstCert.Id} since it was newest");
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

            if (TimeSpan.MinValue == maxSpan)
            {
                _logger.LogInformation($"Couldn't get max cert delay");

            }
            else
            {
                _logger.LogInformation($"Found max certificate delay of {maxSpan.TotalHours.ToString("F")} hours");
            }
            /*
            var data = tryGetAnalytic.Value!.Result!.Viewer.Accounts.First().WorkersInvocationsAdaptive.First().Dimensions.Datetime;

            this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - data).TotalMilliseconds > 0 ? (ulong)(DateTime.UtcNow - data).TotalMilliseconds : 0;
            this.JobData.CurrentRunStatus = Models.Jobs.Status.STATUS_DEPLOYED;
            this.JobData.APIResponseTimeUtc = tryGetAnalytic.Value.ResponseTimeMs;
            await InsertRunResult();
            await TrySave(true);
            */
        }



        public override string Name => "Certificate Renewal Delay Job";
        public override string InternalName => "cert";
    }
}
