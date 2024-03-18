Action-Delay-API-Core contains core job orchestration logic, including scheduling/running/tracking/updating Clickhouse/postgres of the job status

Action-Delay-API is the core ASP.NET Core API

Action-Delay-Data is just the data itself (for now located in core)

Action-Delay-API-Worker is what each locations run, a Service Worker listening on NATS (Running at core location) for requests to do arbitrary HTTP/DNS Requests, no job specific logic in them.


Scripts folder contains many scripts used for the program, read readme there. 