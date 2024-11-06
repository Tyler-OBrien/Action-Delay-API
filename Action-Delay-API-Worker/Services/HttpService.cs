using System.Diagnostics;
using System.Diagnostics.Tracing;
using System.Net;
using System.Net.Http.Headers;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using Action_Delay_API_Worker.Models;
using Action_Delay_API_Worker.Models.API.Request;
using Action_Delay_API_Worker.Models.API.Response;
using Action_Delay_API_Worker.Models.Config;
using Action_Delay_API_Worker.Models.Services;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Extensions.Http;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace Action_Delay_API_Worker.Services;
    public class HttpService : IHttpService
    {
        private readonly ILogger _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly LocalConfig _localConfig;




    public HttpService(ILogger<HttpService> logger, IHttpClientFactory clientFactory, IOptions<LocalConfig> probeConfiguration)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _localConfig = probeConfiguration.Value;
        }

        public HttpClient NewHttpClient(bool reuseConnection)
        {
            if (reuseConnection)
            {
                return _clientFactory.CreateClient("ReuseClient");
            }
            return _clientFactory.CreateClient("NonReuseClient");
        }

        public async Task<SerializableHttpResponse> PerformRequestAsync(SerializableHttpRequest incomingRequest, string source)
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

                        if (incomingRequest.RandomBytesBody.HasValue)
                        {
                            int seed = 0;
                            if (incomingRequest.RandomSeed.HasValue)
                                seed = incomingRequest.RandomSeed.Value;
                            else
                                seed = Guid.NewGuid().GetHashCode();
                            request.Content =
                                new ByteArrayContent(GenerateRandomBytes(incomingRequest.RandomBytesBody.Value, seed));
                            if (MediaTypeHeaderValue.TryParse(incomingRequest.ContentType, out var contentType))
                                request.Content.Headers.ContentType = contentType;
                        }



                        foreach (var header in headers)
                        {
                            if (request.Headers.TryAddWithoutValidation(header.Key, header.Value) == false)
                                request.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value);
                        }
                        if (request.Headers.Contains("X-Action-Delay-API-Worker-Version") == false)
                            request.Headers.Add("X-Action-Delay-API-Worker-Version", Assembly.GetCallingAssembly().GetName().Version.ToString());
                        if (request.Headers.Contains("Worker") == false)
                            request.Headers.Add("Worker", _localConfig.Location.ToUpper());



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

                            long dnsResolveLatency = -1;
                            if (request.Options.TryGetValue(new HttpRequestOptionsKey<long>("DNSResolveLatency"),
                                    out var dnsResolveLatencyRaw)) dnsResolveLatency = dnsResolveLatencyRaw;


                            var timings = listener.GetTimings();
                            if (timings is { Request: not null, Dns: not null })
                                responseTimeMs = timings.Request.Value.TotalMilliseconds -
                                                 timings.Dns.Value.TotalMilliseconds;
                            else if (timings.Request != null)
                                responseTimeMs = timings.Request.Value.TotalMilliseconds;
                            responseTimeMs += responseContent.latencyMs;
                            perfInfo =
                                $"DNS: {dnsResolveLatency}ms, Connect: {timings.SocketConnect?.TotalMilliseconds ?? 0}ms, SSL: {timings.SslHandshake?.TotalMilliseconds ?? 0}ms, Request: {timings.Request?.TotalMilliseconds ?? 0}ms, Response Headers: {timings.ResponseHeaders?.TotalMilliseconds ?? 0}ms, Response Content: {responseContent.latencyMs}ms.";
                            couldGetBody = responseContent.couldRead;
                            if (couldGetBody)
                                response.Content = new StreamContent(responseContent.Item1);
                            else
                                response.Content = null;
                            return response;
                        }
                        finally
                        {
                            newClient?.Dispose();
                        }
                    });


                if (wantsBody == false && wantsBodyOnError && response.IsSuccessStatusCode == false)
                    wantsBody = true;

                if (couldGetBody == false && (wantsBody || wantsBodyHash))
                {
                    _logger.LogWarning(
                        "({source}): Received Query Request for {url}, h: {headers}, t: {timeout}, nt: {netType}, connectionReuse: {connectionReuse}, the return body was too large, Http Status Code: {httpErrorStatus}",
                        source,
                        incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs,
                        incomingRequest.NetType, incomingRequest.EnableConnectionReuse, response.StatusCode);
                    return new SerializableHttpResponse
                    {
                        WasSuccess = false,
                        StatusCode = HttpStatusCode.BadGateway,
                        ProxyFailure = true,
                        Headers = ResolveHeaders(response.Headers, false, incomingRequest),
                        Body = string.Empty,
                        Info = $"The Response Body was too large",
                        ResponseTimeMs = Math.Round(responseTimeMs, 3),
                    };
                }

                _logger.LogInformation(
                    "({source}): {url}, h: {headers}, t: {timeout}, nt: {netType}, dnsoverride {dnsOverride}, cust ns {nameserverOverride}, status {StatusCode}, httpVersion: {httpVersion}, connectionReuse: {connectionReuse}, Timings: {perfInfo}",
                    source, url, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.DNSResolveOverride, incomingRequest.CustomDNSServerOverride,
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

                    if (response.Content != null)
                    {
                        var outputStream = await response.Content.ReadAsStreamAsync();
                        if (wantsBodyHash) hash = Convert.ToHexString(await SHA256.HashDataAsync(outputStream));
                        await outputStream.CopyToAsync(Stream.Null);
                    }
                }

                return new SerializableHttpResponse
                {
                    WasSuccess = response.IsSuccessStatusCode,
                    StatusCode = response.StatusCode,
                    Headers = ResolveHeaders(response.Headers, response.IsSuccessStatusCode, incomingRequest),
                    Body = output,
                    ResponseTimeMs = Math.Round(responseTimeMs, 3),
                    BodySha256 = hash,
                };
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "({source}): Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, we had an HTTP Exception, Http Status Code: {httpErrorStatus}, {HttpRequestError}, {Message}.",source, incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.EnableConnectionReuse, ex.StatusCode, ex.HttpRequestError, ex.Message);
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
                _logger.LogWarning(ex, "({source}): Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, we timed out.", source, incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.EnableConnectionReuse);
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
                _logger.LogWarning(ex, "({source}): Received Query Request for {url}, headers: {headers}, timeout: {timeout}, NetType: {netType}, connectionReuse: {connectionReuse}, we had an exception.", source,incomingRequest.URL, incomingRequest.Headers.Count, incomingRequest.TimeoutMs, incomingRequest.NetType, incomingRequest.EnableConnectionReuse);
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

        public static byte[] GenerateRandomBytes(int sizeInBytes, int seed)
        {
            byte[] randomBytes = new byte[sizeInBytes];
            var newRandom = new Random(seed);
            newRandom.NextBytes(randomBytes);
            return randomBytes;
        }
    public Dictionary<string, string> ResolveHeaders(HttpResponseHeaders headers, bool isSuccessCode,
            SerializableHttpRequest req)
        {
            // if none set, return all
            if (req.NoResponseHeaders.HasValue == false && req.ResponseHeaders == null &&
                req.AlwaysAllResponseHeadersOnNonSuccessStatusCode.HasValue == false)
            {
                return headers.ToDictionary(x => x.Key, pair => String.Join(",", pair.Value));
            }

            // if return non-success and non-success
            if (req.AlwaysAllResponseHeadersOnNonSuccessStatusCode.HasValue &&
                req.AlwaysAllResponseHeadersOnNonSuccessStatusCode.Value && isSuccessCode == false)
            {
                return headers.ToDictionary(x => x.Key, pair => String.Join(",", pair.Value));
            }
            // if some set, return just what was ordered
            if (req.ResponseHeaders != null && req.ResponseHeaders.Any())
            {
                HashSet<string> allowedHeaders =
                    new HashSet<string>(req.ResponseHeaders.ToList(), StringComparer.OrdinalIgnoreCase);
                return headers.Where(header => allowedHeaders.Contains(header.Key))
                    .ToDictionary(x => x.Key, pair => String.Join(",", pair.Value));
            }
            // if set to not get any
            if (req.NoResponseHeaders.HasValue && req.NoResponseHeaders.Value)
            {
                return new Dictionary<string, string>();
            }

            // otherwise fallback to giving all
            return headers.ToDictionary(x => x.Key, pair => String.Join(",", pair.Value));
        }


    public async Task<(MemoryStream? memStream, bool couldRead, long latencyMs)> ReadResponseWithLimit(HttpResponseMessage msg, CancellationToken token)
    {
        var stopWatch = Stopwatch.StartNew();
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
                        stopWatch.Stop();
                        return (null, false, stopWatch.ElapsedMilliseconds);
                    }

                    stopWatch.Stop();
                    await memStream.WriteAsync(buffer, 0, bytesRead, token);
                    stopWatch.Start();
                }
            }

            stopWatch.Stop();
            memStream.Position = 0;
            return (memStream, true, stopWatch.ElapsedMilliseconds);
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