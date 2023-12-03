using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Action_Delay_API_Core.Extensions;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using NATS.Client;
using Polly;
using Options = NATS.Client.Options;

namespace Action_Delay_API_Core.Services
{
    public class NATSQueue : IQueue
    {


        private readonly LocalConfig _configuration;

        private IConnection _natsConnection;

        private readonly ConnectionFactory _connectionFactory;


        private readonly ILogger _logger;

        public NATSQueue(ILogger<NATSQueue> logger, IOptions<LocalConfig> baseConfiguration, ILoggerFactory loggerFactory)
        {
            _configuration = baseConfiguration.Value;
            _logger = logger;

            _connectionFactory = new ConnectionFactory();
            _natsConnection = _connectionFactory.CreateConnection(GetOpts());

            _logger.LogInformation($"NATS Enabled, Connection Status: {_natsConnection.State}");
        }


        public async Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, string location, CancellationToken token)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(12));
            var tryGetReply = await SendMessage<NATSDNSRequest, SerializableDNSResponse>($"DNS-{location}", request, cancellationToken: newCancellationTokenSource.Token);
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null)
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }

        public async Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, string location, CancellationToken token)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(12));
            var tryGetReply = await SendMessage<NATSHttpRequest, SerializableHttpResponse>($"HTTP-{location}", request, cancellationToken: newCancellationTokenSource.Token);
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null) 
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }

        public async Task<Result<tOut?>> SendMessage<TIn, tOut>(string subject, TIn message, CancellationToken cancellationToken)
        {
            try
            {
                if (_natsConnection.IsReconnecting() == false &&
                    _natsConnection.IsClosed())
                {
                    if (_natsConnection.IsClosed() == false)
                        _natsConnection.Close();
                    _natsConnection.Dispose();


                    _natsConnection =
                        _connectionFactory.CreateConnection(GetOpts());

                    _logger.LogInformation($"NATS Connection closed, re-establishing, Connection Status: {_natsConnection.State}");

                }

                var tryGetMessage = await _natsConnection.RequestAsync(subject, message.Serialize(), 12000);

                if (tryGetMessage == null)
                    return Result.Fail($"Failed to get message from {subject}");
                var data = Encoding.UTF8.GetString(tryGetMessage.Data);

                if (string.IsNullOrEmpty(data))
                    return Result.Fail($"Failed to get message from {subject}, empty string returned");

                var updateInfo = JsonSerializer.Deserialize<tOut>(data);
                return updateInfo;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "NATS Connection to {subject} failed.", subject);
            }

            return Result.Fail("NATS Connection Failed");
        }

        private static readonly IAsyncPolicy natsRetryPolicy =
            Policy.Handle<NATSTimeoutException>()
                .Or<NATSProtocolException>()
                .WaitAndRetryAsync(1, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));

        private  Options GetOpts()
        {
            var opts = ConnectionFactory.GetDefaultOptions();
            opts.Url = _configuration.NATSConnectionURL;
            opts.AllowReconnect = true;
            opts.MaxReconnect = 2;
            opts.Timeout = 4000;
            return opts;
        }

        public async ValueTask DisposeAsync()
        { 
            this.Dispose();
        }

        public void Dispose()
        {
            try
            {
                if (_natsConnection.IsClosed() == false)
                {
                    _natsConnection.Close();
                    _natsConnection.Dispose();
                    _logger.LogInformation($"NATS Connection closed, ending task.");
                }

                _logger.LogInformation($"NATS Connection already closed, ending task.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disposing NATS");
            }
        }
    }
}
