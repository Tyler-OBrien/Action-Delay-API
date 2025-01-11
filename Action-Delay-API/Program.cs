using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Events;
using Action_Delay_API.Middleware;
using Action_Delay_API_Core.Models.Services;
using Action_Delay_API_Core.Services;
using Microsoft.EntityFrameworkCore;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Local;
using System.Diagnostics;
using System.Reflection;
using Action_Delay_API.Models.API.Local;
using Action_Delay_API.Models.Services;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API.Services;
using Action_Delay_API.Services.v2;
using Microsoft.OpenApi.Models;
using Sentry.Extensibility;
using Swashbuckle.AspNetCore.Filters;
using Action_Delay_API.Controllers.v2;
using MessagePack.Resolvers;
using MessagePack;
using Microsoft.AspNetCore.Http.Connections;

namespace Action_Delay_API;


public class Program
{
    public static async Task<int> Main(string[] args)
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

        try
        {
            Log.Information("Starting host");
            var builtHost = BuildHost(args);

            var service =  builtHost.Services.GetRequiredService<NATSHubService>();

            service.Run(CancellationToken.None).ConfigureAwait(false);
            
            await builtHost.RunAsync();
            return 0;
        }
        // Note: This will change in .net 7 https://github.com/dotnet/runtime/issues/60600#issuecomment-1068323222
        // This is being done so we don't report errors about the Host being quit/exited.
        catch (Exception e) when (e is not OperationCanceledException && e.GetType().Name != "StopTheHostException")
        {
            Log.Fatal(e, "Host terminated unexpectedly");
            return 1;
        }
        finally
        {
            await Log.CloseAndFlushAsync();
        }
    }

    public static WebApplication BuildHost(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);


        IConfiguration configuration = builder.Configuration.GetSection("Base");
        var apiConfiguration = configuration.Get<APIConfig>();
        builder.Services.Configure<APIConfig>(configuration);

        var newLocalConfig = new LocalConfig()
        {
            ClickhouseConnectionString = apiConfiguration.ClickhouseConnectionString,
            PostgresConnectionString = apiConfiguration.PostgresConnectionString,
            NATSConnectionURL = apiConfiguration.NATSConnectionURL,
        };

        builder.Services.AddSingleton<LocalConfig>(newLocalConfig);


        builder.Host.UseSerilog();
#if !DEBUG // Annoying to get Sentry errors from Dev Env
        if (string.IsNullOrWhiteSpace(apiConfiguration.SENTRY_DSN) == false)
            builder.WebHost.UseSentry(options =>
            {
                options.Dsn = apiConfiguration.SENTRY_DSN;
                options.SendDefaultPii = true;
                options.AttachStacktrace = true;
                options.MaxRequestBodySize = RequestSize.Always;
                options.MinimumBreadcrumbLevel = LogLevel.Debug;
                options.MinimumEventLevel = LogLevel.Error;
            });
#endif


        builder.Services.AddScoped<ICacheJobService, CacheJobService>();

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        });

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle  

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.EnableAnnotations();
            options.ExampleFilters();
            options.OperationFilter<AddResponseHeadersFilter>();
            /*
            options.AddServer(new OpenApiServer()
            {
                Url = "https://delay.cloudflare.chaika.me"
            });
            */
        });
        builder.Services.AddSwaggerExamplesFromAssemblyOf(typeof(Program));


        builder.WebHost.UseKestrel(options => { options.AddServerHeader = false;  });

        builder.Services.AddDbContext<ActionDelayDatabaseContext>(options =>
        {
            options.UseNpgsql(apiConfiguration.PostgresConnectionString);
        });

        builder.Services.AddScoped<IClickHouseService, ClickHouseService>();
        builder.Services.AddScoped<ICompatibleJobAnalyticsService, CompatibleJobAnalyticsService>();
        builder.Services.AddScoped<IQuickAPIService, QuickAPIService>();
        builder.Services.AddScoped<ICacheSingletonService, CacheSingletonService>();
        builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
        builder.Services.AddScoped<IColoDataService, ColoDataService>();
        builder.Services.AddScoped<IJobDataService, JobDataService>();
        builder.Services.AddScoped<ILocationDataService, LocationDataService>();
        builder.Services.AddScoped<IExternalJobService, ExternalJobService>();


        builder.Services.AddScoped<JSONErrorMiddleware>();
        builder.Services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = ctx => new ModelStateFilterJSON();
        });


       builder.Services.AddSignalR(options =>
           {
               options.MaximumReceiveMessageSize = 1024;
               options.StreamBufferCapacity = 1;
           })
            .AddMessagePackProtocol();

        builder.Services.AddSingleton<NATSHubService>();

        //builder.Services.AddScoped<IPrometheusStatsCollector, PrometheusStatsCollector>();

        var app = builder.Build();


        app.Use(next => async context =>
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();

            context.Response.OnStarting(() =>
            {
                stopWatch.Stop();
                context.Response.Headers.Append("X-ResponseTime-Ms", stopWatch.ElapsedMilliseconds.ToString());
                context.Response.Headers.Append("X-Action-Delay-API-Version", Assembly.GetEntryAssembly().GetName().Version.ToString());
                return Task.CompletedTask;
            });

            await next(context);
        });




        //var serviceProvider = app.Services.GetRequiredService<IServiceProvider>();

        /*
        if (apiConfiguration.Prometheus_Metrics_Port != default)
        {
            Log.Logger.Information($"Enabling Prometheus Metrics at port {apiConfiguration.Prometheus_Metrics_Port}.");
            app.UseMetricServer(apiConfiguration.Prometheus_Metrics_Port);
            Metrics.DefaultRegistry.AddBeforeCollectCallback(async (token) =>
            {
                try
                {
                    using var newScope = serviceProvider.CreateScope();
                    await newScope.ServiceProvider.GetRequiredService<IPrometheusStatsCollector>().AddStats(token);
                }
                // Otherwise Prometheus swallowes these exceptions :(
                catch (Exception ex)
                {
                    SentrySdk.CaptureException(ex);
                    Serilog.Log.Logger.Error(ex, "Error when trying to execute AddBeforeCollectCallBack Prometheus callback");
                }
            });
        }
        */



        app.UseSwagger();
        app.UseSwaggerUI();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment()) app.UseHttpsRedirection();


        app.UseMiddleware<JSONErrorMiddleware>();

        app.UseAuthorization();

        app.MapControllers();

        app.MapHub<JobSignalRHub>("/v2/jobs/signalr", options =>
        {
            options.Transports = HttpTransportType.WebSockets;
        } );

        //if (apiConfiguration.Prometheus_Metrics_Port != default) app.UseHttpMetrics();

        return app;
    }
}