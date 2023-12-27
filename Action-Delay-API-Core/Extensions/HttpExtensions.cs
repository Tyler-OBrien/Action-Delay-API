using Action_Delay_API_Core.Models.CloudflareAPI;
using System.Text.Json;
using FluentResults;
using Action_Delay_API_Core.Models.Errors;

namespace Action_Delay_API_Core.Extensions
{
    public static class HttpExtensions
    {
        public static async Task<Result<ApiResponse<TResult>?>> ProcessHttpRequestAsync<TResult>(
      this HttpClient client, HttpRequestMessage httpRequest, string assetName, ILogger logger)
        {
            HttpResponseMessage? httpResponse = null;
            try
            {
                httpResponse = await client.SendAsync(httpRequest);
                var rawString = await httpResponse.Content.ReadAsStringAsync();


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, "API Empty Response", ""));
                }

                ApiResponse<TResult>? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ApiResponse<TResult>>(rawString);
                }
                catch (Exception ex)
                {
                    // Better messages for Deserialization errors
                    logger.LogCritical(ex, "Failed to Deserialize: {ex} Response: {rawString}", ex.Message, rawString.Truncate(25));
                    return Result.Fail(new CustomAPIError($"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}, Response: {rawString.Truncate(50)}", (int)httpResponse.StatusCode, $"Failure parsing response: {rawString.Truncate(25)}", ""));
                }

                if (response == null)
                {
                    logger.LogCritical($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                    return Result.Fail((new CustomAPIError($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode} Response: {rawString.Truncate(50)}", (int)httpResponse.StatusCode, $"Could not read deseralized response: {rawString.Truncate(25)}", "")));
                }

                if (response.Errors != null && response.Errors.Any())
                {
                    foreach (var error in response.Errors)
                    {
                        logger.LogCritical($"Error with {assetName}: {error}");
                    }

                    return Result.Fail(new CustomAPIError($"Error with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}, status code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, $"Error: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}", response.Errors?.FirstOrDefault(error => error.Code != null)?.Code.ToString() ?? ""));
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
                    logger.LogCritical($"Response Success did not indicate success, status code: {httpResponse.StatusCode}");
                    return Result.Fail(new CustomAPIError($"Response Success did not indicate success but returned no errors, status code: {httpResponse.StatusCode}", (int)httpResponse.StatusCode, $"Non-Success with no errors, response body: {rawString}", ""));
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail(new CustomAPIError($"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}", (int)(httpResponse?.StatusCode ?? 0) , $"API Error, reason: {ex.Message}", ""));
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail(new CustomAPIError($"Unexpected Error: API Returned: {httpResponse?.StatusCode}", (int)(httpResponse?.StatusCode ?? 0), $"Unknown API Error", ""));

            }

            return null;
        }
    }
}
