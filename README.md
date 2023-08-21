Action-Delay-API-Core contains core job orchestration logic, including scheduling/running/tracking/updating Clickhouse/postgres of the job status

Action-Delay-API-Durable-Object-Proxy is a auth required Durable Object HTTP Request Proxy. We generate one DO per location. The idea is to have some colo-affinity for things like checking if cache clearing worked. It's currently only used by the Purge Cache Job.

Action-Delay-API is the core ASP.NET Core API

Action-Delay-Data is just the data itself (for now located in core)

Action-Delay-API-Worker is what each locations run, a Service Worker listening on NATS (Running at core location) for requests to do arbitrary HTTP/DNS Requests, no job specific logic in them.

