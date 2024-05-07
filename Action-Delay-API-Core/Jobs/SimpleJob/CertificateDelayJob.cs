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
            var groupByDay =
                getAutomatedCertificatePacks.GroupBy(cert => cert.GetPrimaryCertificate?.ExpiresOn.UtcDateTime.Date).Where(dayGrouping => dayGrouping.Count() > 1);
            foreach (var groupedByDay in groupByDay)
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

            var FourTeenDaysFromNow = DateTime.UtcNow.AddDays(14).Date;
            if (getAutomatedCertificatePacks.Any(cert =>
                    cert.GetPrimaryCertificate?.ExpiresOn.Date == FourTeenDaysFromNow) == false)
            {
                var getCertsIssuedToday = (getAutomatedCertificatePacks.Any(cert =>
                    cert.GetPrimaryCertificate?.UploadedOn.Date == DateTime.UtcNow.Date));
                if (getCertsIssuedToday)
                {
                    _logger.LogInformation($"No current certificate for 14 days from today {FourTeenDaysFromNow}, but we've already issued a certificate today...");
                }
                else
                {
                    _logger.LogInformation(
                        $"No Cert expiring 14 days from now on {FourTeenDaysFromNow}, creating certificate now");
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
                    if (renewalDate > DateTimeOffset.UtcNow)
                    {
                        var timeOver = renewalDate - DateTimeOffset.UtcNow;
                        if (timeOver > maxSpan)
                        { maxSpan = timeOver; }
                    }
                }
            }
            _logger.LogInformation($"Found max certificate delay of {maxSpan.TotalHours.ToString("F")} hours");
            /*
            var data = tryGetAnalytic.Value!.Result!.Viewer.Accounts.First().WorkersInvocationsAdaptive.First().Dimensions.Datetime;

            this.JobData.CurrentRunLengthMs = (DateTime.UtcNow - data).TotalMilliseconds > 0 ? (ulong)(DateTime.UtcNow - data).TotalMilliseconds : 0;
            this.JobData.CurrentRunStatus = Models.Jobs.Status.STATUS_DEPLOYED;
            this.JobData.APIResponseTimeUtc = tryGetAnalytic.Value.ResponseTimeMs;
            await InsertRunResult();
            await TrySave(true);
            */
        }



        public override string Name => "Worker Analytics Delay Job";
        public override string InternalName => "workeranalytics";
    }
}
