using System.Net;
using System.Net.Sockets;
using Action_Deplay_API_Worker.Models.Config;
using Action_Deplay_API_Worker.Models.Services;
using Action_Deplay_API_Worker.Services;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Sentry.Extensions.Logging;
using Sentry.Extensions.Logging.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;
using System.Threading;
using Action_Delay_API_Worker.Services;
using Action_Deplay_API_Worker.Models;
using Action_Deplay_API_Worker.Models.API.Request;
using Action_Deplay_API_Worker.Models.API.Response;
using Microsoft.Extensions.Options;
using DnsClient;

namespace Action_Deplay_API_Worker
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
                 newHttpRequest.EnableConnectionReuse = HeaderToValueBool(request, "Action-Delay-Proxy-EnableConnectionReuse");
                 newHttpRequest.Method = (MethodType)((HeaderToValueInt(request, "Action-Delay-Proxy-Method")) ?? 0);
                 newHttpRequest.ContentType = HeaderToValue(request, "Action-Delay-Proxy-ContentType");
                 newHttpRequest.ReturnBody = HeaderToValueBool(request, "Action-Delay-Proxy-ReturnBody");
                 newHttpRequest.DNSResolveOverride = HeaderToValue(request, "Action-Delay-Proxy-DNS-Override");
                 request.EnableBuffering();
                 newHttpRequest.Body = await ReadAllBytes(request.Body);
                 request.Body.Position = 0;

                 if (request.ContentLength == 0 || newHttpRequest.Body.Length == 0)
                 {
                     logger.LogWarning($"Request for {newHttpRequest.URL} has content-length of {request.ContentLength}, protocol: {request.Protocol}, but our byte stream has {newHttpRequest.Body.Length}");
                 }
                 var tryGetResponse = await httpService.PerformRequestAsync(newHttpRequest);
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

                 var tryGetResponse = await dnsService.PerformDnsLookupAsync(newDnsRequest);
                 return tryGetResponse;
             }
             catch (Exception ex)
             {
                 Log.Error(ex, "Critical error while handling DNS request.");
                 return GeneratFailureResponseDNS("Critical Internal Error While handling request");
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

        public static async ValueTask<Stream> ConnectCallBackTask(SocketsHttpConnectionContext context,
            CancellationToken cancellationToken)
        {

            string hostName = context.DnsEndPoint.Host;
            if (context.InitialRequestMessage.Options.TryGetValue(
                    new HttpRequestOptionsKey<string>("DNSResolveOverride"),
                    out var resolveOverride))
            {
                hostName = resolveOverride;
            }

            IPHostEntry entry = null;
            if (context.InitialRequestMessage.Options.TryGetValue(new HttpRequestOptionsKey<NetType>("IPVersion"),
                    out var version) &&
                version != NetType.Either)
            {
                if (version == NetType.IPv4)
                    entry = await Dns.GetHostEntryAsync(hostName, AddressFamily.InterNetwork,
                        cancellationToken);
                else if (version == NetType.IPv6)
                    entry = await Dns.GetHostEntryAsync(hostName, AddressFamily.InterNetworkV6,
                        cancellationToken);
            }
            else
                entry = await Dns.GetHostEntryAsync(hostName, AddressFamily.Unspecified,
                    cancellationToken);

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



        private static void TaskSchedulerOnUnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
        {
            Log.Logger.Error(e.Exception,
                "[ERROR] Unobserved Error: {UnobservedTaskExceptionEventArgs} - {UnobservedTaskExceptionEventArgsException} - {senderObj}",
                e, e.Exception, sender);
            throw e.Exception;
        }
    }
}