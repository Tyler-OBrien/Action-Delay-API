using System.Reflection;
using System.Text.Json.Serialization;
using System.Text.Json;
using Action_Delay_API_Sync.Config;
using Serilog;
using Serilog.Events;

namespace Action_Delay_API_Sync
{
    public class Program
    {
        private const string outputFormat =
       "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";


        public static string SENTRY_DSN = "";

        public static string VERSION = Assembly.GetCallingAssembly().GetName().Version.ToString();


        public static readonly JsonSerializerOptions JsonSerializerOptions =
            new()
            {
                AllowTrailingCommas = true,
                PropertyNamingPolicy = null,
                PropertyNameCaseInsensitive = true,
                NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString
            };



        private static void BuildLogger()
        {
            Log.Logger = new LoggerConfiguration().MinimumLevel.Information()
#if !DEBUG
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
#endif
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("System", LogEventLevel.Warning)
                .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                .WriteTo.Sentry()
                .WriteTo.File("Logs/Log.log", outputTemplate: outputFormat,
                    restrictedToMinimumLevel: LogEventLevel.Information, retainedFileCountLimit: 10,
                    rollingInterval: RollingInterval.Day).WriteTo
                .Console(outputTemplate: outputFormat, restrictedToMinimumLevel: LogEventLevel.Information).Enrich
                .FromLogContext().CreateLogger();
            Log.Logger.Information("Loaded SeriLog Logger");
            TaskScheduler.UnobservedTaskException += TaskSchedulerOnUnobservedTaskException;
        }

        public static async Task<int> Main(string[] args)
        {


            {
                try
                {
                
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
                            if (sentryEvent.Level == SentryLevel.Warning && sentryEvent.EventId.ToString().Contains("InboxSubscription", StringComparison.OrdinalIgnoreCase) && (sentryEvent?.Message?.Message?.Contains("Unregistered message inbox received", StringComparison.OrdinalIgnoreCase) ?? false))
                            {
                                return null; // Don't send this event to Sentry
                            }

                            return sentryEvent;
                        });

                    }))
                    {
                        BuildLogger();
                        Log.Information("Starting host");
                        var host = BuildHost(args);
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
                    var baseConfiguration = configuration.Get<LocalSyncConfig>();
                    services.Configure<LocalSyncConfig>(configuration);
                    services.AddSingleton<LocalSyncConfig>(baseConfiguration);

                    SENTRY_DSN = baseConfiguration.SENTRY_DSN;

                    services.AddLogging();


                    services.AddHostedService<Worker>();
                })
                .UseSerilog()
                .Build();
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