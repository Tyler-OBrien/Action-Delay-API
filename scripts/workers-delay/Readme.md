Original Workers Delay Tracking built with KV, AE, DOs, DO Alarms and Cron. This also is used to display data for Workers delay for the current version via proxying fetch requests and adapting the format.

Secrets needed:

CRONAPIKEY: Arbitrary API key for manually triggering cron
APIKEY: CF API Key for updating Worker
SENTRY_DSN: For Toucan JS tracker (currently not optional, this was built before tail workers)