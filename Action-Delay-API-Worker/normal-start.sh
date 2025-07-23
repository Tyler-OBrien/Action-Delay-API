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
dotnet Action-Delay-API-Worker.dll
