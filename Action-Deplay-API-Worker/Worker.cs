using System.Buffers;
using System.Text;
using Action_Deplay_API_Worker.Models.API.Response;
using Action_Deplay_API_Worker.Models.Config;
using Action_Deplay_API_Worker.Models.Services;
using Polly.Extensions.Http;
using Polly;
using Microsoft.Extensions.Options;
using Serilog;
using System.Text.Json;
using Action_Deplay_API_Worker.Models.API.Request;
using NATS.Client.Core;

namespace Action_Deplay_API_Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ILoggerFactory _loggerFactory;
        private readonly LocalConfig _localConfig;
        private readonly IHttpService _httpService;
        private readonly IDnsService _dnsService;


        public Worker(ILogger<Worker> logger, ILoggerFactory loggerFactory, IOptions<LocalConfig> probeConfiguration, IHttpService httpService, IDnsService dnsService)
        {
            _logger = logger;
            _loggerFactory = loggerFactory;
            _localConfig = probeConfiguration.Value;
            _httpService = httpService;
            _dnsService = dnsService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            if (string.IsNullOrWhiteSpace(_localConfig.NATSConnectionURL))
            {
                _logger.LogInformation("NATS URL not setup or blank, aborting Queue Load");
                return;
            }

            var options = NatsOptions.Default with { LoggerFactory = _loggerFactory, Url = _localConfig.NATSConnectionURL};
            var natsConnection = new NatsConnection(options);

            var natsSub = await natsConnection.SubscribeAsync($"HTTP-{_localConfig.Location}", null, stoppingToken);



            var tryHttp = Task.Run(async () =>
            {
                while (await natsSub.Msgs.WaitToReadAsync(stoppingToken))
                {
                    await foreach (var msg in natsSub.Msgs.ReadAllAsync())
                    {
                        try
                        {
                            var DATA = Encoding.UTF8.GetString(msg.Data.Span);
                            var httpRequest = JsonSerializer.Deserialize<SerializableHttpRequest>(DATA);

                            var reply = await _httpService.PerformRequestAsync(httpRequest.URL, httpRequest.Headers);

                            //To expand a bit on @sixlettervariables, there is a Request API that essentially publishes and waits for a response on a unique subject. The responder subscribes to a subject, and when it receives a message, it can either publish on the reply subject, or use a convenience method to reply with msg.Respond()
                            //https://github.com/nats-io/nats.net/issues/467
                            var response =
                                new ReadOnlySequence<byte>(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(reply)));
                            await msg.ReplyAsync(response);
                        }
                        catch (Exception e)
                        {
                            Log.Error(e, "Error with Discordhook");
                        }
                    }
                }
            }, stoppingToken);

            var natsSubDns = await natsConnection.SubscribeAsync($"DNS-{_localConfig.Location}", null, stoppingToken);



            var tryDNS = Task.Run(async () =>
            {
                while (await natsSubDns.Msgs.WaitToReadAsync(stoppingToken))
                {
                    await foreach (var msg in natsSubDns.Msgs.ReadAllAsync())
                    {
                        try
                        {
                            var DATA = Encoding.UTF8.GetString(msg.Data.Span);
                            var dnsRequest = JsonSerializer.Deserialize<SerializableDNSRequest>(DATA);

                            var reply = await _dnsService.PerformDnsLookupAsync(dnsRequest.QueryName,
                                dnsRequest.QueryType, dnsRequest.DnsServer);

                            //To expand a bit on @sixlettervariables, there is a Request API that essentially publishes and waits for a response on a unique subject. The responder subscribes to a subject, and when it receives a message, it can either publish on the reply subject, or use a convenience method to reply with msg.Respond()
                            //https://github.com/nats-io/nats.net/issues/467
                            var response =
                                new ReadOnlySequence<byte>(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(reply)));
                            await msg.ReplyAsync(response);
                        }
                        catch (Exception e)
                        {
                            Log.Error(e, "Error with Discordhook");
                        }
                    }
                }
            }, stoppingToken);

            _logger.LogInformation($"NATS Enabled, Connection State: {natsConnection.ConnectionState}");
            await Task.WhenAll(tryDNS, tryHttp);
            _logger.LogInformation($"NATS Done..");

        }



    }
}