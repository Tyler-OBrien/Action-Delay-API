This project monitors delay of various Cloudflare/Bunny updates/operations that otherwise lack feedback. 

Main Cloudflare page: https://delay.chaika.me/delay/

Main Bunny Page: https://delay.bunny.chaika.me/delay/

Cloudflare's API will confirm the update for all these various actions, but the API confirming the update is just the first step. There are queues and replication in order to rollout those changes to the Edge, which can sometimes be delayed. For example, they detail the process for DNS Updates here: https://blog.cloudflare.com/dns-build-improvement

Bunny details a similiar process here for configuration updates: https://bunny.net/blog/pushing-user-experience-forward-with-realtime-config-propagation/

Incidients, maintenance, etc can cause large spikes of delays. This project was created to monitor that latency and serve as an easy reference for if there is currently issues or not.

Action-Delay-API-Core contains core job orchestration logic, including scheduling/running/tracking/updating Clickhouse/postgres of the job status

Action-Delay-API is the core ASP.NET Core API

Action-Delay-Data is just the data itself (for now located in core)

Action-Delay-API-Worker is what each locations run, a Service Worker listening on NATS (Running at core location) for requests to do arbitrary HTTP/DNS Requests, no job specific logic in them.


Scripts folder contains many scripts used for the program and related data, read readme there. 
