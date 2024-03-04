Collection of Scripts used to glue everything together


Action-Delay-API-Durable-Object-Proxy is a auth required Durable Object HTTP Request Proxy. We generate one DO per location. The idea is to have some colo-affinity for things like checking if cache clearing worked. It's currently only used by the Purge Cache Job.


You just need to define the secret `APIKEY` to be passed in a header, then the path is used as a Durable Object Name (ex I use locations), and the `url` query param is set for the URL you want to use. 


Action-Delay-API-WfP-Worker is a Simple Dynamic Dispatch worker for calling a User Worker


action-delay-quick-stats is used for the single stat cards like https://workers.cloudflare.chaika.me, https://dns.cloudflare.chaika.me, etc


action-delay-quick-stats-multi is used for  https://all.cloudflare.chaika.me to show all stats

workers-delay is https://delay.workers.chaika.me/ the Original Workers Delay Tracking built with KV, AE, DOs, DO Alarms and Cron. This also is used to display data for Workers delay for the current version via proxying fetch requests and adapting the format.
