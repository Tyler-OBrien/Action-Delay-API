using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using NATS.Client.Core;

namespace Action_Delay_API_Core.Services
{
    public class NATSQueue : IQueue
    {


        private readonly LocalConfig _configuration;

        private NatsConnection? _natsConnection;



        private readonly ILogger _logger;

        public NATSQueue(ILogger<NATSQueue> logger, IOptions<LocalConfig> baseConfiguration, ILoggerFactory loggerFactory)
        {
            _configuration = baseConfiguration.Value;
            _logger = logger;
            var myRegistry = new NatsJsonContextSerializerRegistry(SerializableRequestJsonContext.Default);


            var options = NatsOpts.Default with { LoggerFactory = loggerFactory, Url = _configuration.NATSConnectionURL, RequestTimeout = TimeSpan.FromSeconds(60), ConnectTimeout  = TimeSpan.FromSeconds(60), SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60)};
            _natsConnection = new NatsConnection(options);


            _logger.LogInformation($"NATS Enabled, Connection Status: {_natsConnection.ConnectionState}");
        }


        public async Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, Location location, CancellationToken token)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(30));
            var tryGetReply = await SendMessage<NATSDNSRequest, SerializableDNSResponse>($"DNS-{location.NATSName ?? location.Name}", request, cancellationToken: newCancellationTokenSource.Token);
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null)
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }

        public async Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, Location location, CancellationToken token, int secondsTimeout = 30)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(secondsTimeout));
            var tryGetReply = await SendMessage<NATSHttpRequest, SerializableHttpResponse>($"HTTP-{location.NATSName ?? location.Name}", request, cancellationToken: newCancellationTokenSource.Token, secondsTimeout);
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null) 
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }

        public async Task<Result<tOut?>> SendMessage<TIn, tOut>(string subject, TIn message, CancellationToken cancellationToken, int secondsTimeout = 30)
        {
            try
            {

                var tryGetMessage = await _natsConnection.RequestAsync<TIn, tOut>(subject, message, cancellationToken: cancellationToken, replyOpts: new NatsSubOpts() { Timeout = TimeSpan.FromSeconds(60), StartUpTimeout = TimeSpan.FromSeconds(60), IdleTimeout = TimeSpan.FromSeconds(60)});
                if (tryGetMessage.Data == null)
                    return Result.Fail($"Failed to get message from {subject}");

                return tryGetMessage.Data;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "NATS Connection to {subject} failed.", subject);
            }

            return Result.Fail("NATS Connection Failed");
        }



        public async ValueTask DisposeAsync()
        {
            try
            {
                if (_natsConnection != null)
                {
                    await _natsConnection.DisposeAsync();
                    _natsConnection = null;
                    _logger.LogInformation($"NATS Connection closed, ending task.");
                    return;
                }

                _logger.LogInformation($"NATS Connection already closed, ending task.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disposing NATS");
            }
        }

        public void Dispose()
        {
            try
            {
                if (_natsConnection != null)
                {
                    _natsConnection.DisposeAsync().GetAwaiter().GetResult();
                    _natsConnection = null;
                    _logger.LogInformation($"NATS Connection closed, ending task.");
                    return;
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
