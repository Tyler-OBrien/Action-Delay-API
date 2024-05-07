using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using FluentResults;
using Action_Delay_API_Core.Models.CloudflareAPI.GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using static Action_Delay_API_Core.Models.CloudflareAPI.GraphQL.ZoneAnalyticsDateTime;

namespace Action_Delay_API_Core.Broker
{
    public partial class CloudflareAPIBroker
    {
        public async Task<Result<ApiResponse<ZoneAnalyticsDateTime.Data>>> GetLastZoneAnalytic(string zoneId, string datetimeGreaterThen, string apiToken, CancellationToken token)
        {
            var graphQLClient = new GraphQLHttpClient("https://api.cloudflare.com/client/v4/graphql", new SystemTextJsonSerializer(), _httpClient);
            graphQLClient.HttpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiToken}");
            var lastZoneEventRequest = new GraphQLHttpRequest
            {
                Query = @"query LastZoneEvent($zone: zone, $timeGt: timeGt)
{
  viewer {
    zones(filter: {zoneTag: $zone}) {
      httpRequestsAdaptive(filter: { datetime_gt: $timeGt}, limit: 1, orderBy: [ datetime_DESC ]) {
       datetime
      }
    }
  }
}",
                OperationName = "LastZoneEvent",
                Variables = new
                {
                    zone = zoneId,
                    timeGt = datetimeGreaterThen,
                },
            };
            var graphQLResponse = await graphQLClient.ProcessSendQueryAsync<Data>(lastZoneEventRequest, "GraphQL Get Last Zone Analytics", _logger);
            if (graphQLResponse.IsFailed) return Result.Fail(graphQLResponse.Errors);
            return graphQLResponse.Value!;
        }
    }
}
