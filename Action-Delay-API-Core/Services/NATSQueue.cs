using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.Local;
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

        private NatsConnection _natsConnection;


        private readonly ILogger _logger;

        public NATSQueue(ILogger<NATSQueue> logger, IOptions<LocalConfig> baseConfiguration, ILoggerFactory loggerFactory)
        {
            _configuration = baseConfiguration.Value;
            _logger = logger;

            var options = NatsOptions.Default with { LoggerFactory = loggerFactory, Url = _configuration.NATSConnectionURL, RequestTimeout = TimeSpan.FromSeconds(30) }; 
            _natsConnection = new NatsConnection(options);
           
            _logger.LogInformation($"NATS Enabled, Connection Status: {_natsConnection.ConnectionState}");
        }


        public async Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, string location, CancellationToken token)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(5));
            var tryGetReply = await _natsConnection.RequestAsync<NATSDNSRequest, SerializableDNSResponse>($"DNS-{location}", request, null, cancellationToken: newCancellationTokenSource.Token);
            if (tryGetReply.HasValue == false || tryGetReply.Value.Data == null) 
                return Result.Fail("Failed to get result");
            return tryGetReply.Value!.Data!;
        }

        public async Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, string location, CancellationToken token)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(5));
            var tryGetReply = await _natsConnection.RequestAsync<NATSHttpRequest, SerializableHttpResponse>($"HTTP-{location}", request, cancellationToken: newCancellationTokenSource.Token);
            if (tryGetReply.HasValue == false || tryGetReply.Value.Data == null) 
                return Result.Fail("Failed to get result");
            return tryGetReply.Value!.Data!;
        }
    }
}
