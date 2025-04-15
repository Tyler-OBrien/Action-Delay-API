using Action_Delay_API_Clickhouse_Worker.Models;
using Sentry.Extensions.Logging;
using Sentry.Extensions.Logging.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;

namespace Action_Delay_API_Clickhouse_Worker
{
    public class Program
    {
        private const string outputFormat =
            "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";
        public static void Main(string[] args)
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





            var builder = Host.CreateApplicationBuilder(args);

            var services = builder.Services;

            IConfiguration configuration = builder.Configuration.GetSection("Base");
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
                    options.DefaultTags.Add("Location", baseConfiguration.RunnerName);
                    options.CaptureFailedRequests = false;
                });
                services.AddSentry<SentryLoggingOptions>();
            }




            builder.Services.AddHostedService<Worker>();

            var host = builder.Build();
            host.Run();
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