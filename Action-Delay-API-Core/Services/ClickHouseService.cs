using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using ClickHouse.Client.ADO;
using ClickHouse.Client.Copy;
using System.Data.Common;
using ClickHouse.Client.Utility;
using Action_Delay_API_Core.Models.API.Quick;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NATS.Client.Core;
using System.Collections.Concurrent;
using ZstdSharp;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService : IClickHouseService
    {
        private readonly LocalConfig _config;
        private readonly ILogger _logger;



        public ClickHouseService(LocalConfig baseConfigurationOptions, ILogger<ClickHouseService> logger, ILoggerFactory loggerFactory)
        {
            _config = baseConfigurationOptions;
            _logger = logger;
            if (String.IsNullOrEmpty(_config.ClickhouseConnectionString))
            {
                _logger.LogWarning($"Warning: Empty string given for Clickhouse Connection String");
            }

            if (_config.SendClickhouseResultsToNATS)
            {
                var myRegistry = new MixedSerializerRegistry();
                var options = NatsOpts.Default with { LoggerFactory = loggerFactory, Url = _config.NATSConnectionURL, RequestTimeout = TimeSpan.FromSeconds(60), ConnectTimeout = TimeSpan.FromSeconds(60), SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60), InboxPrefix = String.IsNullOrWhiteSpace(_config.CoreName) ? "_INBOX_ActionDelayAPI_clickhouse" : $"_INBOX_{_config.CoreName}_clickhouse", Name = String.IsNullOrWhiteSpace(_config.CoreName) ? "Action-Delay-API-Core-Clickhouse" : _config.CoreName + "-Clickhouse", SubPendingChannelCapacity = 10_000, SubscriptionCleanUpInterval = TimeSpan.FromMinutes(2), MaxReconnectRetry = -1 };
                _natsConnection = new NatsConnection(options);
                _logger.LogInformation($"NATS Enabled for Clickhouse Sync, Connection Status: {_natsConnection.ConnectionState}");
            }
        }
        public ClickHouseConnection CreateConnection(bool write = false)
        {
            return new(_config.ClickhouseConnectionString);
        }

    }
}
