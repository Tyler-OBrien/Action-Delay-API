using System.Net;
using Action_Delay_API_Worker.Models.API;
using Action_Deplay_API_Worker.Extensions;
using Action_Deplay_API_Worker.Models.API.Response;
using Action_Deplay_API_Worker.Models.Config;
using Action_Deplay_API_Worker.Models.Services;
using Microsoft.Extensions.Options;
using Serilog;
using Action_Deplay_API_Worker.Models.API.Request;
using DnsClient;
using NATS.Client.Core;
using Sentry.Extensibility;
using System.Text.Json;
using System.Text;
using Action_Delay_API_Worker.Models.API.Request.Jobs;
using Action_Delay_API_Worker.Models.API.Response.Jobs;
using Action_Delay_API_Worker.Services;
using Action_Deplay_API_Worker.Models;

namespace Action_Deplay_API_Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ILoggerFactory _loggerFactory;
        private readonly LocalConfig _localConfig;
        private readonly IHttpService _httpService;
        private readonly IDnsService _dnsService;
        private readonly JobService _jobService;





        public Worker(ILogger<Worker> logger, ILoggerFactory loggerFactory, IOptions<LocalConfig> probeConfiguration, IHttpService httpService, IDnsService dnsService, JobService jobService)
        {
            _logger = logger;
            _loggerFactory = loggerFactory;
            _localConfig = probeConfiguration.Value;
            _httpService = httpService;
            _dnsService = dnsService;
            _jobService = jobService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            if (string.IsNullOrWhiteSpace(_localConfig.NATSConnectionURL))
            {
                _logger.LogInformation("NATS URL not setup or blank, aborting Queue Load");
                return;
            }
  
            


            var myRegistry = new NatsJsonContextSerializerRegistry(SerializableRequestJsonContext.Default);


            var options = NatsOpts.Default with { LoggerFactory = _loggerFactory, Url = _localConfig.NATSConnectionURL, MaxReconnectRetry = -1, SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60), ConnectTimeout = TimeSpan.FromSeconds(60), RequestTimeout = TimeSpan.FromSeconds(60)};
            await using var natsConnection = new NatsConnection(options);

            await natsConnection.ConnectAsync();

            var tryHttp = Task.Run(async () =>
            {
                await foreach (var httpRequest in natsConnection
                                   .SubscribeAsync<byte[]>($"HTTP-{_localConfig.Location}",
                                       cancellationToken: stoppingToken, serializer: NatsRawSerializer<byte[]>.Default))
                {
                    _ = ExecuteHttpRequest(httpRequest, stoppingToken);
                }
            }, stoppingToken);



            var tryDNS = Task.Run(async () =>
            {
                await foreach (var dnsRequest in natsConnection
                                   .SubscribeAsync<byte[]>($"DNS-{_localConfig.Location}",
                                       cancellationToken: stoppingToken, serializer: NatsRawSerializer<byte[]>.Default))
                {
                    _ = ExecuteDNSRequest(dnsRequest, stoppingToken);
                }

            }, stoppingToken);

            var tryJob = Task.Run(async () =>
            {
                await foreach (var jobRequest in natsConnection
                                   .SubscribeAsync<byte[]>($"job.{_localConfig.Location}.*",
                                       cancellationToken: stoppingToken, serializer: NatsRawSerializer<byte[]>.Default))
                {
                    if (jobRequest.Subject.EndsWith("JobStart"))
                    {
                        _ = ExecuteStartJobRequest(jobRequest, stoppingToken);
                    }
                    else if (jobRequest.Subject.EndsWith("JobStatus"))
                    {
                        _ = ExecuteStatusJobRequest(jobRequest, stoppingToken);
                    }
                    else if (jobRequest.Subject.EndsWith("JobEnd"))
                    {
                        _ = ExecuteEndJobRequest(jobRequest, stoppingToken);
                    }
                }

            }, stoppingToken);

            var tryJobLoop = Task.Run(async () =>
            {
                await _jobService.StartJobLoop(stoppingToken);

            }, stoppingToken);



            _logger.LogInformation($"NATS Enabled, Connection State: {natsConnection.ConnectionState}");
            await Task.WhenAll(tryDNS, tryHttp, tryJob, tryJobLoop);
            _logger.LogInformation($"NATS Done..");
        }



        public async Task ExecuteEndJobRequest(NatsMsg<byte[]> jobRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (jobRequest.Data == null)
                {
                    await jobRequest.ReplyAsync(new JobEndRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }

                var DATA = Encoding.UTF8.GetString(jobRequest.Data);
                var jobEndRequest = JsonSerializer.Deserialize<JobEndRequest>(DATA);

                if (jobEndRequest == null)
                {
                    await jobRequest.ReplyAsync(new JobEndRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = _jobService.EndJob(jobEndRequest);
                await jobRequest.ReplyAsync(reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with ExecuteEndJobRequest");
                await jobRequest.ReplyAsync(new JobEndRequestResponse()
                {
                    Success = false,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
        }

        public async Task ExecuteStatusJobRequest(NatsMsg<byte[]> jobRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (jobRequest.Data == null)
                {
                    await jobRequest.ReplyAsync(new JobStatusRequestResponse()
                    {
                        Failed = false,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }
                var DATA = Encoding.UTF8.GetString(jobRequest.Data);
                var jobStatusRequest = JsonSerializer.Deserialize<JobStatusRequest>(DATA);

                if (jobStatusRequest == null)
                {
                    await jobRequest.ReplyAsync(new JobStatusRequestResponse()
                    {
                        Failed = false,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = _jobService.StatusJob(jobStatusRequest);
                await jobRequest.ReplyAsync(reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with ExecuteStatusJobRequest");
                await jobRequest.ReplyAsync(new JobStatusRequestResponse()
                {
                    Failed = false,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
        }



        public async Task ExecuteStartJobRequest(NatsMsg<byte[]> jobRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (jobRequest.Data == null)
                {
                    await jobRequest.ReplyAsync(new JobStartRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }
                var DATA = Encoding.UTF8.GetString(jobRequest.Data);
                var jobRequestData = JsonSerializer.Deserialize<JobStartRequest>(DATA);

                if (jobRequestData == null)
                {
                    await jobRequest.ReplyAsync(new JobStartRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = _jobService.StartJob(jobRequestData);
                await jobRequest.ReplyAsync(reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with ExecuteStartJobRequest");
                await jobRequest.ReplyAsync(new JobStartRequestResponse()
                {
                   Success = false,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
        }



        public async Task ExecuteDNSRequest(NatsMsg<byte[]> dnsRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (dnsRequest.Data == null)
                {
                    await dnsRequest.ReplyAsync(new SerializableDNSResponse()
                    {
                        Answers = new List<SerializableDnsAnswer>(),
                        QueryType = "Unknown",
                        QueryName = "Unknown",
                        ProxyFailure = true,
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }
                var DATA = Encoding.UTF8.GetString(dnsRequest.Data);
                var dnsRequestData = JsonSerializer.Deserialize<SerializableDNSRequest>(DATA);

                if (dnsRequestData == null)
                {
                    await dnsRequest.ReplyAsync(new SerializableDNSResponse()
                    {
                        Answers = new List<SerializableDnsAnswer>(),
                        QueryType = "Unknown",
                        QueryName = "Unknown",
                        ProxyFailure = true,
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = await _dnsService.PerformDnsLookupAsync(dnsRequestData);
                await dnsRequest.ReplyAsync(reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with DNS Hook");
                await dnsRequest.ReplyAsync(new SerializableDNSResponse()
                {
                    Answers = new List<SerializableDnsAnswer>(),
                    QueryType = "Unknown",
                    QueryName = "Unknown",
                    ProxyFailure = true,
                    ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
        }

        public async Task ExecuteHttpRequest(NatsMsg<byte[]> httpRequest, CancellationToken stoppingToken)
        {
            try
            {

                if (httpRequest.Data == null || httpRequest.Data.Length == 0)
                {
                    await httpRequest.ReplyAsync(new SerializableHttpResponse
                    {
                        Body = string.Empty,
                        WasSuccess = false,
                        ProxyFailure = true,
                        Headers = new Dictionary<string, string>(),
                        StatusCode = HttpStatusCode.BadGateway,
                        Info = "Failed due to Null Request/unparsable"
                    }, cancellationToken: stoppingToken);
                    return;
                }

                var DATA = Encoding.UTF8.GetString(httpRequest.Data);
                var httpRequestData = JsonSerializer.Deserialize<SerializableHttpRequest>(DATA);

                if (httpRequestData == null)
                {
                    await httpRequest.ReplyAsync(new SerializableHttpResponse
                    {
                        Body = string.Empty,
                        WasSuccess = false,
                        Headers = new Dictionary<string, string>(),
                        StatusCode = HttpStatusCode.BadGateway,
                        ProxyFailure = true,
                        Info = "Failed due to Null Request/unparsable"
                    }, cancellationToken: stoppingToken);
                    return;
                }

                var reply = await _httpService.PerformRequestAsync(httpRequestData);
                await httpRequest.ReplyAsync(reply, cancellationToken: stoppingToken);

            }
            catch (Exception e)
            {
                Log.Error(e, "Error with HTTP Hook");
                await httpRequest.ReplyAsync(new SerializableHttpResponse
                {
                    Body = string.Empty,
                    Headers = new Dictionary<string, string>(),
                    Info = "An Error occured",
                    StatusCode = HttpStatusCode.BadGateway,
                    ProxyFailure = true,
                    WasSuccess = false
                }, cancellationToken: stoppingToken);
            }
        }
    }
}