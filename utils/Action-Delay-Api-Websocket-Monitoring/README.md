# WebSocket monitoring

The monitor opens the configured number of connections to each endpoint, sends
ping messages, and reports completed sessions to the ingest service.

`appsettings.json` contains public endpoint URLs and non-secret defaults.
Supply the ingest credential through the environment:

```sh
Monitoring__IngestApiKey=<ingest credential> dotnet run
```

The .NET configuration provider also accepts `Monitoring__IngestUrl` and
`Monitoring__Endpoints__<index>__Url` overrides. Startup fails when the
credential or endpoint configuration is missing or invalid. Do not put the
credential in a committed appsettings file.
