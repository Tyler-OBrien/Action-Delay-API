using System.Net;
using System.Net.Security;
using System.Reflection;
using System.Reflection.Metadata.Ecma335;
using System.Security.Authentication;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Broker.ColoData;
using Action_Delay_API_Core.Jobs.AI;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Polly;
using Polly.Extensions.Http;
using Sentry;
using Serilog;
using Serilog.Events;

namespace Action_Delay_API_Core;

public class Program
{
    private const string outputFormat =
        "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";


    public static string SENTRY_DSN = "";

    public static string VERSION = Assembly.GetCallingAssembly().GetName().Version.ToString();


    public static readonly JsonSerializerOptions JsonSerializerOptions =
        new()
        {
            AllowTrailingCommas = true, PropertyNamingPolicy = null, PropertyNameCaseInsensitive = true,
            NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString
        };


    public static async Task<int> Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration().MinimumLevel.Information()
#if !DEBUG
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
#endif
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
            .WriteTo.File("Logs/Log.log", outputTemplate: outputFormat,
                restrictedToMinimumLevel: LogEventLevel.Information, retainedFileCountLimit: 10,
                rollingInterval: RollingInterval.Day).WriteTo
            .Console(outputTemplate: outputFormat, restrictedToMinimumLevel: LogEventLevel.Information).Enrich
            .FromLogContext().CreateLogger();
        Log.Logger.Information("Loaded SeriLog Logger");
        TaskScheduler.UnobservedTaskException += TaskSchedulerOnUnobservedTaskException;

        {
            try
            {
                Log.Information("Starting host");
                var host = BuildHost(args);
                using (SentrySdk.Init(options =>
                       {
                           options.Dsn = SENTRY_DSN;
                           options.SendDefaultPii = true;
                           options.AttachStacktrace = true;
                           options.TracesSampleRate = 1.0;
                           options.AutoSessionTracking = true;
                           options.IsGlobalModeEnabled = true;
                           options.SetBeforeSend((sentryEvent, hint) =>
                           {
                               if (sentryEvent.Level == SentryLevel.Warning &&  sentryEvent.EventId.ToString().Contains("InboxSubscription", StringComparison.OrdinalIgnoreCase) && (sentryEvent?.Message?.Message?.Contains("Unregistered message inbox received", StringComparison.OrdinalIgnoreCase) ?? false))
                               {
                                   return null; // Don't send this event to Sentry
                               }

                               return sentryEvent;
                           });

                       }))
                {
                    await host.RunAsync();
                }

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
                await SentrySdk.FlushAsync();
            }
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
                services.AddSingleton<LocalConfig>(baseConfiguration);

                SENTRY_DSN = baseConfiguration.SENTRY_DSN;

                services.AddLogging();

                services.AddDbContextPool<ActionDelayDatabaseContext>(options =>
                {
                    options.UseNpgsql(baseConfiguration.PostgresConnectionString);
                });

             

                services.AddSingleton<IClickHouseService, ClickHouseService>();


                services.AddHttpClient<ICloudflareAPIBroker, CloudflareAPIBroker>()
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());



                services.AddTransient<ICloudflareAPIBroker, CloudflareAPIBroker>();

                services.AddHttpClient<IBunnyAPIBroker, BunnyAPIBroker>()
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());



                services.AddTransient<IBunnyAPIBroker, BunnyAPIBroker>();


                services.AddHttpClient<IColoDataBroker, ColoDataBroker>()
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());

                services.AddTransient<IColoDataBroker, ColoDataBroker>();


                if (baseConfiguration.UsingNATS == false)
                {
                    services.AddHttpClient("HttpQueueClient")
                        .ConfigureHttpClient(httpClient =>
                        {
                            httpClient.DefaultRequestVersion = HttpVersion.Version11;
                            httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                            httpClient.DefaultRequestHeaders.ConnectionClose = false;
                        })
                        .ConfigurePrimaryHttpMessageHandler((sp) =>
                        {
                            return new SocketsHttpHandler
                            {
                                PooledConnectionLifetime = TimeSpan.FromMinutes(15),
                                EnableMultipleHttp2Connections = true,
                                AllowAutoRedirect = false,
                                MaxConnectionsPerServer = Int32.MaxValue,
                                SslOptions = new SslClientAuthenticationOptions
                                {
                                    // internal certs are self-signed, all going over tailscale though (and if you were to deploy this, the same would be recommended, wireguard/headscale/tailscale/encryption)

                                    RemoteCertificateValidationCallback = (sender, certificate, chain, errors) => true
                                }
                            };
                        })
                        .AddPolicyHandler(GetRetryPolicy());

                    services.AddTransient<IQueue, HttpQueue>();
                }

                else
                {
                    services.AddSingleton<IQueue, NATSQueue>();
                }

                services.AddSingleton<IAIJobConfigs, AIJobConfigs>();

                services.AddScoped<IColoDataUpdateService, ColoDataUpdateService>();


                var jobs =
                    Assembly.GetExecutingAssembly()
                        .GetExportedTypes()
                        .Where(x => typeof(BaseJob).IsAssignableFrom(x) && x.GetConstructors().Any()).ToArray();

                foreach (var job in jobs)
                {
                    services.AddScoped(job);
                }


                services.AddHostedService<Worker>();
            })
            .UseSerilog()
            .Build();
    }

    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));
    }

    private static void TaskSchedulerOnUnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
    {
        Log.Logger.Error(e.Exception,
            "[ERROR] Unobserved Error: {UnobservedTaskExceptionEventArgs} - {UnobservedTaskExceptionEventArgsException} - {senderObj}",
            e, e.Exception, sender);
        throw e.Exception;
    }
}