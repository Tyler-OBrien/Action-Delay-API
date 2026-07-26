# Action-Delay-API-Core — headless job orchestrator (Sdk.Worker).
# Build context MUST be the repo root: Core references the vendored
# ../Action-Delay-API-Worker/Lib/DnsClient.dll via a relative HintPath.
#   docker build -f Action-Delay-API-Core/Dockerfile -t core .
#
# Core is SelfContained=true + RID linux-x64 (Release), so we publish a self-contained
# app and run it on runtime-deps (no .NET runtime layer needed). Debian base — NOT
# alpine — because SkiaSharp/HarfBuzz native assets are a known musl footgun.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish "Action-Delay-API-Core/Action-Delay-API-Core.csproj" \
      -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime-deps:10.0 AS final
WORKDIR /app
# SkiaSharp text/chart rendering needs fontconfig + freetype present at OS level
# (the native libSkiaSharp.so itself ships in the publish output).
RUN apt-get update \
    && apt-get install -y --no-install-recommends libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
# appsettings.json is bind-mounted at runtime (rendered by Salt from pillar).
ENTRYPOINT ["./Action-Delay-API-Core"]
