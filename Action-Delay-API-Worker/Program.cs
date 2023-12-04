using Action_Deplay_API_Worker.Models.Config;
using Action_Deplay_API_Worker.Models.Services;
using Action_Deplay_API_Worker.Services;
using Sentry.Extensions.Logging;
using Sentry.Extensions.Logging.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;

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

                    services.Configure<SentryLoggingOptions>(options =>
                    {
                        options.Dsn = baseConfiguration.SENTRY_DSN;
                        options.SendDefaultPii = true;
                        options.AttachStacktrace = true;
                        options.MinimumBreadcrumbLevel = LogLevel.Debug;
                        options.MinimumEventLevel = LogLevel.Warning;
                        options.TracesSampleRate = 1.0;
                    });
                    services.AddSentry<SentryLoggingOptions>();
                    services.AddLogging();

                    
                    services.AddTransient<IHttpService, HttpService>();
                    services.AddTransient<IDnsService, DnsService>();

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