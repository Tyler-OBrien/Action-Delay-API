using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI.PurgeCache;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Errors;
using Sentry.Extensibility;
using static Action_Delay_API_Core.Models.CloudflareAPI.WAF.UpdateCustomRuleResponse;
using System.Text.Json;
using Action_Delay_API_Core.Models.API.ColoAPI;
using Result = FluentResults.Result;

namespace Action_Delay_API_Core.Broker.ColoData
{
    public class ColoDataBroker : IColoDataBroker
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;

        public ColoDataBroker(HttpClient httpClient, ILogger<CloudflareAPIBroker> logger)
        {
            _logger = logger;
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://colo.cloudflare.chaika.me/");
            _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
        }

        public async Task<Result<ColoAPIData[]>> GetColoData(CancellationToken token)
        {
            HttpResponseMessage httpResponse = null;
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "/");
                request.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await _httpClient.SendAsync(request);
                var rawString = await httpResponse.Content.ReadAsStringAsync();


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    _logger.LogCritical(
                        $"Could not get response colos from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response colos from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", null));
                }

                ColoAPIData[] response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ColoAPIData[]>(rawString);
                }
                catch (Exception ex)
                {
                    // Better messages for Deserialization errors
                    _logger.LogCritical(ex, "colo api: Failed to Deserialize: {ex} Response: {rawString}", ex.Message,
                        rawString.Truncate(25));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.Truncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.Truncate(25)}", "", null));
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogCritical(ex, $"Get Colos Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Get Colos Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", null));
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Get Colos Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Get Colos Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", null));

            }
        }
    }
}
