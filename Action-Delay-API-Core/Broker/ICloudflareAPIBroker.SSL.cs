using Action_Delay_API_Core.Models.CloudflareAPI.SSL;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker
{
    public  partial interface ICloudflareAPIBroker
    {
        public Task<Result<ApiResponse<GetCertificatePacksResponse.CertificatePack[]>>> ListCertificatePacks(
            string zoneId, string apiToken, CancellationToken token);

        public Task<Result<ApiResponse<OrderCertificatePackResponse>>> CreateCertificatePack(string zoneId,
            string[] hostname, string apiToken, CancellationToken token);

        public Task<Result<ApiResponse<DeleteCertificatePackResponse>>> DeleteCertificatePack(
            string certificatePack, string zoneId, string apiToken, CancellationToken token);
    }
}
