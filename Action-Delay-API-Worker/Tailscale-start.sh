#!/bin/sh
echo 'Starting'
jq -n \
  --arg sentry_dsn "$SENTRY_DSN" \
  --argjson nats_url "$NATSConnectionURL" \
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
      "NATSConnectionURLs": $nats_url,
      "location": $location,
      "HttpRequestSecret": $http_request_secret
    }
  }' > /app/appsettings.json
echo 'Config Configured'
/app/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock &
echo 'Started tailscale service, now calling tailscale up'
/app/tailscale up --auth-key=${TAILSCALE_AUTHKEY} --hostname=app-${VPN_HOSTNAME}
echo 'tailscale up over, now waiting for the network to be ready'
timeout 20 sh -c 'while ! ping -c 1 -W 2 "$1" > /dev/null; do echo "Not ready yet..."; sleep 0.2; done; ping -c 1 "$1" | awk "/time=/{print \"Ready now, response in \" \$7}";' -- "$WARMUP_PING_TARGET"
dotnet Action-Delay-API-Worker.dll
