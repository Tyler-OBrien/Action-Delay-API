using System.Net;
using Action_Delay_API_Core.Models.CloudflareAPI;
using System.Text.Json;
using FluentResults;
using Action_Delay_API_Core.Models.Errors;
using static Action_Delay_API_Core.Broker.CloudflareAPIBroker;
using System.Reflection.PortableExecutable;
using Action_Delay_API_Core.Models.BunnyAPI;
using static System.Runtime.InteropServices.JavaScript.JSType;
using String = System.String;
using System.Reactive.Subjects;

namespace Action_Delay_API_Core.Extensions
{
    public static class HttpExtensions
    {
        public static async Task<Result<ApiResponse<TResult>?>> ProcessHttpRequestAsync<TResult>(
      this HttpClient client, HttpRequestMessage httpRequest, string assetName, ILogger logger)
        {
            var span = SentrySdk.GetSpan();
            if (span != null)
            {
                span = span.StartChild("http", assetName);
            }
            HttpResponseMessage? httpResponse = null;
            using var listener = new HttpEventListener();
            try
            {
                httpRequest.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await client.SendAsync(httpRequest);
                var rawString = await httpResponse.Content.ReadAsStringAsync();


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}",
                        (int)httpResponse.StatusCode, "API Empty Response", "", listener.GetTime(), httpResponse.GetColoId()));
                }

                ApiResponse<TResult>? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ApiResponse<TResult>>(rawString);
                }
                catch (Exception ex)
                {
                    span?.Finish(SpanStatus.InternalError);
                    // Better messages for Deserialization errors
                    logger.LogCritical(ex, "Failed to Deserialize: {ex} Response: {rawString}", ex.Message,
                        rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "",
                        listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response == null)
                {
                    span?.Finish(SpanStatus.InternalError);

                    logger.LogCritical(
                        $"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                    return Result.Fail((new CustomAPIError(
                        $"Could not get response {assetName} from API, status code: {httpResponse.StatusCode} Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Could not read deseralized response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        "", listener.GetTime(), httpResponse.GetColoId())));
                }

                if (response.Errors != null && response.Errors.Any())
                {
                    foreach (var error in response.Errors)
                    {
                        logger.LogCritical($"Error with {assetName}: {error}");
                    }

                    span?.Finish(SpanStatus.InternalError);

                    if (httpResponse.StatusCode == HttpStatusCode.TooManyRequests)
                    {
                        // hacky match on rate limiting header names because as of 9/9, even though it says it uses the standard x-ratelimit ones, it's using custom "ratelimit" ones
                    return Result.Fail(new CustomAPIError(
                            $"RateLimiting with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}, status code: {httpResponse.StatusCode}, rate limiting headers:  {String.Join(" | ", httpResponse.Headers.Where(header => header.Key.Contains("ratelimit", StringComparison.OrdinalIgnoreCase) || header.Key.Equals("retry-after", StringComparison.OrdinalIgnoreCase)).Select(kvp => $"{kvp.Key}={String.Join(",", kvp.Value)}"))}",
                            (int)httpResponse.StatusCode,
                            $"RateLimiting: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}",
                            response.Errors?.FirstOrDefault(error => error.Code != null)?.Code.ToString() ?? "",
                            listener.GetTime(), httpResponse.GetColoId()));
                    }

                    return Result.Fail(new CustomAPIError(
                        $"Error with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}, status code: {httpResponse.StatusCode}",
                        (int)httpResponse.StatusCode,
                        $"Error: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}",
                        response.Errors?.FirstOrDefault(error => error.Code != null)?.Code.ToString() ?? "",
                        listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response.Messages != null && response.Messages.Any())
                {
                    foreach (var message in response.Messages)
                    {
                        logger.LogWarning($"API Returned Message with {assetName}: {message}");
                    }
                }

                if (response.Success == false)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Response Success did not indicate success, status code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError(
                        $"Response Success did not indicate success but returned no errors, status code: {httpResponse.StatusCode}",
                        (int)httpResponse.StatusCode, $"Non-Success with no errors, response body: {rawString}", "",
                        listener.GetTime(), httpResponse.GetColoId()));
                }

                response.ResponseTimeMs = listener.GetTime();
                response.ColoId = httpResponse.GetColoId();
                span?.Finish();
                return response;
            }
    
            catch (HttpRequestException ex)
            {
                span?.Finish(SpanStatus.InternalError);

                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0) , $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (OperationCanceledException ex)
            {
                span?.Finish(SpanStatus.InternalError);

                logger.LogCritical(ex, $"Unexpected Timeout Error: {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected Timeout Error: {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (Exception ex)
            {
                span?.Finish(SpanStatus.InternalError);

                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", listener.GetTime()));
            }

            return null;
        }


        public static async Task<Result<ApiResponsePaginated<TResult>?>> ProcessHttpRequestPaginatedAsync<TResult>(
this HttpClient client, HttpRequestMessage httpRequest, string assetName, ILogger logger)
        {
            var span = SentrySdk.GetSpan();
            if (span != null)
            {
                span = span.StartChild("http", assetName);
            }
            HttpResponseMessage? httpResponse = null;
            using var listener = new HttpEventListener();
            try
            {
                httpRequest.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await client.SendAsync(httpRequest);
                var rawString = await httpResponse.Content.ReadAsStringAsync();


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}",
                        (int)httpResponse.StatusCode, "API Empty Response", "", listener.GetTime(), httpResponse.GetColoId()));
                }

                ApiResponsePaginated<TResult>? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ApiResponsePaginated<TResult>>(rawString);
                }
                catch (Exception ex)
                {
                    span?.Finish(SpanStatus.InternalError);
                    // Better messages for Deserialization errors
                    logger.LogCritical(ex, "Failed to Deserialize: {ex} Response: {rawString}", ex.Message,
                        rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError(
                        $"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "",
                        listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response == null)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                    return Result.Fail((new CustomAPIError(
                        $"Could not get response {assetName} from API, status code: {httpResponse.StatusCode} Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        (int)httpResponse.StatusCode, $"Could not read deseralized response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}",
                        "", listener.GetTime(), httpResponse.GetColoId())));
                }

                if (response.Errors != null && response.Errors.Any())
                {
                    foreach (var error in response.Errors)
                    {
                        logger.LogCritical($"Error with {assetName}: {error}");
                    }
                    span?.Finish(SpanStatus.InternalError);
                    return Result.Fail(new CustomAPIError(
                        $"Error with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}, status code: {httpResponse.StatusCode}",
                        (int)httpResponse.StatusCode,
                        $"Error: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}",
                        response.Errors?.FirstOrDefault(error => error.Code != null)?.Code.ToString() ?? "",
                        listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response.Messages != null && response.Messages.Any())
                {
                    foreach (var message in response.Messages)
                    {
                        logger.LogWarning($"API Returned Message with {assetName}: {message}");
                    }
                }

                if (response.Success == false)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Response Success did not indicate success, status code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError(
                        $"Response Success did not indicate success but returned no errors, status code: {httpResponse.StatusCode}",
                        (int)httpResponse.StatusCode, $"Non-Success with no errors, response body: {rawString}", "",
                        listener.GetTime(), httpResponse.GetColoId()));
                }

                response.ResponseTimeMs = listener.GetTime();
                response.ColoId = httpResponse.GetColoId();
                span?.Finish();

                return response;
            }

            catch (HttpRequestException ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (OperationCanceledException ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected Timeout Error: {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected Timeout Error: {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (Exception ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", listener.GetTime()));
            }

            return null;
        }

        public  static int GetColoId(this HttpResponseMessage msg)
        {
            if (msg?.Headers != null && msg.Headers.TryGetValues("colo", out var coloStr) &&
                int.TryParse(coloStr.FirstOrDefault(), out var coloInt))
                return coloInt;
            return -1;
        }

        public static async Task<Result<ApiResponse?>> ProcessHttpRequestAsyncNoResponse(
this HttpClient client, HttpRequestMessage httpRequest, string assetName, ILogger logger)
        {
            var span = SentrySdk.GetSpan();
            if (span != null)
            {
                span = span.StartChild("http", assetName);
            }
            HttpResponseMessage? httpResponse = null;
            using var listener = new HttpEventListener();
            try
            {
                httpRequest.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await client.SendAsync(httpRequest);
                var rawString = await httpResponse.Content.ReadAsStringAsync();

                if (httpResponse.IsSuccessStatusCode)
                {
                    span?.Finish();

                    return new ApiResponse()
                    {
                        Success = true,
                        ResponseTimeMs = listener.GetTime()
                    };
                }

                if (string.IsNullOrWhiteSpace(rawString))
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", listener.GetTime(), httpResponse.GetColoId()));
                }

                ApiResponse? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ApiResponse>(rawString);
                }
                catch (Exception ex)
                {
                    span?.Finish(SpanStatus.InternalError);
                    // Better messages for Deserialization errors
                    logger.LogCritical(ex, "Failed to Deserialize: {ex} Response: {rawString}", ex.Message, rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError($"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response == null)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                    return Result.Fail((new CustomAPIError($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode} Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", (int)httpResponse.StatusCode, $"Could not read deseralized response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", listener.GetTime(), httpResponse.GetColoId())));
                }

                if (response.Errors != null && response.Errors.Any())
                {
                    foreach (var error in response.Errors)
                    {
                        logger.LogCritical($"Error with {assetName}: {error}");
                    }
                    span?.Finish(SpanStatus.InternalError);
                    return Result.Fail(new CustomAPIError($"Error with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}, status code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, $"Error: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}", response.Errors?.FirstOrDefault(error => error.Code != null)?.Code.ToString() ?? "", listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response.Messages != null && response.Messages.Any())
                {
                    foreach (var message in response.Messages)
                    {
                        logger.LogWarning($"API Returned Message with {assetName}: {message}");
                    }
                }

                if (response.Success == false)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical($"Response Success did not indicate success, status code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Response Success did not indicate success but returned no errors, status code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, $"Non-Success with no errors, response body: {rawString}", "", listener.GetTime(), httpResponse.GetColoId()));
                }
                response.ResponseTimeMs = listener.GetTime();
                response.ColoId = httpResponse.GetColoId();
                span?.Finish();

                return response;
            }
            catch (HttpRequestException ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (OperationCanceledException ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected Timeout Error: {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected Timeout Error: {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (Exception ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", listener.GetTime()));

            }

            return null;
        }


        public static async Task<Result<BunnyAPIResponse?>> ProcessHttpRequestAsyncNoResponseBunny(
this HttpClient client, HttpRequestMessage httpRequest, string assetName, ILogger logger)
        {
            var span = SentrySdk.GetSpan();
            if (span != null)
            {
                span = span.StartChild("http", assetName);
            }
            HttpResponseMessage? httpResponse = null;
            using var listener = new HttpEventListener();
            try
            {
                httpRequest.VersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                httpResponse = await client.SendAsync(httpRequest);
                var rawString = await httpResponse.Content.ReadAsStringAsync();

                if (httpResponse.IsSuccessStatusCode)
                {
                    span?.Finish();

                    return new BunnyAPIResponse()
                    {
                        Success = true,
                        ResponseTimeMs = listener.GetTime()
                    };
                }

                if (string.IsNullOrWhiteSpace(rawString))
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", "", listener.GetTime(), httpResponse.GetColoId()));
                }

                BunnyAPIResponse? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<BunnyAPIResponse>(rawString);
                }
                catch (Exception ex)
                {
                    span?.Finish(SpanStatus.InternalError);
                    // Better messages for Deserialization errors
                    logger.LogCritical(ex, "Failed to Deserialize: {ex} Response: {rawString}", ex.Message, rawString.IntelligentCloudflareErrorsFriendlyTruncate(50));
                    return Result.Fail(new CustomAPIError($"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", listener.GetTime(), httpResponse.GetColoId()));
                }

                if (response == null)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                    return Result.Fail((new CustomAPIError($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode} Response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", (int)httpResponse.StatusCode, $"Could not read deseralized response: {rawString.IntelligentCloudflareErrorsFriendlyTruncate(50)}", "", listener.GetTime(), httpResponse.GetColoId())));
                }

                if (String.IsNullOrWhiteSpace(response.Message) == false)
                {
                    span?.Finish(SpanStatus.InternalError);
                    logger.LogCritical($"Error with {assetName}: {response.Message}");
                    return Result.Fail(new CustomAPIError($"Error with {assetName}: {response.Message} , status code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, $"Error: {response.Message}", response.ErrorKey ?? "", listener.GetTime(), httpResponse.GetColoId()));
                }

                response.Success = true;
                response.ResponseTimeMs = listener.GetTime();
                response.ColoId = httpResponse.GetColoId();
                span?.Finish();

                return response;
            }
            catch (HttpRequestException ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (OperationCanceledException ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected Timeout Error: {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected Timeout Error: {ex.Message}", (int)(httpResponse?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
            }
            catch (Exception ex)
            {
                span?.Finish(SpanStatus.InternalError);
                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", "", listener.GetTime()));

            }

            return null;
        }

        public static double GetTime(this HttpEventListener listener)
        {
            double responseTimeMs = -1;

            var timings = listener.GetTimings();
            if (timings == null) return -1;
            if (timings is { Request: not null, Dns: not null })
                responseTimeMs = timings.Request.Value.TotalMilliseconds -
                                 timings.Dns.Value.TotalMilliseconds;
            else if (timings.Request != null)
                responseTimeMs = timings.Request.Value.TotalMilliseconds;
            return responseTimeMs;
        }
    }
}
