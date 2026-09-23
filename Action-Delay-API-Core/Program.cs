using System.Diagnostics;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Reflection;
using System.Reflection.Metadata.Ecma335;
using System.Security.Authentication;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Broker.Bunny;
using Action_Delay_API_Core.Broker.Google;
using Action_Delay_API_Core.Broker.ColoData;
using Action_Delay_API_Core.Jobs.AI;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Services;
using Action_Delay_API_Core.Services.Locations;
using DnsClient;
using DnsClient.Protocol;
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



    public static readonly IPAddress CloudflareV4 = IPAddress.Parse("1.1.1.1");
    public static readonly IPAddress CloudflareV6 = IPAddress.Parse("2606:4700:4700::1111");

    public static readonly IPAddress ControlDV4 = IPAddress.Parse("76.76.2.0");
    public static readonly IPAddress ControlDV6 = IPAddress.Parse("2606:1a40::");


    public static LookupClient StaticLookupClientAny;


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

        var lookupClientOptionsAny = new LookupClientOptions(CloudflareV4, ControlDV4, CloudflareV6, ControlDV6);
        lookupClientOptionsAny.UseCache = true;
        lookupClientOptionsAny.UseRandomNameServer = false;
        StaticLookupClientAny = new LookupClient(lookupClientOptionsAny);

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
                               if (sentryEvent.Level == SentryLevel.Warning &&
                                   sentryEvent.EventId.ToString().Contains("InboxSubscription",
                                       StringComparison.OrdinalIgnoreCase) &&
                                   (sentryEvent?.Message?.Message?.Contains("Unregistered message inbox received",
                                       StringComparison.OrdinalIgnoreCase) ?? false))
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

                // Registered ahead of the job scheduler: hosted services start in registration order,
                // so this guarantees no job ever sees an unpopulated provider.
                // NOT "CustomClient" - its ConnectCallback does a DnsClient lookup, which fails on a
                // literal 127.0.0.1.
                services.AddHttpClient(LocationProviderService.HttpClientName)
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());
                services.AddSingleton<LocationProviderService>();
                services.AddSingleton<ILocationProvider>(provider =>
                    provider.GetRequiredService<LocationProviderService>());
                services.AddHostedService(provider => provider.GetRequiredService<LocationProviderService>());

                SENTRY_DSN = baseConfiguration.SENTRY_DSN;

                services.AddLogging();

                services.AddDbContextPool<ActionDelayDatabaseContext>(options =>
                {
                    options.UseNpgsql(baseConfiguration.PostgresConnectionString);
                });

                // Pooled like the primary above. Registered unconditionally because jobs are
                // reflection-constructed further down and the container does not honour optional
                // constructor parameters - so it falls back to the primary connection when no local
                // one is configured, and callers skip it entirely in that case.
                services.AddPooledDbContextFactory<LocalActionDelayDatabaseContext>(options =>
                {
                    options.UseNpgsql(String.IsNullOrWhiteSpace(baseConfiguration.PostgresConnectionStringLocal)
                        ? baseConfiguration.PostgresConnectionString
                        : baseConfiguration.PostgresConnectionStringLocal);
                });

                Log.Information(String.IsNullOrWhiteSpace(baseConfiguration.PostgresConnectionStringLocal)
                    ? "Local marker database not configured, markers are written to the primary only"
                    : "Local marker database configured, markers will also be written locally before purging");

             

                services.AddSingleton<IClickHouseService, ClickHouseService>();


                services.AddHttpClient<ICloudflareAPIBroker, CloudflareAPIBroker>()
                    .ConfigureHttpClient(httpClient =>
                    {
                        httpClient.DefaultRequestVersion = HttpVersion.Version10;
                        httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                        httpClient.DefaultRequestHeaders.ConnectionClose = false;
                    })
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());

                services.AddHttpClient<IBunnyAPIBroker, BunnyAPIBroker>()
                    .ConfigureHttpClient(httpClient =>
                    {
                        httpClient.DefaultRequestVersion = HttpVersion.Version10;
                        httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                        httpClient.DefaultRequestHeaders.ConnectionClose = false;
                    })
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());

                services.AddHttpClient<IGoogleCloudAPIBroker, GoogleCloudAPIBroker>()
                    .ConfigureHttpClient(httpClient =>
                    {
                        httpClient.DefaultRequestVersion = HttpVersion.Version10;
                        httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                        httpClient.DefaultRequestHeaders.ConnectionClose = false;
                    })
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());

                services.AddHttpClient<IGoogleComputeAPIBroker, GoogleComputeAPIBroker>()
                    .ConfigureHttpClient(httpClient =>
                    {
                        httpClient.DefaultRequestVersion = HttpVersion.Version10;
                        httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                        httpClient.DefaultRequestHeaders.ConnectionClose = false;
                    })
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());

                // Named client used by the token provider to hit Google's OAuth2 token endpoint.
                services.AddHttpClient(nameof(GoogleServiceAccountTokenProvider))
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());
                // Singleton so the minted access token is cached across concurrent per-location broker calls.
                services.AddSingleton<IGoogleServiceAccountTokenProvider, GoogleServiceAccountTokenProvider>();

                services.AddHttpClient<IColoDataBroker, ColoDataBroker>()
                    .ConfigureHttpClient(httpClient =>
                    {
                        httpClient.DefaultRequestVersion = HttpVersion.Version10;
                        httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                        httpClient.DefaultRequestHeaders.ConnectionClose = false;
                    })
                    .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                    .AddPolicyHandler(GetRetryPolicy());

                services.AddHttpClient("CustomClient")
                    .ConfigureHttpClient(httpClient =>
                    {
                        httpClient.DefaultRequestVersion = HttpVersion.Version10;
                        httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
                        httpClient.DefaultRequestHeaders.ConnectionClose = false;
                    })
                    .ConfigurePrimaryHttpMessageHandler((sp) =>
                    {
                        return new SocketsHttpHandler
                        {
                            PooledConnectionLifetime = TimeSpan.FromMinutes(15),
                            ConnectCallback = ConnectCallBackTask,
                            EnableMultipleHttp2Connections = true,
                            MaxConnectionsPerServer = Int32.MaxValue,
                        };
                    });


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

    public static async ValueTask<Stream> ConnectCallBackTask(SocketsHttpConnectionContext context,
        CancellationToken cancellationToken)
    {

        string hostName = context.DnsEndPoint.Host;




        Stopwatch stopwatch = Stopwatch.StartNew();
        IPHostEntry entry = await NetTypeSpecificLookup(hostName, cancellationToken);
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

    public static async Task<IPHostEntry> NetTypeSpecificLookup(string hostName, CancellationToken cancellationToken = default)
    {
        IPHostEntry? entry = null;
        
        {
            var resolveA = StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.A), cancellationToken);
            var resolveAAAA = StaticLookupClientAny.QueryAsync(new DnsQuestion(hostName, QueryType.AAAA), cancellationToken);
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
        return entry ?? new IPHostEntry() { HostName = hostName, AddressList = Array.Empty<IPAddress>(), Aliases = Array.Empty<string>() };
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