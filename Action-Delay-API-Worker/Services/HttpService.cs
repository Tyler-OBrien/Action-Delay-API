using Action_Deplay_API_Worker.Models.API.Response;
using Polly.Extensions.Http;
using Polly;
using System.Net;
using System.Net.Sockets;
using Action_Deplay_API_Worker.Models.Services;
using Action_Deplay_API_Worker.Models.API.Request;
using Action_Deplay_API_Worker.Models;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace Action_Deplay_API_Worker.Services
{
    public class HttpService : IHttpService
    {
        private readonly ILogger _logger;

        public HttpService(ILogger<HttpService> logger)
        {
            _logger = logger;
        }

        public HttpClient NewHttpClient()
        {
            var handler = new SocketsHttpHandler
            {
                PooledConnectionLifetime = TimeSpan.FromTicks(1),
                ConnectCallback = async (context, cancellationToken) =>
                {
                    IPHostEntry entry = null;
                    if (context.InitialRequestMessage.Options.TryGetValue(new HttpRequestOptionsKey<NetType>("IPVersion"), out var version) &&
                        version != NetType.Either)
                    {
                        if (version == NetType.IPv4)
                            entry = await Dns.GetHostEntryAsync(context.DnsEndPoint.Host, AddressFamily.InterNetwork, cancellationToken);
                        else if (version == NetType.IPv6)
                            entry = await Dns.GetHostEntryAsync(context.DnsEndPoint.Host, AddressFamily.InterNetworkV6, cancellationToken);
                    }
                    else
                        entry = await Dns.GetHostEntryAsync(context.DnsEndPoint.Host, AddressFamily.Unspecified, cancellationToken);
                    var socket = new Socket(SocketType.Stream, ProtocolType.Tcp);
                    socket.NoDelay = true;
                    try
                    {
                        await socket.ConnectAsync(entry.AddressList, context.DnsEndPoint.Port, cancellationToken);
                        return new NetworkStream(socket, ownsSocket: true);
                    }
                    catch
                    {
                        socket.Dispose();
                        throw;
                    }
                },
                EnableMultipleHttp2Connections = true,
            };

            // Here you manually create a client with dedicated settings for each request
            var client = new HttpClient(handler)
            {
                DefaultRequestVersion = HttpVersion.Version20,
                DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrLower
            };

            client.DefaultRequestHeaders.ConnectionClose = true;
            return client;
        }

        public async Task<SerializableHttpResponse> PerformRequestAsync(SerializableHttpRequest incomingRequest)
        {
            try
            {
                var url = incomingRequest.URL;
                var headers = incomingRequest.Headers;

                var httpVersion = HttpVersion.Version20;
                if (incomingRequest.HttpType.HasValue)
                {
                    if (incomingRequest.HttpType.Value == 1)
                        httpVersion = HttpVersion.Version11;
                    else if (incomingRequest.HttpType.Value == 2)
                        httpVersion = HttpVersion.Version20;
                    else if (incomingRequest.HttpType.Value == 3)
                        httpVersion = HttpVersion.Version30;
                }


                var response =
                    await httpRetryPolicy.ExecuteAsync(() =>
                    {
                        var request = new HttpRequestMessage(HttpMethod.Get, url);
                        request.Version = httpVersion;
                        request.VersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
                        request.Headers.ConnectionClose = true;
                        foreach (var header in headers)
                        {
                            request.Headers.Add(header.Key, header.Value);
                        }

                        var newClient = NewHttpClient();
                        newClient.Timeout = TimeSpan.FromMilliseconds(incomingRequest.TimeoutMs ?? 10_000);
                        request.Options.Set(new HttpRequestOptionsKey<NetType>("IPVersion"),
                            incomingRequest.NetType ?? NetType.Either);
                        return newClient.SendAsync(request);
                    });

                _logger.LogInformation(
                    "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, we got back {StatusCode}, httpVersion: {httpVersion}",
                    url, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType,
                    response.StatusCode, response.Version);

                return new SerializableHttpResponse
                {
                    WasSuccess = response.IsSuccessStatusCode,
                    StatusCode = response.StatusCode,
                    Headers = response.Headers.ToDictionary(x => x.Key, pair => String.Join(",", pair.Value)),
                    Body = await response.Content.ReadAsStringAsync()
                };
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, we had an HTTP Exception, Http Status Code: {httpErrorStatus}, {HttpRequestError}, {Message}.", incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, ex.StatusCode, ex.HttpRequestError, ex.Message);
                return new SerializableHttpResponse
                {
                    WasSuccess = false,
                    StatusCode = ex.StatusCode ?? HttpStatusCode.BadGateway,
                    Headers = new Dictionary<string, string>(),
                    Body = string.Empty,
                    Info = $"Http Request Error: {ex.HttpRequestError}, {ex.Message}"
                };
            }
            catch (Exception ex) when (ex is OperationCanceledException or TaskCanceledException)
            {
                _logger.LogWarning(ex, "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, we timed out.", incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType);
                return new SerializableHttpResponse
                {
                    WasSuccess = false,
                    StatusCode = HttpStatusCode.BadGateway,
                    Headers = new Dictionary<string, string>(),
                    Body = string.Empty,
                    Info = $"Timeout of {incomingRequest.TimeoutMs} :("
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, we had an exception.", incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType);
                return new SerializableHttpResponse
                {
                    WasSuccess = false,
                    StatusCode = HttpStatusCode.BadGateway,
                    Headers = new Dictionary<string, string>(),
                    Body = string.Empty,
                    Info = "Unhandled Exception :("
                };
            }
        }



        private static readonly IAsyncPolicy<HttpResponseMessage> httpRetryPolicy =
            HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));

  
    }
}
