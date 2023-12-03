using Action_Delay_API_Core.Models.CloudflareAPI;
using System.Text.Json;
using FluentResults;

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
                    return Result.Fail(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                }

                ApiResponse<TResult>? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<ApiResponse<TResult>>(rawString);
                }
                catch (Exception ex)
                {
                    // Better messages for Deserialization errors
                    logger.LogCritical(ex, "Failed to Deserialize: {ex} ", ex.Message);
                    return Result.Fail($"Issue reading response, Status Code: {httpResponse.StatusCode}: {httpResponse.ReasonPhrase}");
                }

                if (response == null)
                {
                    logger.LogCritical($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                    return Result.Fail($"Could not get response {assetName} from API, status code: {httpResponse.StatusCode}");
                }

                if (response.Errors != null && response.Errors.Any())
                {
                    foreach (var error in response.Errors)
                    {
                        logger.LogCritical($"Error with {assetName}: {error}");
                    }

                    return Result.Fail($"Error with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}, status code: {httpResponse.StatusCode}");
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
                    return Result.Fail($"Response Success did not indicate success but returned no errors, status code: {httpResponse.StatusCode}");
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
                return Result.Fail($"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
                return Result.Fail($"Unexpected Error: API Returned: {httpResponse?.StatusCode}");

            }

            return null;
        }
    }
}
