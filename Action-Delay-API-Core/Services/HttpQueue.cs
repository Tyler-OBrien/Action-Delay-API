using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.CloudflareAPI;
using Action_Delay_API_Core.Models.Errors;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;

namespace Action_Delay_API_Core.Services
{
    public class HttpQueue : IQueue
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;
        private readonly LocalConfig _baseConfiguration;

        public HttpQueue(IHttpClientFactory clientFactory, ILogger<HttpQueue> logger, IOptions<LocalConfig> baseConfiguration)
        {
            _clientFactory = clientFactory;
            _logger = logger;
            _baseConfiguration = baseConfiguration.Value;
        }

    
        public async Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, Location location, CancellationToken token)
        {
            return null;
        }

        public async Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, Location location, CancellationToken token, int secondsTimeout = 30)
        {
            try
            {
                var client = _clientFactory.CreateClient("HttpQueueClient");
                client.Timeout = TimeSpan.FromSeconds(50);
                var newHttpMsg = new HttpRequestMessage(HttpMethod.Post, $"{location.URL}/http");
                if (request.BodyBytes != null)
                {
                    newHttpMsg.Content = new ByteArrayContent(request.BodyBytes);
                    if (request.BodyBytes.Length == 0)
                    {
                        _logger.LogWarning($"Warning: trying to send 0 length byte buffer for {request.URL} to {location.Name}");
                    }
                }

                if (request.BodyStream != null)
                {
                    newHttpMsg.Content = new StreamContent(request.BodyStream);
                    if (request.BodyStream.Length == 0)
                    {
                        _logger.LogWarning($"Warning: trying to send 0 length stream for {request.URL} to {location.Name}");
                    }
                }

                newHttpMsg.Headers.Add("Action-Delay-Proxy-Secret", _baseConfiguration.ActionDelayProxySecret);


                newHttpMsg.Headers.Add("Action-Delay-Proxy-URL", request.URL);
                if (request.EnableConnectionReuse.HasValue)
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-EnableConnectionReuse", request.EnableConnectionReuse.Value ? "true": "false");

                if (request.ReturnBody.HasValue)
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-ReturnBody", request.ReturnBody.Value ? "true" : "false");

                if (request.Method.HasValue)
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-Method", request.Method.Value.ToString("D"));

                if (request.NetType.HasValue)
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-NetType", request.NetType.Value.ToString("D"));

                if (request.HttpType.HasValue)
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-HttpType", request.HttpType.Value.ToString("D"));

                if (request.TimeoutMs.HasValue)
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-TimeoutMs", request.TimeoutMs.Value.ToString());

                if (String.IsNullOrWhiteSpace(request.ContentType))
                    newHttpMsg.Headers.Add("Action-Delay-Proxy-ContentType", request.ContentType);

                foreach (var headerKvp in request.Headers)
                {
                 newHttpMsg.Headers.Add($"Action-Delay-Proxy-Header-{headerKvp.Key}", headerKvp.Value);   
                }
                

                var sendRequest = await client.SendAsync(newHttpMsg, token);

                var rawString = await sendRequest.Content.ReadAsStringAsync(token);


                if (string.IsNullOrWhiteSpace(rawString))
                {
                    _logger.LogCritical(
                        $"Could not get response {request.URL} from API, API returned nothing, Status Code: {sendRequest.StatusCode}");
                    return Result.Fail(
                        $"Could not get response {request.URL} from API, API returned nothing, Status Code: {sendRequest.StatusCode}");
                }

                SerializableHttpResponse? response = null;
                try
                {
                    response = JsonSerializer.Deserialize<SerializableHttpResponse>(rawString, Program.JsonSerializerOptions);
                }
                catch (Exception ex)
                {
                    // Better messages for Deserialization errors
                    _logger.LogCritical(ex, "Failed to Deserialize: {ex} Response: {rawString}, Response: {rawString}", ex.Message,
                        rawString.Truncate(25), rawString.Truncate(50));
                    return Result.Fail(
                        $"Issue reading response, Status Code: {sendRequest.StatusCode}: {sendRequest.ReasonPhrase}");
                }

                if (response == null)
                {
                    _logger.LogCritical(
                        $"Could not get response {request.URL} from API, status code: {sendRequest.StatusCode} Response: {rawString.Truncate(50)}");
                    return Result.Fail($"Could not get response {request.URL} from API, status code: {sendRequest.StatusCode}");
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogCritical(ex, $"Unexpected HTTP Error: API Returned: {ex?.StatusCode} - {ex.Message}");
                return Result.Fail($"Unexpected HTTP Error: API Returned: {ex?.StatusCode} - {ex.Message}");
            }
            catch (OperationCanceledException ex)
            {
                _logger.LogCritical(ex, $"Unexpected Timeout Error: {ex.Message}");
                return Result.Fail($"Unexpected Timeout Error: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, $"Unexpected Error");
                return Result.Fail($"Unexpected Error");
            }
        }



        public void Dispose()
        {
        }

        public async ValueTask DisposeAsync()
        {
        }
    }
}
