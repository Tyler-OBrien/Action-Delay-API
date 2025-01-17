
using System.Diagnostics;
using System.Reflection;
using System.Text.Json.Serialization;
using ASPNETCoreSimpleWebAPI.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Sentry.Extensibility;
using Serilog;
using Serilog.Events;

namespace ASPNETCoreSimpleWebAPI
{
    public class Program
    {
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



            var builder = WebApplication.CreateBuilder(args);
            builder.Host.UseSerilog();

            if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SentryDSN")) == false)
                builder.WebHost.UseSentry(options =>
                {
                    options.Dsn = Environment.GetEnvironmentVariable("SentryDSN");
                    options.SendDefaultPii = true;
                    options.AttachStacktrace = true;
                    options.MaxRequestBodySize = RequestSize.Always;
                    options.MinimumBreadcrumbLevel = LogLevel.Debug;
                    options.MinimumEventLevel = LogLevel.Error;
                });

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });



            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddScoped<JSONErrorMiddleware>();
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = ctx => new ModelStateFilterJSON();
            });

            var app = builder.Build();

            app.Use(next => async context =>
            {
                var stopWatch = new Stopwatch();
                stopWatch.Start();

                context.Response.OnStarting(() =>
                {
                    stopWatch.Stop();
                    context.Response.Headers.Append("X-ResponseTime-Ms", stopWatch.ElapsedMilliseconds.ToString());
                    return Task.CompletedTask;
                });

                await next(context);
            });

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseMiddleware<JSONErrorMiddleware>();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
