using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using Action_Delay_API_Worker.Models;
using Action_Delay_API_Worker.Models.API.Request;
using Action_Delay_API_Worker.Models.API.Response;
using Action_Delay_API_Worker.Models.Config;
using Action_Delay_API_Worker.Models.Services;
using Action_Delay_API_Worker.Services;
using DnsClient;
using DnsClient.Protocol;
using Microsoft.Extensions.Options;
using Sentry.Extensions.Logging;
using Sentry.Extensions.Logging.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;

namespace Action_Delay_API_Worker
{
    public class Program
    {
        private const string outputFormat =
  "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";

        public static async Task<int> Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("System", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                .MinimumLevel.Information()
                .WriteTo.File($"Logs/Log.log", outputTemplate: outputFormat,
                    restrictedToMinimumLevel: LogEventLevel.Information, retainedFileCountLimit: 10,
                    rollingInterval: RollingInterval.Day).WriteTo.Console(outputTemplate: outputFormat, restrictedToMinimumLevel: LogEventLevel.Information).Enrich.FromLogContext().CreateLogger();
            Log.Logger.Information("Loaded SeriLog Logger");
            TaskScheduler.UnobservedTaskException += TaskSchedulerOnUnobservedTaskException;


            var lookupClientOptionsAny = new LookupClientOptions(CloudflareV4, ControlDV4, CloudflareV6, ControlDV6);
            lookupClientOptionsAny.UseCache = true;
            lookupClientOptionsAny.UseRandomNameServer = false;
            StaticLookupClientAny = new LookupClient(lookupClientOptionsAny);
            var lookupClientOptionsV4 = new LookupClientOptions(CloudflareV4, ControlDV4);
            lookupClientOptionsAny.UseCache = true;
            lookupClientOptionsAny.UseRandomNameServer = false;
            StaticLookupClientV4 = new LookupClient(lookupClientOptionsV4);



            
            try
            {
                Log.Information("Starting host");
                await BuildHost(args).RunAsync();
                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                return 1;
            }
            finally
            {
                await Log.CloseAndFlushAsync();
            }
        }

        public static IHost BuildHost(string[] args)
        {
         var webApplicationBuilder =    WebApplication.CreateBuilder(args);

         var hostBuilder = webApplicationBuilder.Host.ConfigureServices((hostContext, services) =>
                {
                    IConfiguration configuration = hostContext.Configuration.GetSection("Base");
                    var baseConfiguration = configuration.Get<LocalConfig>();
                    services.Configure<LocalConfig>(configuration);

                    if (String.IsNullOrWhiteSpace(baseConfiguration.SENTRY_DSN) == false)
                    {
                        services.Configure<SentryLoggingOptions>(options =>
                        {
                            options.Dsn = baseConfiguration.SENTRY_DSN;
                            options.SendDefaultPii = true;
                            options.AttachStacktrace = true;
                            options.MinimumBreadcrumbLevel = LogLevel.Debug;
                            options.MinimumEventLevel = LogLevel.Error;
                            options.TracesSampleRate = 1.0;
                            options.DefaultTags.Add("Location", baseConfiguration.Location);
                            options.CaptureFailedRequests = false;
                        });
                        services.AddSentry<SentryLoggingOptions>();
                    }

                    services.AddLogging();


                    services.AddHttpClient("ReuseClient")
                        .ConfigureHttpClient(httpClient =>
                        {
                            httpClient.DefaultRequestVersion = HttpVersion.Version20;
                            httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
                            httpClient.DefaultRequestHeaders.ConnectionClose = false;
                        })
                        .ConfigurePrimaryHttpMessageHandler((sp) =>
                        {
                            return new SocketsHttpHandler
                            {
                                PooledConnectionLifetime = TimeSpan.FromMinutes(15),
                                ConnectCallback = ConnectCallBackTask,
                                EnableMultipleHttp2Connections = true,
                                AllowAutoRedirect = false,
                                MaxConnectionsPerServer = Int32.MaxValue,
                            };
                        });

                    services.AddHttpClient("NonReuseClient")
                        .ConfigureHttpClient(httpClient =>
                        {
                            httpClient.DefaultRequestVersion = HttpVersion.Version20;
                            httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
                            httpClient.DefaultRequestHeaders.ConnectionClose = true;
                        })
                        .ConfigurePrimaryHttpMessageHandler((sp) =>
                        {
                            return new SocketsHttpHandler
                            {
                                PooledConnectionLifetime = TimeSpan.FromTicks(1),
                                ConnectCallback = ConnectCallBackTask,
                                EnableMultipleHttp2Connections = true,
                                AllowAutoRedirect = false,
                                MaxConnectionsPerServer =  Int32.MaxValue,
                            };
                        });


                    services.AddTransient<IHttpService, HttpService>();
                    services.AddTransient<IDnsService, DnsService>();
                    services.AddTransient<IPingService, PingService>();
                    services.AddSingleton<JobService>();

                    services.AddHostedService<Worker>();

              
                })
                .UseSerilog();

         webApplicationBuilder.WebHost.UseKestrel(options => { options.AddServerHeader = false; });

            var app = webApplicationBuilder.Build();

         app.MapPost("/http",  async(HttpRequest request, ILogger <Program> logger,  IOptions <LocalConfig> probeConfiguration, IHttpService httpService) =>
         {
             try
             {
                 var tryToGetAuthHeader = HeaderToValue(request, "Action-Delay-Proxy-Secret");
                 if (String.IsNullOrWhiteSpace(tryToGetAuthHeader) || tryToGetAuthHeader.Equals(probeConfiguration.Value.HttpRequestSecret, StringComparison.Ordinal) == false)
                     return GenerateFailureResponseHttp("Invalid Proxy Secret");

                 var newHttpRequest = new SerializableHttpRequest();
                 newHttpRequest.URL = HeaderToValue(request, "Action-Delay-Proxy-URL");
                 if (String.IsNullOrWhiteSpace(newHttpRequest.URL))
                     return GenerateFailureResponseHttp("Invalid Proxy URL");

                 newHttpRequest.Headers = new Dictionary<string, string>();
                 foreach (var headerKvp in request.Headers.Where(headerKvp =>
                              headerKvp.Value.Any() && headerKvp.Key.StartsWith("Action-Delay-Proxy-Header-",
                                  StringComparison.OrdinalIgnoreCase)))
                 {
                     newHttpRequest.Headers.Add(
                         headerKvp.Key.Replace("Action-Delay-Proxy-Header-", "", StringComparison.OrdinalIgnoreCase),
                         headerKvp.Value);
                 }
                 newHttpRequest.TimeoutMs = HeaderToValueInt(request, "Action-Delay-Proxy-TimeoutMs");
                 newHttpRequest.NetType = (NetType)((HeaderToValueInt(request, "Action-Delay-Proxy-NetType")) ?? 0);
                 newHttpRequest.HttpType = HeaderToValueInt(request, "Action-Delay-Proxy-HttpType");
                 newHttpRequest.RetriesCount = HeaderToValueInt(request, "Action-Delay-Proxy-RetriesCount");
                 newHttpRequest.EnableConnectionReuse = HeaderToValueBool(request, "Action-Delay-Proxy-EnableConnectionReuse");
                 newHttpRequest.Method = (MethodType)((HeaderToValueInt(request, "Action-Delay-Proxy-Method")) ?? 0);
                 newHttpRequest.ContentType = HeaderToValue(request, "Action-Delay-Proxy-ContentType");
                 newHttpRequest.ReturnBody = HeaderToValueBool(request, "Action-Delay-Proxy-ReturnBody");
                 newHttpRequest.ReturnBodyOnError = HeaderToValueBool(request, "Action-Delay-Proxy-ReturnBodyOnError");
                 newHttpRequest.DNSResolveOverride = HeaderToValue(request, "Action-Delay-Proxy-DNS-Override");
                 newHttpRequest.CustomDNSServerOverride = HeaderToValue(request, "Action-Delay-Proxy-CustomDNSServerOverride");
                 newHttpRequest.DisableAutomaticResponseDecompression = HeaderToValueBool(request, "Action-Delay-Proxy-DisableAutomaticResponseDecompression");
                 request.EnableBuffering();
                 newHttpRequest.Body = await ReadAllBytes(request.Body);
                 request.Body.Position = 0;

                 var tryGetResponse = await httpService.PerformRequestAsync(newHttpRequest, "http");
                 return tryGetResponse;
             }
             catch (Exception ex)
             {
                 Log.Error(ex, "Critical error while handling http request.");
                 return GenerateFailureResponseHttp("Critical Internal Error While handling request");
             }
         });

         app.MapPost("/DNS", async (HttpRequest request, IOptions <LocalConfig> probeConfiguration, IDnsService dnsService) =>
         {
             try
             {
                 var tryToGetAuthHeader = HeaderToValue(request, "Action-Delay-Proxy-Secret");
                 if (String.IsNullOrWhiteSpace(tryToGetAuthHeader) || tryToGetAuthHeader.Equals(probeConfiguration.Value.HttpRequestSecret, StringComparison.Ordinal) == false)
                     return GeneratFailureResponseDNS("Invalid Proxy Secret");

                 var newDnsRequest = new SerializableDNSRequest();
                 newDnsRequest.QueryName = HeaderToValue(request, "Action-Delay-Proxy-QueryName");
                 if (String.IsNullOrWhiteSpace(newDnsRequest.QueryName))
                     return GeneratFailureResponseDNS("Invalid Proxy QueryName");
                 newDnsRequest.QueryType = HeaderToValue(request, "Action-Delay-Proxy-QueryType");
                 if (String.IsNullOrWhiteSpace(newDnsRequest.QueryType))
                     return GeneratFailureResponseDNS("Invalid Proxy QueryType");
                 newDnsRequest.DnsServer = HeaderToValue(request, "Action-Delay-Proxy-DnsServer");
                 if (String.IsNullOrWhiteSpace(newDnsRequest.DnsServer))
                     return GeneratFailureResponseDNS("Invalid Proxy DnsServer");

                 newDnsRequest.TimeoutMs = HeaderToValueInt(request, "Action-Delay-Proxy-TimeoutMs");
                 newDnsRequest.NetType = (NetType)((HeaderToValueInt(request, "Action-Delay-Proxy-NetType")) ?? 0);
                 newDnsRequest.RequestNSID = HeaderToValueBool(request, "Action-Delay-Proxy-RequestNSID");


                 var tryGetResponse = await dnsService.PerformDnsLookupAsync(newDnsRequest, "http");
                 return tryGetResponse;
             }
             catch (Exception ex)
             {
                 Log.Error(ex, "Critical error while handling DNS request.");
                 return GeneratFailureResponseDNS("Critical Internal Error While handling request");
             }
         });

            app.MapPost("/ICMP", async (HttpRequest request, IOptions<LocalConfig> probeConfiguration, IPingService pingService) =>
            {
                try
                {
                    var tryToGetAuthHeader = HeaderToValue(request, "Action-Delay-Proxy-Secret");
                    if (String.IsNullOrWhiteSpace(tryToGetAuthHeader) || tryToGetAuthHeader.Equals(probeConfiguration.Value.HttpRequestSecret, StringComparison.Ordinal) == false)
                        return GeneratFailureResponsePing("Invalid Proxy Secret");

                    var newDnsRequest = new SerializablePingRequest();
                    newDnsRequest.Hostname = HeaderToValue(request, "Action-Delay-Proxy-HostName");
                    if (String.IsNullOrWhiteSpace(newDnsRequest.Hostname))
                        return GeneratFailureResponsePing("Invalid Proxy Hostname");


                    newDnsRequest.PingCount = HeaderToValueInt(request, "Action-Delay-Proxy-PingCount");
                    newDnsRequest.CustomDNSServerOverride = HeaderToValue(request, "Action-Delay-Proxy-CustomDNSServerOverride");

                    newDnsRequest.TimeoutMs = HeaderToValueInt(request, "Action-Delay-Proxy-TimeoutMs");
                    newDnsRequest.NetType = (NetType)((HeaderToValueInt(request, "Action-Delay-Proxy-NetType")) ?? 0);
                


                    var tryGetResponse = await pingService.PerformRequestAsync(newDnsRequest);
                    return tryGetResponse;
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Critical error while handling PING request.");
                    return GeneratFailureResponsePing("Critical Internal Error While handling request");
                }
            });
            return app;
        }
        // https://stackoverflow.com/a/33611922
        public static async Task<byte[]> ReadAllBytes(Stream instream)
        {
            if (instream is MemoryStream ismemoryStream)
            {
                return ismemoryStream.ToArray();
            }

            using (var memoryStream = new MemoryStream())
            {
                instream.Position = 0;
                await instream.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }

        public static SerializableDNSResponse GeneratFailureResponseDNS(string reason)
        {
            return new SerializableDNSResponse()
            {
                Answers = new List<SerializableDnsAnswer>(),
                QueryType = "Unknown",
                QueryName = "Unknown",
                ProxyFailure = true,
                ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                Info = reason
            };
        }
        public static SerializableHttpResponse GenerateFailureResponseHttp(string reason)
        {
            return new SerializableHttpResponse
            {
                Body = string.Empty,
                WasSuccess = false,
                Headers = new Dictionary<string, string>(),
                StatusCode = HttpStatusCode.BadGateway,
                ProxyFailure = true,
                Info = reason,
            };
        }
        public static SerializablePingResponse GeneratFailureResponsePing(string reason)
        {
            return new SerializablePingResponse()
            {
                ProxyFailure = true,
                Info = reason
            };
        }

        public static bool? HeaderToValueBool(HttpRequest request, string key)
        {
            if (request.Headers.TryGetValue(key, out var value) && bool.TryParse(value.First(), out var parsedInt))
                return parsedInt;
            return null;
        }
        public static int? HeaderToValueInt(HttpRequest request, string key)
        {
            if (request.Headers.TryGetValue(key, out var value) && int.TryParse(value.First(), out var parsedInt))
                return parsedInt;
            return null;
        }
        public static string? HeaderToValue(HttpRequest request, string key)
        {
            if (request.Headers.TryGetValue(key, out var value))
                return value.FirstOrDefault();
            return null;
        }


        public static readonly IPAddress CloudflareV4 = IPAddress.Parse("1.1.1.1");
        public static readonly IPAddress CloudflareV6 = IPAddress.Parse("1.1.1.1");

        public static readonly IPAddress ControlDV4 = IPAddress.Parse("76.76.2.0");
        public static readonly IPAddress ControlDV6 = IPAddress.Parse("76.76.2.0");


        public static LookupClient StaticLookupClientAny;
        public static LookupClient StaticLookupClientV4;

        public static async ValueTask<Stream> ConnectCallBackTask(SocketsHttpConnectionContext context,
            CancellationToken cancellationToken)
        {

            string hostName = context.DnsEndPoint.Host;
            string nameserverOverride = string.Empty;
            if (context.InitialRequestMessage.Options.TryGetValue(
                    new HttpRequestOptionsKey<string>("DNSResolveOverride"),
                    out var resolveOverride))
            {
                hostName = resolveOverride;
            }
            if (context.InitialRequestMessage.Options.TryGetValue(
                    new HttpRequestOptionsKey<string>("CustomDNSServerOverride"),
                    out var customDNSServerOverride))
            {
                nameserverOverride = customDNSServerOverride;
            }


            
            var netType = NetType.Either;
            if (context.InitialRequestMessage.Options.TryGetValue(new HttpRequestOptionsKey<NetType>("IPVersion"),
                    out var version)) netType = version;

            Stopwatch stopwatch = Stopwatch.StartNew();
            IPHostEntry entry = await NetTypeSpecificLookup(hostName, netType, cancellationToken, nameserverOverride);
            stopwatch.Stop();
            context.InitialRequestMessage.Options.Set(new HttpRequestOptionsKey<long>("DNSResolveLatency"),
                stopwatch.ElapsedMilliseconds);

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
        }

        public static async Task<IPHostEntry> NetTypeSpecificLookup(string hostName, NetType netType, CancellationToken cancellationToken = default, string nameserverOverride = null)
        {
            IPHostEntry? entry = null;
            LookupClientOptions customOptions = null;
            if (String.IsNullOrWhiteSpace(nameserverOverride) == false && IPAddress.TryParse(nameserverOverride, out var parsedNsIp))
            {
                customOptions = new LookupClientOptions(parsedNsIp);
            }
            if (netType != NetType.Either)
            {
                IDnsQueryResponse dnsResponse = null;
                if (netType == NetType.IPv4)
                    dnsResponse = await (customOptions != null ? StaticLookupClientV4.QueryAsync(new DnsQuestion(hostName, QueryType.A), customOptions, cancellationToken) : StaticLookupClientV4.QueryAsync(new DnsQuestion(hostName, QueryType.A), cancellationToken));
                else if (netType == NetType.IPv6)
                    dnsResponse = await (customOptions != null ? StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.AAAA), customOptions, cancellationToken) : StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.AAAA), cancellationToken));

                entry = GetHostEntryProcessResult(hostName, dnsResponse.Answers.ToArray());

            }
            else
            {
                var resolveA = customOptions != null ? StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.A), customOptions, cancellationToken) : StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.A), cancellationToken);
                var resolveAAAA = customOptions != null ? StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.AAAA), customOptions, cancellationToken) : StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.AAAA), cancellationToken);
                List<DnsResourceRecord> records = new List<DnsResourceRecord>();
                try
                {
                    var resolvedQuadA = await resolveAAAA;
                    records.AddRange(resolvedQuadA.Answers);
                }
                catch { /* nom */ }
                try
                {
                    var resolvedA = await resolveA;
                    records.AddRange(resolvedA.Answers);
                }
                catch { /* nom */ }

                entry = GetHostEntryProcessResult(hostName, records.ToArray());
            }
            return entry ?? new IPHostEntry() { HostName = hostName, AddressList = Array.Empty<IPAddress>(), Aliases = Array.Empty<string>()};
        }


        /* https://github.com/MichaCo/DnsClient.NET/blob/f1e7ca33d713dc3bc70e7b3664aa3a2b6c090d5d/src/DnsClient/DnsQueryExtensions.cs#L369 */
        private static IPHostEntry GetHostEntryProcessResult(string host, DnsResourceRecord[] allRecords)
        {
            var hostString = DnsString.FromResponseQueryString(host);
            var addressRecords = allRecords
                .OfType<AddressRecord>()
                .Select(p => new
                {
                    p.Address,
                    Alias = DnsString.FromResponseQueryString(p.DomainName)
                })
                .ToArray();

            var hostEntry = new IPHostEntry()
            {
                Aliases = Array.Empty<string>(),
                AddressList = addressRecords
                    .Select(p => p.Address)
                    .ToArray()
            };

            if (addressRecords.Length > 1)
            {
                if (addressRecords.Any(p => !p.Alias.Equals(hostString)))
                {
                    hostEntry.Aliases = addressRecords
                        .Select(p => p.Alias.ToString())
                        .Select(p => p.Substring(0, p.Length - 1))
                        .Distinct()
                        .ToArray();
                }
            }
            else if (addressRecords.Length == 1)
            {
                if (allRecords.Any(p => !DnsString.FromResponseQueryString(p.DomainName).Equals(hostString)))
                {
                    hostEntry.Aliases = allRecords
                        .Select(p => p.DomainName.ToString())
                        .Select(p => p.Substring(0, p.Length - 1))
                        .Distinct()
                        .ToArray();
                }
            }

            hostEntry.HostName = hostString.Value.Substring(0, hostString.Value.Length - 1);

            return hostEntry;
        }


        private static void TaskSchedulerOnUnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
        {
            Log.Logger.Error(e.Exception,
                "[ERROR] Unobserved Error: {UnobservedTaskExceptionEventArgs} - {UnobservedTaskExceptionEventArgsException} - {senderObj}",
                e, e.Exception, sender);
            e.SetObserved();
        }
    }
}