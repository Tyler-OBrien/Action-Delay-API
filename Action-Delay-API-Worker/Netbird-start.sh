#!/bin/sh
echo 'Starting'
jq -n \
  --arg sentry_dsn "$SENTRY_DSN" \
  --arg nats_url "$NATSConnectionURL" \
  --arg location "$LOCATION" \
  --arg http_request_secret "$HTTP_REQUEST_SECRET" \
  '{
    "Logging": {
      "LogLevel": {
        "Default": "Information",
        "Microsoft.Hosting.Lifetime": "Information"
      }
    },
    "Base": {
      "SENTRY_DSN": $sentry_dsn,
      "NATSConnectionURL": $nats_url,
      "location": $location,
      "HttpRequestSecret": $http_request_secret
    }
  }' > /app/appsettings.json
echo 'Config Configured'
/app/netbird service run --config /etc/netbird/config.json --log-level info --daemon-addr unix:///var/run/netbird.sock --log-file console &
echo 'Started netbird service, now calling netbird up'
/app/netbird up --setup-key=${NETBIRD_AUTHKEY} --hostname=app-${VPN_HOSTNAME} --log-file console
echo 'netbird up over, now waiting for the network to be ready'
timeout 20 sh -c 'while ! ping -c 1 -W 2 "$1" > /dev/null; do echo "Not ready yet..."; sleep 0.2; done; ping -c 1 "$1" | awk "/time=/{print \"Ready now, response in \" \$7}";' -- "$WARMUP_PING_TARGET"
dotnet Action-Delay-API-Worker.dll
