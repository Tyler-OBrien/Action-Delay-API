using System.Buffers;
using System.Collections.Concurrent;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_API_Worker.Models.API;
using Action_Delay_API_Worker.Models.API.Request;
using Action_Delay_API_Worker.Models.API.Request.Jobs;
using Action_Delay_API_Worker.Models.API.Response;
using Action_Delay_API_Worker.Models.API.Response.Jobs;
using Action_Delay_API_Worker.Models.Config;
using Action_Delay_API_Worker.Models.Services;
using Action_Delay_API_Worker.Services;
using DnsClient;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NATS.Client.Core;
using NATS.Client.Serializers.Json;
using Sentry.Extensibility;
using Serilog;
using ZstdSharp;
using ZstdSharp.Unsafe;
using static System.Net.Mime.MediaTypeNames;

namespace Action_Delay_API_Worker
{

    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ILoggerFactory _loggerFactory;
        private readonly LocalConfig _localConfig;
        private readonly IHttpService _httpService;
        private readonly IDnsService _dnsService;
        private readonly IPingService _pingService;
        private readonly JobService _jobService;





        public Worker(ILogger<Worker> logger, ILoggerFactory loggerFactory, IOptions<LocalConfig> probeConfiguration, IHttpService httpService, IDnsService dnsService, IPingService pingService, JobService jobService)
        {
            _logger = logger;
            _loggerFactory = loggerFactory;
            _localConfig = probeConfiguration.Value;
            _httpService = httpService;
            _dnsService = dnsService;
            _pingService = pingService;
            _jobService = jobService;
        }
        // These are backed by the same instance type under the hood, we could go unsafe and not have to create 2x the contexts, but blehhh
        private static readonly ConcurrentBag<Decompressor> _pool = new ConcurrentBag<Decompressor>();
        private static readonly ConcurrentBag<Compressor> _poolComp = new ConcurrentBag<Compressor>();

        public Decompressor GetDecompressor()
        {
            if (_pool.TryTake(out var dctx))
            {
                return dctx;
            }
            else
            {
                var newDecomp = new Decompressor();
                newDecomp.LoadDictionary(EmbeddedZstdDict);
                return newDecomp;
            }
        }

        public void ReturnDecompressor(Decompressor dctx)
        {
            _pool.Add(dctx);
        }

        public Compressor GetCompressor()
        {
            if (_poolComp.TryTake(out var dctx))
            {
                return dctx;
            }
            else
            {
                var newComp = new Compressor();
                newComp.LoadDictionary(EmbeddedZstdDict);
                return newComp;
            }
        }

        public void ReturnCompressor(Compressor dctx)
        {
            _poolComp.Add(dctx);
        }

        public static byte[] EmbeddedZstdDict;


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            if (string.IsNullOrWhiteSpace(_localConfig.NATSConnectionURL))
            {
                _logger.LogInformation("NATS URL not setup or blank, aborting Queue Load");
                return;
            }

            if (_localConfig.DumpToDirectoryForDictionaryTraining)
            {
                if (Directory.Exists("Dump") == false)
                    Directory.CreateDirectory("Dump");
                DumpToFileForDictTraining = true;
            }

            try
            {
                var assembly = Assembly.GetExecutingAssembly();
                using (var stream = assembly.GetManifestResourceStream("Action_Delay_API_Worker.EmbeddedResources.customdict.zstd"))
                {
                    using var memoryStream = new MemoryStream();
                    await stream.CopyToAsync(memoryStream);
                    EmbeddedZstdDict = memoryStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Critical Issue loading embedded zstd dict, we won't be able to handle compressed requests");
            }



            var myRegistry = new NatsJsonContextSerializerRegistry(SerializableRequestJsonContext.Default);


            var options = NatsOpts.Default with { LoggerFactory = _loggerFactory, Url = _localConfig.NATSConnectionURL, MaxReconnectRetry = -1, SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60), ConnectTimeout = TimeSpan.FromSeconds(60), RequestTimeout = TimeSpan.FromSeconds(60)};
            await using var natsConnection = new NatsConnection(options);

            await natsConnection.ConnectAsync();

            var tryHttp = Task.Run(async () =>
            {
                await foreach (var httpRequest in natsConnection
                                   .SubscribeAsync<NatsMemoryOwner<byte>>($"HTTP-{_localConfig.Location}",
                                       cancellationToken: stoppingToken, serializer: NatsRawSerializer<NatsMemoryOwner<byte>>.Default))
                {
                    _ = ExecuteHttpRequest(httpRequest, stoppingToken);
                }
            }, stoppingToken);



            var tryDNS = Task.Run(async () =>
            {
                await foreach (var dnsRequest in natsConnection
                                   .SubscribeAsync<NatsMemoryOwner<byte>>($"DNS-{_localConfig.Location}",
                                       cancellationToken: stoppingToken, serializer: NatsRawSerializer<NatsMemoryOwner<byte>>.Default))
                {
                    _ = ExecuteDNSRequest(dnsRequest, stoppingToken);
                }

            }, stoppingToken);

            var tryPing = Task.Run(async () =>
            {
                await foreach (var dnsRequest in natsConnection
                                   .SubscribeAsync<NatsMemoryOwner<byte>>($"PING-{_localConfig.Location}",
                                       cancellationToken: stoppingToken, serializer: NatsRawSerializer<NatsMemoryOwner<byte>>.Default))
                {
                    _ = ExecutePingRequest(dnsRequest, stoppingToken);
                }

            }, stoppingToken);


            /*
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
            */


            _logger.LogInformation($"NATS Enabled, Connection State: {natsConnection.ConnectionState}");
            await Task.WhenAll(tryDNS, tryHttp, tryPing);
            _logger.LogInformation($"NATS Done..");
        }



        public async Task ExecuteEndJobRequest(NatsMsg<NatsMemoryOwner<byte>> jobRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (jobRequest.Data.Length == 0)
                {
                    await ReplyAsync(jobRequest, new JobEndRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }

                var DATA = Encoding.UTF8.GetString(jobRequest.Data.Span);
                var jobEndRequest = JsonSerializer.Deserialize<JobEndRequest>(DATA);

                if (jobEndRequest == null)
                {
                    await ReplyAsync(jobRequest, new JobEndRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = _jobService.EndJob(jobEndRequest);
                await ReplyAsync(jobRequest, reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with ExecuteEndJobRequest");
                await ReplyAsync(jobRequest, new JobEndRequestResponse()
                {
                    Success = false,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
            finally
            {
                jobRequest.Data.Dispose();
            }
        }

        public async Task ExecuteStatusJobRequest(NatsMsg<NatsMemoryOwner<byte>> jobRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (jobRequest.Data.Length == 0)
                {
                    await ReplyAsync(jobRequest, new JobStatusRequestResponse()
                    {
                        Failed = false,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }
                var DATA = Encoding.UTF8.GetString(jobRequest.Data.Span);
                var jobStatusRequest = JsonSerializer.Deserialize<JobStatusRequest>(DATA);

                if (jobStatusRequest == null)
                {
                    await ReplyAsync(jobRequest, new JobStatusRequestResponse()
                    {
                        Failed = false,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = _jobService.StatusJob(jobStatusRequest);
                await ReplyAsync(jobRequest, reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with ExecuteStatusJobRequest");
                await ReplyAsync(jobRequest, new JobStatusRequestResponse()
                {
                    Failed = false,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
            finally
            {
                jobRequest.Data.Dispose();
            }
        }



        public async Task ExecuteStartJobRequest(NatsMsg<NatsMemoryOwner<byte>> jobRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (jobRequest.Data.Length == 0)
                {
                    await ReplyAsync(jobRequest, new JobStartRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }
                var DATA = Encoding.UTF8.GetString(jobRequest.Data.Span);
                var jobRequestData = JsonSerializer.Deserialize<JobStartRequest>(DATA);

                if (jobRequestData == null)
                {
                    await ReplyAsync(jobRequest, new JobStartRequestResponse()
                    {
                        Success = false,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = _jobService.StartJob(jobRequestData);
                await ReplyAsync(jobRequest, reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with ExecuteStartJobRequest");
                await ReplyAsync(jobRequest, new JobStartRequestResponse()
                {
                   Success = false,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
            finally
            {
                jobRequest.Data.Dispose();
            }
        }



        public async Task ExecuteDNSRequest(NatsMsg<NatsMemoryOwner<byte>> dnsRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (dnsRequest.Data.Length == 0)
                {
                    await ReplyAsync(dnsRequest, new SerializableDNSResponse()
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


                string DATA = null;
                if (dnsRequest.Headers?.ContainsKey("Comp") ?? false)
                {
                    Decompressor decomp = null;
                    try
                    {
                        decomp = GetDecompressor();
                        var decompressed = decomp.Unwrap(dnsRequest.Data.Span);
                        DATA = Encoding.UTF8.GetString(decompressed);
                    }
                    finally
                    {
                        if (decomp != null)
                            ReturnDecompressor(decomp);
                    }

                }
                else
                {
                    DATA = Encoding.UTF8.GetString(dnsRequest.Data.Span);
                }
                var dnsRequestData = JsonSerializer.Deserialize<SerializableDNSRequest>(DATA);

                if (dnsRequestData == null)
                {
                    await ReplyAsync(dnsRequest, new SerializableDNSResponse()
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


                var reply = await _dnsService.PerformDnsLookupAsync(dnsRequestData, (dnsRequest.Headers?.ContainsKey("Comp") ?? false) ? "nats-c" : "nats");
                await ReplyAsync(dnsRequest, reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with DNS Hook");
                await ReplyAsync(dnsRequest, new SerializableDNSResponse()
                {
                    Answers = new List<SerializableDnsAnswer>(),
                    QueryType = "Unknown",
                    QueryName = "Unknown",
                    ProxyFailure = true,
                    ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
            finally
            {
                dnsRequest.Data.Dispose();
            }
        }

        public async Task ExecuteHttpRequest(NatsMsg<NatsMemoryOwner<byte>> httpRequest, CancellationToken stoppingToken)
        {
            try
            {
       

                if (httpRequest.Data.Length == 0)
                {
                    await ReplyAsync(httpRequest, new SerializableHttpResponse
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

                string DATA = null;
                if (httpRequest.Headers?.ContainsKey("Comp") ?? false)
                {
                    Decompressor decomp = null;
                    try
                    {
                         decomp = GetDecompressor();
                         var decompressed = decomp.Unwrap(httpRequest.Data.Span);
                         DATA = Encoding.UTF8.GetString(decompressed);
                    }
                    finally
                    {
                        if (decomp != null)
                            ReturnDecompressor(decomp);
                    }

                }
                else
                {
                    DATA = Encoding.UTF8.GetString(httpRequest.Data.Span);
                }

                var httpRequestData = JsonSerializer.Deserialize<SerializableHttpRequest>(DATA);

                if (httpRequestData == null)
                {
                    await ReplyAsync(httpRequest, new SerializableHttpResponse
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

                var reply = await _httpService.PerformRequestAsync(httpRequestData, (httpRequest.Headers?.ContainsKey("Comp") ?? false) ? "nats-c" :  "nats");
                await ReplyAsync(httpRequest, reply, cancellationToken: stoppingToken);

            }
            catch (Exception e)
            {
                Log.Error(e, "Error with HTTP Hook");
                await ReplyAsync(httpRequest, new SerializableHttpResponse
                {
                    Body = string.Empty,
                    Headers = new Dictionary<string, string>(),
                    Info = "An Error occured",
                    StatusCode = HttpStatusCode.BadGateway,
                    ProxyFailure = true,
                    WasSuccess = false
                }, cancellationToken: stoppingToken);
            }
            finally
            {
                httpRequest.Data.Dispose();
            }
        }
        public async Task ExecutePingRequest(NatsMsg<NatsMemoryOwner<byte>> pingRequest, CancellationToken stoppingToken)
        {
            try
            {
                if (pingRequest.Data.Length == 0)
                {
                    await ReplyAsync(pingRequest, new SerializablePingResponse()
                    {
                        ProxyFailure = true,
                        Info = "Failed due to Null Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }

                string DATA = null;
                if (pingRequest.Headers?.ContainsKey("Comp") ?? false)
                {
                    Decompressor decomp = null;
                    try
                    {
                        decomp = GetDecompressor();
                        var decompressed = decomp.Unwrap(pingRequest.Data.Span);
                        DATA = Encoding.UTF8.GetString(decompressed);
                    }
                    finally
                    {
                        if (decomp != null)
                            ReturnDecompressor(decomp);
                    }

                }
                else
                {
                    DATA = Encoding.UTF8.GetString(pingRequest.Data.Span);
                }

                var serializablePingRequest = JsonSerializer.Deserialize<SerializablePingRequest>(DATA);

                if (serializablePingRequest == null)
                {
                    await ReplyAsync(pingRequest, new SerializablePingResponse()
                    {
                        ProxyFailure = true,
                        Info = "Failed due to Null/unparsable Request"
                    }, cancellationToken: stoppingToken);
                    return;
                }


                var reply = await _pingService.PerformRequestAsync(serializablePingRequest);
                await ReplyAsync(pingRequest, reply, cancellationToken: stoppingToken);
            }
            catch (Exception e)
            {
                Log.Error(e, "Error with Ping Hook");
                await ReplyAsync(pingRequest, new SerializablePingResponse()
                {
                    ProxyFailure = true,
                    Info = "An error occured"
                }, cancellationToken: stoppingToken);
            }
            finally
            {
                pingRequest.Data.Dispose();
            }
        }

        public static bool DumpToFileForDictTraining;

        public static JsonSerializerOptions DefaultJsonSerializerOptions = new JsonSerializerOptions()
        {
            TypeInfoResolver = SerializableRequestJsonContext.Default,
            AllowTrailingCommas = true,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault
        };

        public async Task DumpToFile<TReply>(NatsMemoryOwner<byte> inc, TReply data)
        {
            try
            {
                var msgGuid = Guid.NewGuid().ToString("N");
               var incTask = File.WriteAllTextAsync($"Dump/{msgGuid}.out.json",
                    JsonSerializer.Serialize(data, DefaultJsonSerializerOptions));
               var outTask = File.WriteAllBytesAsync($"Dump/{msgGuid}.in.json", inc.Memory);
               await Task.WhenAll(incTask, outTask);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error dumping to file");
            }
        }


        public ValueTask ReplyAsync<TReply>(NatsMsg<NatsMemoryOwner<byte>> inc,
            TReply data) => ReplyAsync(inc, data, CancellationToken.None);
        public ValueTask ReplyAsync<TReply>(NatsMsg<NatsMemoryOwner<byte>> inc,
            TReply data, CancellationToken cancellationToken)
        {
            if (DumpToFileForDictTraining)
               _ = DumpToFile(inc.Data, data);

            if (inc.Headers?.ContainsKey("Comp") ?? false)
            {
                var jsonSerialized = JsonSerializer.Serialize(data, DefaultJsonSerializerOptions);
                var utf8Data = Encoding.UTF8.GetBytes(jsonSerialized);


                using var memOwner = MemoryPool<byte>.Shared.Rent(Compressor.GetCompressBound(utf8Data.Length));
                Memory<byte> outgoingData = null;
                Compressor getComp = null;
                try
                {

                    getComp = GetCompressor();
                    int length = getComp.Wrap(new ReadOnlySpan<byte>(utf8Data), memOwner.Memory.Span);
                    outgoingData = memOwner.Memory.Slice(0, length);
                    return inc.ReplyAsync(outgoingData, cancellationToken: cancellationToken, headers: new NatsHeaders() { { "Comp", "1" } }, serializer: NatsDefaultSerializer<Memory<byte>>.Default);
                }
                finally
                {
                    if (getComp != null)
                    {
                        ReturnCompressor(getComp);
                    }
                }

            }
            else
            {
                return inc.ReplyAsync(data, cancellationToken: cancellationToken);
            }
        }
    }
}