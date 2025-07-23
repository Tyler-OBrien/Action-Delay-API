using Action_Delay_API_Core.Extensions;
using FluentResults;
using Action_Delay_API_Core.Models.Errors;
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
            _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
        }

        public async Task<Result<ColoApiData?>> GetColoData(CancellationToken token)
        {
            HttpResponseMessage httpResponse = null;
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "https://colo.cloudflare.chaika.me/?nometa");
                request.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await _httpClient.SendAsync(request, token);
                var rawString = await httpResponse.Content.ReadAsStringAsync(token);


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    _logger.LogCritical(
                        $"Could not get response colos from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response colos from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", null, httpResponse.GetColoId()));
                }

                ColoApiData? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ColoApiData>(rawString);
                }
                catch (Exception ex)
                {
                    // Better messages for Deserialization errors
                    _logger.LogCritical(ex, "colo api: Failed to Deserialize: {ex} Response: {rawString}", ex.Message,
                        rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", null, httpResponse.GetColoId()));
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
        public async Task<Result<MetalAPIData[]?>> GetMetalData(CancellationToken token)
        {
            HttpResponseMessage httpResponse = null;
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "https://metal.cloudflare.chaika.me/data");
                request.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await _httpClient.SendAsync(request, token);
                var rawString = await httpResponse.Content.ReadAsStringAsync(token);


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    _logger.LogCritical(
                        $"Could not get response metal from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response metal from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", null, httpResponse.GetColoId()));
                }

                MetalAPIData[]? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<MetalAPIData[]>(rawString);
                }
                catch (Exception ex)
                {
                    // Better messages for Deserialization errors
                    _logger.LogCritical(ex, "metal api: Failed to Deserialize: {ex} Response: {rawString}", ex.Message,
                        rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", null, httpResponse.GetColoId()));
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogCritical(ex, $"Get metal Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Get metal Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", null));
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Get metal Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Get metal Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", null));

            }
        }

        public async Task<Result<DateTime>> GetCloudflareLastDataDate(CancellationToken token)
        {
            HttpResponseMessage httpResponse = null;
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "https://metal.cloudflare.chaika.me/lasthttppush");
                request.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await _httpClient.SendAsync(request, token);
                var rawString = await httpResponse.Content.ReadAsStringAsync(token);


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    _logger.LogCritical(
                        $"Could not get response metal last http push date from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response metal last http push date from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", null, httpResponse.GetColoId()));
                }


                if (DateTime.TryParse(rawString, out var parsedLastHttpEventDate) == false)
                {
                    _logger.LogCritical("metal api: Failed to parse datetime, Response: {rawString}",
                        rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", null, httpResponse.GetColoId()));
                }


                return parsedLastHttpEventDate;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogCritical(ex, $"Get metal last http push date Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Get metal last http push date Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", null));
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Get metal last http push date Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Get metal last http push date Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", null));

            }
        }

        public async Task<Result<DateTime>> GetBunnyLastDataDate(CancellationToken token)
        {
            HttpResponseMessage httpResponse = null;
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "https://bunny-vector-log-ingest.workers.chaika.me/lasthttppush");
                request.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await _httpClient.SendAsync(request, token);
                var rawString = await httpResponse.Content.ReadAsStringAsync(token);


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    _logger.LogCritical(
                        $"Could not get response vector log ingest last http push date from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response metal last http push date from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", null, httpResponse.GetColoId()));
                }


                if (DateTime.TryParse(rawString, out var parsedLastHttpEventDate) == false)
                {
                    _logger.LogCritical("metal api: Failed to parse datetime, Response: {rawString}",
                        rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", null, httpResponse.GetColoId()));
                }


                return parsedLastHttpEventDate;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogCritical(ex, $"Get vector log ingest last http push date Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Get metal last http push date Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", null));
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Get vector log ingest last http push date Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Get metal last http push date Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", null));

            }
        }
    }
}
