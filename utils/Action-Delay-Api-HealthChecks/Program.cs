using Action_Delay_Api_HealthChecks.Broker;
using Polly.Extensions.Http;
using Polly;
using Sentry.Extensions.Logging;
using Sentry.Extensions.Logging.Extensions.DependencyInjection;

namespace Action_Delay_Api_HealthChecks
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = Host.CreateApplicationBuilder(args);


            IConfiguration configuration = builder.Configuration.GetSection("Base");
            var baseConfiguration = configuration.Get<LocalConfig>();
            builder.Services.Configure<LocalConfig>(configuration);
            builder.Services.AddSingleton<LocalConfig>(baseConfiguration);

            if (String.IsNullOrWhiteSpace(baseConfiguration.SENTRY_DSN) == false)
            {
                builder.Services.Configure<SentryLoggingOptions>(options =>
                {
                    options.Dsn = baseConfiguration.SENTRY_DSN;
                    options.SendDefaultPii = true;
                    options.AttachStacktrace = true;
                    options.MinimumBreadcrumbLevel = LogLevel.Debug;
                    options.MinimumEventLevel = LogLevel.Error;
                    options.TracesSampleRate = 1.0;
                    options.CaptureFailedRequests = false;
                });
                builder.Services.AddSentry<SentryLoggingOptions>();
            }

            builder.Services.AddLogging();
            builder.Services.AddSingleton<NATSQueue>();


            builder.Services.AddHttpClient<SlackWebhookBroker>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .AddPolicyHandler(GetRetryPolicy());



            builder.Services.AddTransient<SlackWebhookBroker>();

            builder.Services.AddHostedService<Worker>();
            var host = builder.Build();
            host.Run();
        }
        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));
        }
    }
}