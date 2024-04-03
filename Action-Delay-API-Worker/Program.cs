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

namespace Action_Deplay_API_Worker
{
    public class Program
    {
        private const string outputFormat =
  "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";

        public static async Task<int> Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration().MinimumLevel.Information()
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
            return Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
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
                .UseSerilog()
            .Build();
        }

        public static async ValueTask<Stream> ConnectCallBackTask(SocketsHttpConnectionContext context,
            CancellationToken cancellationToken)
        {
            IPHostEntry entry = null;
            if (context.InitialRequestMessage.Options.TryGetValue(new HttpRequestOptionsKey<NetType>("IPVersion"),
                    out var version) &&
                version != NetType.Either)
            {
                if (version == NetType.IPv4)
                    entry = await Dns.GetHostEntryAsync(context.DnsEndPoint.Host, AddressFamily.InterNetwork,
                        cancellationToken);
                else if (version == NetType.IPv6)
                    entry = await Dns.GetHostEntryAsync(context.DnsEndPoint.Host, AddressFamily.InterNetworkV6,
                        cancellationToken);
            }
            else
                entry = await Dns.GetHostEntryAsync(context.DnsEndPoint.Host, AddressFamily.Unspecified,
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