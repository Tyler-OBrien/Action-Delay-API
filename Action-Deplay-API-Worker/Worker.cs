using System.Buffers;
using System.Net;
using System.Text;
using Action_Deplay_API_Worker.Models.API.Response;
using Action_Deplay_API_Worker.Models.Config;
using Action_Deplay_API_Worker.Models.Services;
using Polly.Extensions.Http;
using Polly;
using Microsoft.Extensions.Options;
using Serilog;
using System.Text.Json;
using Action_Deplay_API_Worker.Extensions;
using Action_Deplay_API_Worker.Models.API.Request;
using Microsoft.Extensions.Configuration;
using NATS.Client;
using Options = NATS.Client.Options;
using DnsClient;

namespace Action_Deplay_API_Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ILoggerFactory _loggerFactory;
        private readonly LocalConfig _localConfig;
        private readonly IHttpService _httpService;
        private readonly IDnsService _dnsService;



        private IConnection _natsConnection;

        private readonly ConnectionFactory _connectionFactory;


        public Worker(ILogger<Worker> logger, ILoggerFactory loggerFactory, IOptions<LocalConfig> probeConfiguration, IHttpService httpService, IDnsService dnsService)
        {
            _logger = logger;
            _loggerFactory = loggerFactory;
            _localConfig = probeConfiguration.Value;
            _httpService = httpService;
            _dnsService = dnsService;
            _connectionFactory = new ConnectionFactory();
            _natsConnection = _connectionFactory.CreateConnection(GetOpts());
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            if (string.IsNullOrWhiteSpace(_localConfig.NATSConnectionURL))
            {
                _logger.LogInformation("NATS URL not setup or blank, aborting Queue Load");
                return;
            }


            _natsConnection.SubscribeAsync($"HTTP-{_localConfig.Location}", async (sender, args) =>
            {
                try
                {
                    var httpRequest = args.Message.Data.Deserialize<SerializableHttpRequest>();
                    if (httpRequest == null)
                    {
                        args.Message.Respond(new SerializableHttpResponse
                        {
                            Body = string.Empty,
                            WasSuccess = false,
                            Headers = new Dictionary<string, string>(),
                            StatusCode = HttpStatusCode.BadGateway,
                            Info = "Failed due to Null Request/unparsable"
                        }.Serialize());
                        return;
                    }
                    var reply = await _httpService.PerformRequestAsync(httpRequest);

                    // old
                    //To expand a bit on @sixlettervariables, there is a Request API that essentially publishes and waits for a response on a unique subject. The responder subscribes to a subject, and when it receives a message, it can either publish on the reply subject, or use a convenience method to reply with msg.Respond()
                    //https://github.com/nats-io/nats.net/issues/467

                    args.Message.Respond(reply.Serialize());
                }
                catch (Exception e)
                {
                    Log.Error(e, "Error with HTTP Hook");
                    args.Message.Respond(new SerializableHttpResponse
                    {
                        Body = string.Empty,
                        Headers = new Dictionary<string, string>(),
                        Info = "An Error occured",
                        StatusCode = HttpStatusCode.BadGateway,
                        WasSuccess = false
                    }.Serialize());
                }
            });





            _natsConnection.SubscribeAsync($"DNS-{_localConfig.Location}", async (sender, args) =>
            {
                try
                {
                    var dnsRequest = args.Message.Data.Deserialize<SerializableDNSRequest>();
                    if (dnsRequest == null)
                    {
                        args.Message.Respond(new SerializableDNSResponse()
                        {
                            Answers = new List<SerializableDnsAnswer>(),
                            QueryType = "Unknown",
                            QueryName = "Unknown",
                            ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                            Info = "Failed due to Null Request"
                        }.Serialize());
                        return;
                    }
                    var reply = await _dnsService.PerformDnsLookupAsync(dnsRequest);

                    //To expand a bit on @sixlettervariables, there is a Request API that essentially publishes and waits for a response on a unique subject. The responder subscribes to a subject, and when it receives a message, it can either publish on the reply subject, or use a convenience method to reply with msg.Respond()
                    //https://github.com/nats-io/nats.net/issues/467
                    args.Message.Respond(reply.Serialize());
                }
                catch (Exception e)
                {
                    Log.Error(e, "Error with DNS Hook");
                    args.Message.Respond(new SerializableDNSResponse()
                    {
                        Answers = new List<SerializableDnsAnswer>(),
                        QueryType = "Unknown",
                        QueryName = "Unknown",
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Info = "An error occured"
                    }.Serialize());
                }
            });

            _logger.LogInformation($"NATS Enabled, Connection State: {_natsConnection.State}");
            await Task.Delay(Timeout.Infinite, stoppingToken);
            _logger.LogInformation($"NATS Done..");

        }

        private Options GetOpts()
        {
            var opts = ConnectionFactory.GetDefaultOptions();
            opts.Url = _localConfig.NATSConnectionURL;
            opts.AllowReconnect = true;
            opts.MaxReconnect = Options.ReconnectForever;
            return opts;
        }

    }
}