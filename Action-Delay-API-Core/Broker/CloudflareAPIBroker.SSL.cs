using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System.Text;
using Action_Delay_API_Core.Models.CloudflareAPI.SSL;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<GetCertificatePacksResponse.CertificatePack[]>>> ListCertificatePacks(string zoneId, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"{BasePath}/zones/{zoneId}/ssl/certificate_packs?status=active&per_page=1000");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<GetCertificatePacksResponse.CertificatePack[]>(request, $"Getting Certificate Packs",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse<OrderCertificatePackResponse>>> CreateCertificatePack(string zoneId, string[] hostname, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"{BasePath}/zones/{zoneId}/ssl/certificate_packs/order");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var json = System.Text.Json.JsonSerializer.Serialize(new OrderCertificatePackRequest()
            {
                CertificateAuthority = "google",
                Type = "advanced",
                ValidationMethod = "txt",
                ValidityDays = 14,
                CloudflareBranding = false,
                Hosts = hostname
            });
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<OrderCertificatePackResponse>(request, $"Creating Certificate Packs for {zoneId}",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }

        public async Task<Result<ApiResponse<DeleteCertificatePackResponse>>> DeleteCertificatePack(string certificatePack, string zoneId, string apiToken, CancellationToken token)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete,
                $"{BasePath}/zones/{zoneId}/ssl/certificate_packs/{certificatePack}");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<DeleteCertificatePackResponse>(request, $"Deleting Certificate Pack {certificatePack}",
                _logger);
            if (tryPut.IsFailed) return FluentResults.Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }
    }
}
