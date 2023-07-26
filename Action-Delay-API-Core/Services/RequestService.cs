using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Requests;
using Microsoft.Extensions.Options;
using NATS.Client;
using Options = NATS.Client.Options;

namespace Action_Delay_API_Core.Services
{
    public class RequestService : IServerUpdateQueue
    {

        private readonly SteamCollectorConfiguration _configuration;

        private IConnection _natsConnection;

        private readonly ConnectionFactory _connectionFactory;

        private readonly ILogger _logger;

        public RequestService(ILogger<ServerUpdateNATSQueue> logger, IOptions<SteamCollectorConfiguration> baseConfiguration)
        {
            _configuration = baseConfiguration.Value;
            _logger = logger;
            if (String.IsNullOrWhiteSpace(_configuration.NATSConnectionURL))
            {
                _logger.LogInformation("Not starting up NATS Queue since disabled in config");
                return;
            }
            _connectionFactory = new ConnectionFactory();
            _natsConnection = _connectionFactory.CreateConnection(GetOpts());
            _logger.LogInformation($"NATS Enabled, Connection Status: {_natsConnection.State}");
        }
        public async Task RequestHTTP(NATSHttpRequest updateInfo)
        {
            if (_natsConnection.IsReconnecting() == false &&
                _natsConnection.IsClosed())
            {
                if (_natsConnection.IsClosed() == false)
                    _natsConnection.Close();
                _natsConnection.Dispose();


                _natsConnection =
                    _connectionFactory.CreateConnection(GetOpts());
            }
            await _natsConnection.RequestAsync("Region", Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(updateInfo)));
        }

        private Options GetOpts()
        {
            var opts = ConnectionFactory.GetDefaultOptions();
            opts.Url = _configuration.NATSConnectionURL;
            opts.AllowReconnect = true;
            opts.MaxReconnect = Options.ReconnectForever;
            return opts;
        }
    }
}
