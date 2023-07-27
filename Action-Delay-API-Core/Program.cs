using Action_Delay_API_Core.Models.Local;
using Serilog.Events;
using Serilog;
using System.ComponentModel.Design;
using Action_Delay_API_Core.Broker;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Services;
using Sentry.Extensions.Logging;
using Sentry.Extensions.Logging.Extensions.DependencyInjection;
using Polly.Extensions.Http;
using Polly;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Jobs;

namespace Action_Delay_API_Core
{
    public class Program
    {
        private const string outputFormat =
  "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";



        public static readonly JsonSerializerOptions JsonSerializerOptions =
            new() { AllowTrailingCommas = true, PropertyNamingPolicy = null, PropertyNameCaseInsensitive = true, NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString };


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

                    services.AddHttpClient<ICloudflareAPIBroker, CloudflareAPIBroker>()
                        .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                        .AddPolicyHandler(GetRetryPolicy());

                    services.AddTransient<ICloudflareAPIBroker, CloudflareAPIBroker>();

                    services.AddSingleton<IQueue, NATSQueue>();

                    // Add all of the Jobs
                    var jobType = typeof(IBaseJob);

                    var jobs =
                        Assembly.GetExecutingAssembly()
                            .GetExportedTypes()
                            .Where(x => jobType.IsAssignableFrom(x) && x.GetConstructors().Any());

                    foreach (var job in jobs) services.AddSingleton(jobType, job);



                    services.AddHostedService<Worker>();


                })
                .UseSerilog()
                .Build();
        }

        static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
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
}