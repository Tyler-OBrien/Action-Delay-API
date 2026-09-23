# Action-Delay-API-Clickhouse-Worker — NATS JetStream → ClickHouse sync consumer.
# Project file is Action-Delay-API-Clickhouse-Sync.csproj (assembly: same name).
# Framework-dependent (not self-contained), net10.0 → runtime:10.0 base + `dotnet <dll>`.
# Build context = repo root.
#   docker build -f Action-Delay-API-Clickhouse-Worker/Dockerfile -t chsync .

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Action-Delay-API-Clickhouse-Worker/Action-Delay-API-Clickhouse-Sync.csproj", "Action-Delay-API-Clickhouse-Worker/"]
RUN dotnet restore "./Action-Delay-API-Clickhouse-Worker/Action-Delay-API-Clickhouse-Sync.csproj"
COPY . .
WORKDIR "/src/Action-Delay-API-Clickhouse-Worker"
RUN dotnet publish "./Action-Delay-API-Clickhouse-Sync.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/runtime:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Action-Delay-API-Clickhouse-Sync.dll"]
