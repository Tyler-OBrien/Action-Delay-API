using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Action_Delay_Api_HealthChecks.Broker
{
    public class SlackWebhookBroker
    {

        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;

        public SlackWebhookBroker(HttpClient httpClient, ILogger<SlackWebhookBroker> logger)
        {
            _logger = logger;
            _httpClient = httpClient;
            _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
            _httpClient.Timeout = TimeSpan.FromSeconds(60);
        }

        public async Task<Result<bool>> SendWebhook(string webhookUrl, string message)
        {
            var tryPost = await _httpClient.PostAsJsonAsync(webhookUrl, new
            {
                text = message
            });
            if (tryPost.IsSuccessStatusCode == false)
            {
                var responseBody = string.Empty;
                if (tryPost.Content != null)
                {
                    responseBody = await tryPost.Content.ReadAsStringAsync();
                }

                return FluentResults.Result.Fail($"Failed to send webhook - {tryPost.StatusCode} - {responseBody}");
            }

            return true;
        }
    }
}
