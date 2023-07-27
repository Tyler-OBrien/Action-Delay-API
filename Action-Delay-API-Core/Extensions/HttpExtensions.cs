using Action_Delay_API_Core.Models.CloudflareAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FluentResults;
using static System.Runtime.InteropServices.JavaScript.JSType;
using String = System.String;

namespace Action_Delay_API_Core.Extensions
{
    public static class HttpExtensions
    {

  

        public static async Task<Result<ApiResponse<TResult>?>> ProcessHttpResponseAsync<TResult, TResultInfo>(
      this HttpResponseMessage httpResponse, string assetName, ILogger logger)
        {
            try
            {
                var rawString = await httpResponse.Content.ReadAsStringAsync();


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    logger.LogCritical(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                    return Result.Fail(
                        $"Could not get response {assetName} from API, API returned nothing, Status Code: {httpResponse.StatusCode}");
                }

                var response = JsonSerializer.Deserialize<ApiResponse<TResult>>(rawString);

                if (response == null)
                {
                    logger.LogCritical($"Could not get response {assetName} from API");
                    return Result.Fail($"Could not get response {assetName} from API");
                }

                if (response.Errors != null && response.Errors.Any())
                {
                    foreach (var error in response.Errors)
                    {
                        logger.LogCritical($"Error with {assetName}: {error}");
                    }

                    return Result.Fail($"Error with {assetName}: {String.Join(" | ", response.Errors.Select(error => $"{error.Code} - {error.Message}"))}");
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
                    logger.LogCritical("Response Success did not indicitate success");
                    return Result.Fail("Response Success did not indicitate success");
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {httpResponse?.StatusCode} - {ex.Message}");
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, $"Unexpected Error: API Returned: {httpResponse?.StatusCode}");
            }

            return null;
        }
    }
}
