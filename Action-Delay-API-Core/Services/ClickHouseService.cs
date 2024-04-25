using Action_Delay_API_Core.Models.API.CompatAPI;
using Action_Delay_API_Core.Models.Database.Clickhouse;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.Services;
using ClickHouse.Client.ADO;
using ClickHouse.Client.Copy;
using System.Data.Common;
using ClickHouse.Client.Utility;
using Action_Delay_API_Core.Models.API.Quick;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService : IClickHouseService
    {
        private readonly LocalConfig _config;
        private readonly ILogger _logger;



        public ClickHouseService(LocalConfig baseConfigurationOptions, ILogger<ClickHouseService> logger)
        {
            _config = baseConfigurationOptions;
            _logger = logger;
            if (String.IsNullOrEmpty(_config.ClickhouseConnectionString))
            {
                _logger.LogWarning($"Warning: Empty string given for Clickhouse Connection String");
            }
        }

        public ClickHouseConnection CreateConnection()
        {
            return new(_config.ClickhouseConnectionString);
        }

    }
}
