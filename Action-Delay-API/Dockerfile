# Action-Delay-API — .NET REST read API (Sdk.Web). Deployed Blue/Green.
# Build context = repo root (references the Core project + vendored DnsClient.dll).
#   docker build -f Action-Delay-API/Dockerfile -t rest .
#
# SelfContained=true + RID linux-x64 → self-contained publish on runtime-deps. Pulls
# SkiaSharp transitively via Core, so fontconfig is needed. Debian (not alpine).
#
# NOTE for Blue/Green: the runtime port comes from ASPNETCORE_URLS (set per slot by
# bluegreen.sh). The rendered appsettings.json for this service MUST NOT pin a
# Kestrel:Endpoints:Http:Url, or it overrides ASPNETCORE_URLS and both slots collide.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish "Action-Delay-API/Action-Delay-API.csproj" \
      -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime-deps:10.0 AS final
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
ENTRYPOINT ["./Action-Delay-API"]
