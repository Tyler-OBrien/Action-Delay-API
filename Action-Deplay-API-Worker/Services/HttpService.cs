using Action_Deplay_API_Worker.Models.API.Response;
using Polly.Extensions.Http;
using Polly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Deplay_API_Worker.Models.Services;
using DnsClient;

namespace Action_Deplay_API_Worker.Services
{
    public class HttpService : IHttpService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;

        public HttpService(IHttpClientFactory clientFactory, ILogger<HttpService> logger)
        {
            _clientFactory = clientFactory;
            _logger = logger;
        }
        public async Task<SerializableHttpResponse> PerformRequestAsync(string url, Dictionary<string, string> headers)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, url);

            foreach (var header in headers)
            {
                request.Headers.Add(header.Key, header.Value);
            }

            var response = await GetRetryPolicy().ExecuteAsync(() => _clientFactory.CreateClient().SendAsync(request));

            _logger.LogInformation($"Received Query Request for {url}, we got back {response.StatusCode}");

            return new SerializableHttpResponse
            {
                WasSuccess = response.IsSuccessStatusCode,
                StatusCode = response.StatusCode,
                Headers = response.Headers.ToDictionary(x => x.Key, pair => pair.Value.ToString()),
                Body = await response.Content.ReadAsStringAsync()
            };

        }


        static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));
        }
    }
}
