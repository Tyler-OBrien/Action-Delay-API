using Action_Deplay_API_Worker.Models.API.Response;
using Polly.Extensions.Http;
using Polly;
using System.Net;
using System.Net.Sockets;
using Action_Deplay_API_Worker.Models.Services;
using Action_Deplay_API_Worker.Models.API.Request;
using Action_Deplay_API_Worker.Models;
using ILogger = Microsoft.Extensions.Logging.ILogger;
using System.Diagnostics.Tracing;
using System.Net.Http.Headers;
using System.Reflection;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;
using System.Text;

namespace Action_Deplay_API_Worker.Services;
    public class HttpService : IHttpService
    {
        private readonly ILogger _logger;
        private readonly IHttpClientFactory _clientFactory;



        public HttpService(ILogger<HttpService> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _clientFactory = clientFactory;
        }

        public HttpClient NewHttpClient(bool reuseConnection)
        {
            if (reuseConnection)
            {
                return _clientFactory.CreateClient("ReuseClient");
            }
            return _clientFactory.CreateClient("NonReuseClient");
        }

        public async Task<SerializableHttpResponse> PerformRequestAsync(SerializableHttpRequest incomingRequest)
        {
            try
            {

                if (incomingRequest.Headers == null)
                {
                    incomingRequest.Headers = new Dictionary<string, string>();
                }

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

                bool wantsBody = incomingRequest.ReturnBody == null || incomingRequest.ReturnBody.Value;
                bool wantsBodyOnError = incomingRequest.ReturnBodyOnError == null || incomingRequest.ReturnBodyOnError.Value;
                bool wantsBodyHash = incomingRequest.ReturnBodySha256.HasValue && incomingRequest.ReturnBodySha256.Value;

                string perfInfo = string.Empty;
                double responseTimeMs = -1;
                bool couldGetBody = true;
                var response =
                    await httpRetryPolicy(incomingRequest.RetriesCount ?? 6).ExecuteAsync(async () =>
                    {
                        HttpMethod method = HttpMethod.Get;
                        if (incomingRequest.Method != null)
                            switch (incomingRequest.Method)
                            {
                                case MethodType.GET:
                                    method = HttpMethod.Get;
                                    break;
                                case MethodType.POST:
                                    method = HttpMethod.Post;
                                    break;
                                case MethodType.PUT:
                                    method = HttpMethod.Put;
                                    break;
                                case MethodType.PATCH:
                                    method = HttpMethod.Patch;
                                    break;
                                case MethodType.DELETE:
                                    method = HttpMethod.Delete;
                                    break;
                                case MethodType.OPTIONS:
                                    method = HttpMethod.Options;
                                    break;
                                case MethodType.HEAD:
                                    method = HttpMethod.Head;
                                    break;
                                default:
                                    method = HttpMethod.Get;
                                    break;
                            }
                        var request = new HttpRequestMessage(method, url);
                        request.Version = httpVersion;
                        request.VersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
                        if (incomingRequest.EnableConnectionReuse is null or false)
                            request.Headers.ConnectionClose = true;

                        foreach (var header in headers)
                        {
                            request.Headers.Add(header.Key, header.Value);
                        }
                        request.Headers.Add("X-Action-Delay-API-Worker-Version", Assembly.GetCallingAssembly().GetName().Version.ToString());


                        if (incomingRequest.Body != null)
                        {
                            // buffer in and over...
                            var bytes = incomingRequest.Body;
                            request.Content = new ByteArrayContent(bytes);
                            if (MediaTypeHeaderValue.TryParse(incomingRequest.ContentType, out var contentType))
                                request.Content.Headers.ContentType = contentType;
                        }


                        if (String.IsNullOrWhiteSpace(incomingRequest.Base64Body) == false)
                        {
                            var decodedBody = Convert.FromBase64String(incomingRequest.Base64Body);

                            request.Content = new ByteArrayContent(decodedBody);
                            if (MediaTypeHeaderValue.TryParse(incomingRequest.ContentType, out var contentType))
                                request.Content.Headers.ContentType = contentType;
                        }

                 


                        MemoryStream content = null;
                        HttpClient newClient = null;
                        try
                        {
                            newClient = NewHttpClient(incomingRequest.EnableConnectionReuse ?? false);
                            newClient.Timeout = TimeSpan.FromMilliseconds(incomingRequest.TimeoutMs ?? 10_000);
                            var newCancellationToken = new CancellationTokenSource();
                            newCancellationToken.CancelAfter(incomingRequest.TimeoutMs ?? 10_000);
                            request.Options.Set(new HttpRequestOptionsKey<NetType>("IPVersion"),
                                incomingRequest.NetType ?? NetType.Either);
                            if (String.IsNullOrWhiteSpace(incomingRequest.DNSResolveOverride) == false)
                                request.Options.Set(new HttpRequestOptionsKey<string>("DNSResolveOverride"),
                                    incomingRequest.DNSResolveOverride);

                            if (String.IsNullOrWhiteSpace(incomingRequest.CustomDNSServerOverride) == false)
                                request.Options.Set(new HttpRequestOptionsKey<string>("CustomDNSServerOverride"),
                                    incomingRequest.CustomDNSServerOverride);
                            using var listener = new HttpEventListener();
                            var response = await newClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
                            var responseContent = await ReadResponseWithLimit(response, newCancellationToken.Token);
      
                            var timings = listener.GetTimings();
                            if (timings is { Request: not null, Dns: not null })
                                responseTimeMs = timings.Request.Value.TotalMilliseconds -
                                                 timings.Dns.Value.TotalMilliseconds;
                            else if (timings.Request != null)
                                responseTimeMs = timings.Request.Value.TotalMilliseconds;
                            perfInfo =
                                $"DNS: {timings.Dns?.TotalMilliseconds ?? 0}ms, Connect: {timings.SocketConnect?.TotalMilliseconds ?? 0}ms, SSL: {timings.SslHandshake?.TotalMilliseconds ?? 0}ms, Request: {timings.Request?.TotalMilliseconds ?? 0}ms, Response Headers: {timings.ResponseHeaders?.TotalMilliseconds ?? 0}ms, Response Content: {timings.ResponseContent?.TotalMilliseconds ?? 0}ms.";
                            response.Content = new StreamContent(responseContent.Item1);
                            couldGetBody = responseContent.Item2;
                            return response;
                        }
                        finally
                        {
                            newClient?.Dispose();
                        }
                    });


                if (wantsBody == false && wantsBodyOnError && response.IsSuccessStatusCode == false)
                    wantsBody = true;

                if (couldGetBody == false && wantsBody)
                {
                    _logger.LogWarning(
                        "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, the return body was too large, Http Status Code: {httpErrorStatus}",
                        incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs,
                        incomingRequest.NetType, incomingRequest.EnableConnectionReuse, response.StatusCode);
                    return new SerializableHttpResponse
                    {
                        WasSuccess = false,
                        StatusCode = HttpStatusCode.BadGateway,
                        ProxyFailure = true,
                        Headers = response.Headers.ToDictionary(x => x.Key, pair => String.Join(",", pair.Value)),
                        Body = string.Empty,
                        Info = $"The Response Body was too large",
                        ResponseTimeMs = Math.Round(responseTimeMs, 3),
                    };
                }

                _logger.LogInformation(
                    "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, dns override {dnsOverride}, ns override {nameserverOverride}, we got back {StatusCode}, httpVersion: {httpVersion}, connectionReuse: {connectionReuse}. Timings: {perfInfo}",
                    url, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.DNSResolveOverride, incomingRequest.CustomDNSServerOverride,
                    response.StatusCode, response.Version, incomingRequest.EnableConnectionReuse, perfInfo);

                string? output = null;
                string? hash = null;
                if (wantsBody)
                {
                    output = await response.Content.ReadAsStringAsync();
                    if (wantsBodyHash) hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(output)));

                }
                else
                {
                    var outputStream = await response.Content.ReadAsStreamAsync();
                    if (wantsBodyHash) hash = Convert.ToHexString(await SHA256.HashDataAsync(outputStream));
                    await outputStream.CopyToAsync(Stream.Null);
                }

                return new SerializableHttpResponse
                {
                    WasSuccess = response.IsSuccessStatusCode,
                    StatusCode = response.StatusCode,
                    Headers = response.Headers.ToDictionary(x => x.Key, pair => String.Join(",", pair.Value)),
                    Body = output,
                    ResponseTimeMs = Math.Round(responseTimeMs, 3),
                    BodySha256 = hash,
                };
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, we had an HTTP Exception, Http Status Code: {httpErrorStatus}, {HttpRequestError}, {Message}.", incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.EnableConnectionReuse, ex.StatusCode, ex.HttpRequestError, ex.Message);
                return new SerializableHttpResponse
                {
                    WasSuccess = false,
                    StatusCode = ex.StatusCode ?? HttpStatusCode.BadGateway,
                    ProxyFailure = ex.StatusCode == null,
                    Headers = new Dictionary<string, string>(),
                    Body = string.Empty,
                    Info = $"Http Request Error: {ex.HttpRequestError}, {ex.Message}"
                };
            }
            catch (Exception ex) when (ex is OperationCanceledException or TaskCanceledException)
            {
                _logger.LogWarning(ex, "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, we timed out.", incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.EnableConnectionReuse);
                return new SerializableHttpResponse
                {
                    WasSuccess = false,
                    StatusCode = HttpStatusCode.BadGateway,
                    ProxyFailure = true,
                    Headers = new Dictionary<string, string>(),
                    Body = string.Empty,
                    Info = $"Timeout of {incomingRequest.TimeoutMs} :("
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, we had an exception.", incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.EnableConnectionReuse);
                return new SerializableHttpResponse
                {
                    WasSuccess = false,
                    StatusCode = HttpStatusCode.BadGateway,
                    ProxyFailure = true,
                    Headers = new Dictionary<string, string>(),
                    Body = string.Empty,
                    Info = "Unhandled Exception :("
                };
            }

        }


 

    public async Task<(MemoryStream, bool)> ReadResponseWithLimit(HttpResponseMessage msg, CancellationToken token)
        {
            var byteLimit = 10 * 1024 * 1024; // 10 MB
            var totalBytesRead = 0L;
            var memStream = new MemoryStream();

            using (var stream = await msg.Content.ReadAsStreamAsync(token))
            {
                var buffer = new byte[8192];
                var bytesRead = 0;

                while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, token)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead > byteLimit)
                    {
                        return (null, false);
                    }

                    await memStream.WriteAsync(buffer, 0, bytesRead, token);
                }
            }

            memStream.Position = 0;
            return (memStream, true);
        }



    private static  IAsyncPolicy<HttpResponseMessage> httpRetryPolicy(int retries) =>
            HttpPolicyExtensions
                .HandleTransientHttpError()
                .Or<HttpIOException>()
                .WaitAndRetryAsync(retries, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));

  
    }




//https://stackoverflow.com/a/74885933
internal sealed class HttpEventListener : EventListener
    {
        // Constant necessary for attaching ActivityId to the events.
        public const EventKeywords TasksFlowActivityIds = (EventKeywords)0x80;
        private AsyncLocal<HttpRequestTimingDataRaw> _timings = new AsyncLocal<HttpRequestTimingDataRaw>();

        internal HttpEventListener()
        {
            // set variable here
            _timings.Value = new HttpRequestTimingDataRaw();
        }

        protected override void OnEventSourceCreated(EventSource eventSource)
        {
            // List of event source names provided by networking in .NET 5.
            if (eventSource.Name == "System.Net.Http" ||
                eventSource.Name == "System.Net.Sockets" ||
                eventSource.Name == "System.Net.Security" ||
                eventSource.Name == "System.Net.NameResolution")
            {
                EnableEvents(eventSource, EventLevel.LogAlways);
            }
            // Turn on ActivityId.
            else if (eventSource.Name == "System.Threading.Tasks.TplEventSource")
            {
                // Attach ActivityId to the events.
                EnableEvents(eventSource, EventLevel.LogAlways, TasksFlowActivityIds);
            }
        }

        protected override void OnEventWritten(EventWrittenEventArgs eventData)
        {
            var timings = _timings.Value;
            if (timings == null)
                return; // some event which is not related to this scope, ignore it
            var fullName = eventData.EventSource.Name + "." + eventData.EventName;

            switch (fullName)
            {
                case "System.Net.Http.RequestStart":
                    timings.RequestStart = eventData.TimeStamp;
                    break;
                case "System.Net.Http.RequestStop":
                    timings.RequestStop = eventData.TimeStamp;
                    break;
                case "System.Net.NameResolution.ResolutionStart":
                    timings.DnsStart = eventData.TimeStamp;
                    break;
                case "System.Net.NameResolution.ResolutionStop":
                    timings.DnsStop = eventData.TimeStamp;
                    break;
                case "System.Net.Sockets.ConnectStart":
                    timings.SocketConnectStart = eventData.TimeStamp;
                    break;
                case "System.Net.Sockets.ConnectStop":
                    timings.SocketConnectStop = eventData.TimeStamp;
                    break;
                case "System.Net.Security.HandshakeStart":
                    timings.SslHandshakeStart = eventData.TimeStamp;
                    break;
                case "System.Net.Security.HandshakeStop":
                    timings.SslHandshakeStop = eventData.TimeStamp;
                    break;
                case "System.Net.Http.RequestHeadersStart":
                    timings.RequestHeadersStart = eventData.TimeStamp;
                    break;
                case "System.Net.Http.RequestHeadersStop":
                    timings.RequestHeadersStop = eventData.TimeStamp;
                    break;
                case "System.Net.Http.ResponseHeadersStart":
                    timings.ResponseHeadersStart = eventData.TimeStamp;
                    break;
                case "System.Net.Http.ResponseHeadersStop":
                    timings.ResponseHeadersStop = eventData.TimeStamp;
                    break;
                case "System.Net.Http.ResponseContentStart":
                    timings.ResponseContentStart = eventData.TimeStamp;
                    break;
                case "System.Net.Http.ResponseContentStop":
                    timings.ResponseContentStop = eventData.TimeStamp;
                    break;
            }
        }

        public HttpRequestTimings GetTimings()
        {
            var raw = _timings.Value!;
            return new HttpRequestTimings
            {
                Request = raw.RequestStop - raw.RequestStart,
                Dns = raw.DnsStop - raw.DnsStart,
                SslHandshake = raw.SslHandshakeStop - raw.SslHandshakeStart,
                SocketConnect = raw.SocketConnectStop - raw.SocketConnectStart,
                RequestHeaders = raw.RequestHeadersStop - raw.RequestHeadersStart,
                ResponseHeaders = raw.ResponseHeadersStop - raw.ResponseHeadersStart,
                ResponseContent = raw.ResponseContentStop - raw.ResponseContentStart
            };
        }

        public class HttpRequestTimings
        {
            public TimeSpan? Request { get; set; }
            public TimeSpan? Dns { get; set; }
            public TimeSpan? SslHandshake { get; set; }
            public TimeSpan? SocketConnect { get; set; }
            public TimeSpan? RequestHeaders { get; set; }
            public TimeSpan? ResponseHeaders { get; set; }
            public TimeSpan? ResponseContent { get; set; }
        }

        private class HttpRequestTimingDataRaw
        {
            public DateTime? DnsStart { get; set; }
            public DateTime? DnsStop { get; set; }
            public DateTime? RequestStart { get; set; }
            public DateTime? RequestStop { get; set; }
            public DateTime? SocketConnectStart { get; set; }
            public DateTime? SocketConnectStop { get; set; }
            public DateTime? SslHandshakeStart { get; set; }
            public DateTime? SslHandshakeStop { get; set; }
            public DateTime? RequestHeadersStart { get; set; }
            public DateTime? RequestHeadersStop { get; set; }
            public DateTime? ResponseHeadersStart { get; set; }
            public DateTime? ResponseHeadersStop { get; set; }
            public DateTime? ResponseContentStart { get; set; }
            public DateTime? ResponseContentStop { get; set; }
        }
    }