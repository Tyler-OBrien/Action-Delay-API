using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI.PageRules;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.CloudflareAPI.AI;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {

        public async Task<Result<ApiResponsePaginated<AIGetModelsResponse.AIGetModelsResponseDTO[]>>> GetAIModels(string accountId, string apiToken, CancellationToken token)
        {
            List<AIGetModelsResponse.AIGetModelsResponseDTO> getModels =
                new List<AIGetModelsResponse.AIGetModelsResponseDTO>();
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"{BasePath}/accounts/{accountId}/ai/models/search?per_page=1000");
            request.Headers.Add("Authorization", $"Bearer {apiToken}");
            var tryGetModels = await _httpClient.ProcessHttpRequestPaginatedAsync<AIGetModelsResponse.AIGetModelsResponseDTO[]>(request, $"Get AI Models",
                _logger);
            if (tryGetModels.IsFailed) return FluentResults.Result.Fail(tryGetModels.Errors);
            var getResponse = tryGetModels.Value!;
            var estimatedPages = (int)(Math.Ceiling((double)getResponse.ResultInfo.TotalCount / (double)getResponse.ResultInfo.PerPage));
            getModels.AddRange(getResponse.Result!);
            for (int i = 2; i < estimatedPages + 1; i++)
            {
                var tryGetPageRequest = new HttpRequestMessage(HttpMethod.Get,
                    $"{BasePath}/accounts/{accountId}/ai/models/search?page={i}&per_page=1000");
                tryGetPageRequest.Headers.Add("Authorization", $"Bearer {apiToken}");
                var tryGetPageModels = await _httpClient.ProcessHttpRequestPaginatedAsync<AIGetModelsResponse.AIGetModelsResponseDTO[]>(tryGetPageRequest, $"Get AI Models",
                    _logger);
                if (tryGetPageModels.IsFailed) return FluentResults.Result.Fail(tryGetPageModels.Errors);
                var getResponsePage = tryGetPageModels.Value!;
                if (getResponsePage.Result?.Any() == false) break;
                getModels.AddRange(getResponsePage.Result!);
            }

            getResponse.Result = getModels.ToArray();
            return getResponse;
        }
    }
}
