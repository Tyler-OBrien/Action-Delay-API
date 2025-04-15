using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Events;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Services;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using System.Diagnostics;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Sentry.Extensibility;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.AspNetCore.Http.Connections;


namespace Action_Delay_Api_Incidient_Monitoring
{
    public class Program
    {

        private const string outputFormat =
            "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}:{Resolver}:{RunType}] {Message:lj} {Exception}{NewLine}";


        public static string SENTRY_DSN = "";

        public static string VERSION = Assembly.GetCallingAssembly().GetName().Version.ToString();

        public static void Main(string[] args)
        {
            const string outputFormat =
                "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] [{SourceContext}] {Message:lj} {Exception}{NewLine}";

            Log.Logger = new LoggerConfiguration().MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("System", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                .WriteTo.Async(config =>
                {
                    config.File("Logs/Log.log", outputTemplate: outputFormat,
                        retainedFileCountLimit: 30,
                        rollingInterval: RollingInterval.Day);
                    config.Console(outputTemplate: outputFormat);
                }).Enrich.FromLogContext().CreateLogger();
            Log.Logger.Information("Loaded SeriLog Logger");

            var builder = Host.CreateApplicationBuilder(args);

            IConfiguration configuration = builder.Configuration.GetSection("Base");
            var baseConfiguration = configuration.Get<LocalConfig>();
            builder.Services.Configure<LocalConfig>(configuration);
            builder.Services.AddSingleton<LocalConfig>(baseConfiguration);

            SENTRY_DSN = baseConfiguration.SENTRY_DSN;

            builder.Services.AddLogging();


            builder.Services.AddDbContextPool<ActionDelayDatabaseContext>(options =>
            {
                options.UseNpgsql(baseConfiguration.PostgresConnectionString);
            });

            builder.Services.AddSingleton<IClickHouseService, ClickHouseService>();



            builder.Services.AddHostedService<Worker>();

            builder.Services.AddSerilog();
                
            var host = builder.Build();
            host.Run();
        }
    }
}