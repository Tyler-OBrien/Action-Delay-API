using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using Action_Delay_API_Core.Models.CloudflareAPI.WorkersObs;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<TelemetryQueryResponseDto>>> TelemetryQuery(DateTimeOffset dateFrom, DateTimeOffset dateTo, string accountId, string scriptName, string apiToken, CancellationToken token)
        {
            var telemetryQueryRequest = new TelemetryQueryRequestDto()
            {

                Timeframe = new TelemetryQueryRequestDtoTimeframe()
                {
                    To = dateTo.ToUnixTimeMilliseconds(),
                    From = dateFrom.ToUnixTimeMilliseconds(),
                },
                View = "events",
                Limit = 1,
                Dry = true,
                QueryId = "queryId",
                Parameters = new TelemetryQueryRequestDtoParameters()
                {
                    Datasets = new string[]
                    {
                        "cloudflare-workers"
                    },
                    Filters = new TelemetryQueryRequestDtoFilter[]
                    {
                        new TelemetryQueryRequestDtoFilter()
                        {
                            Key = $"$metadata.service",
                            Type = "string",
                            Value = scriptName,
                            Operation = "eq",
                        }
                    }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post,
                $"{BasePath}/accounts/{accountId}/workers/observability/telemetry/query");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var seralizedQueryRequest = System.Text.Json.JsonSerializer.Serialize(telemetryQueryRequest);
            request.Content = new StringContent(seralizedQueryRequest);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var tryPut = await _httpClient.ProcessHttpRequestAsync<TelemetryQueryResponseDto>(request, $"Workers Obs Query",
                _logger);
            if (tryPut.IsFailed) return Result.Fail(tryPut.Errors);
            return tryPut.Value!;
        }


    }
}
