using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.CloudflareAPI;
using Action_Delay_API_Core.Models.Errors;
using FluentResults;
using GraphQL;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Http.Websocket;
using Sentry.Extensibility;

namespace Action_Delay_API_Core.Extensions;

public static class GraphQLExtensions
{
    public static async Task<Result<ApiResponse<TResult>?>> ProcessSendQueryAsync<TResult>(
        this GraphQLHttpClient client, GraphQLHttpRequest request, string assetName, ILogger logger)
    {
        GraphQLResponse<TResult>? graphQLResponse = null;
        using var listener = new CloudflareAPIBroker.HttpEventListener();
        try
        {
            graphQLResponse = await client.SendQueryAsync<TResult>(request);
            var response = new ApiResponse<TResult>()
            {
                Result = graphQLResponse.Data,
                Success = graphQLResponse?.Errors?.Any() == false
            };


            if (graphQLResponse?.Errors != null && graphQLResponse.Errors.Any())
            {
                foreach (var error in graphQLResponse.Errors)
                {
                    logger.LogCritical($"Error with {assetName}: {error}");
                }

                return Result.Fail(new CustomAPIError(
                    $"Error with {assetName}: {String.Join(" | ", graphQLResponse.Errors.Select(error => $"{error.Message}"))}",
                    (int)200,
                    $"Error: {String.Join(" | ", graphQLResponse.Errors.Select(error => $"{error.Message}"))}",
                    graphQLResponse.Errors?.FirstOrDefault(error => error?.Extensions?.ContainsKey("code") ?? false)?.Extensions?["code"].ToString() ?? "",
                    listener.GetTime()));
            }

            response.ResponseTimeMs = listener.GetTime();
            return response;
        }
        catch (GraphQLHttpRequestException ex)
        {
            logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {ex?.StatusCode} - {ex.Message}");
            return Result.Fail(new CustomAPIError(
                $"Unexpected HTTP Error: API Returned: {ex?.StatusCode} - {ex.Message}",
                (int)(ex?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
        }
        catch (HttpRequestException ex)
        {
            logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {ex?.StatusCode} - {ex.Message}");
            return Result.Fail(new CustomAPIError(
                $"Unexpected HTTP Error: API Returned: {ex?.StatusCode} - {ex.Message}",
                (int)(ex?.StatusCode ?? 0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
        }
        catch (OperationCanceledException ex)
        {
            logger.LogCritical(ex, $"Unexpected Timeout Error: {ex.Message}");
            return Result.Fail(new CustomAPIError($"Unexpected Timeout Error: {ex.Message}",
                (int)(0), $"API Error, reason: {ex.Message}", "", listener.GetTime()));
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, $"Unexpected Error: Graphql hit critical exception");
            return Result.Fail(new CustomAPIError($"Unexpected Error: Graphql hit critical exception",
                (int)(0), $"Unknown API Error", "", listener.GetTime()));
        }

        return null;
    }
}