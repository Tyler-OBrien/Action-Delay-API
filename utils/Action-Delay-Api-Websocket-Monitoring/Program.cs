var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddOptions<MonitoringOptions>()
    .Bind(builder.Configuration.GetSection("Monitoring"))
    .Validate(MonitoringOptions.IsValid,
        "Monitoring requires an HTTPS ingest URL, an API key, and at least one valid WebSocket endpoint.")
    .ValidateOnStart();
builder.Services.AddHostedService<Worker>();

await builder.Build().RunAsync();
