using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.Extensions.Options;
using NATS.Client.Core;
using System.Collections.Concurrent;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text.Unicode;
using ZstdSharp;
using System.Text;
using Microsoft.Extensions.Primitives;
using System.Buffers;
using Action_Delay_API_Core.Models.NATS.Event;

namespace Action_Delay_API_Core.Services
{
    public class MixedSerializerRegistry : INatsSerializerRegistry
    {
        public INatsSerialize<T> GetSerializer<T>() => new NatsJsonContextSerializer<T>(SerializableRequestJsonContext.Default, NatsRawSerializer<T>.Default);

        public INatsDeserialize<T> GetDeserializer<T>() => new NatsJsonContextSerializer<T>(SerializableRequestJsonContext.Default, NatsRawSerializer<T>.Default);
    }
    public class NATSQueue : IQueue
    {


        private readonly LocalConfig _configuration;

        private NatsConnection? _natsConnection;


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





        private readonly ILogger _logger;

        public NATSQueue(ILogger<NATSQueue> logger, IOptions<LocalConfig> baseConfiguration, ILoggerFactory  loggerFactory)
        {
            _configuration = baseConfiguration.Value;
            _logger = logger;


            try
            {
                var assembly = Assembly.GetExecutingAssembly();
                using (var stream = assembly.GetManifestResourceStream("Action_Delay_API_Core.EmbeddedResources.customdict.zstd"))
                {
                    using var memoryStream = new MemoryStream();
                    stream.CopyTo(memoryStream);
                    EmbeddedZstdDict = memoryStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Critical Issue loading embedded zstd dict, we won't be able to handle compressed requests");
            }


            var myRegistry = new MixedSerializerRegistry();


            var options = NatsOpts.Default with { LoggerFactory = loggerFactory, Url = _configuration.NATSConnectionURL, RequestTimeout = TimeSpan.FromSeconds(60), ConnectTimeout  = TimeSpan.FromSeconds(60), SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60), InboxPrefix = String.IsNullOrWhiteSpace(_configuration.CoreName) ? "_INBOX_ActionDelayAPI" : $"_INBOX_{_configuration.CoreName}", Name = String.IsNullOrWhiteSpace(_configuration.CoreName) ? "Action-Delay-API-Core" : _configuration.CoreName, SubPendingChannelCapacity = 10_000, SubscriptionCleanUpInterval  = TimeSpan.FromMinutes(2), MaxReconnectRetry = -1};
            _natsConnection = new NatsConnection(options);

            _logger.LogInformation($"NATS Enabled, Connection Status: {_natsConnection.ConnectionState}");
        }


        public async Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, Location location, CancellationToken token)
        {
            // clean up defaults
            if (request.NetType == NetType.Either)
                request.NetType = null;
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(30));
            var tryGetReply = await SendMessage<NATSDNSRequest, SerializableDNSResponse>($"DNS-{location.NATSName ?? location.Name}", request, cancellationToken: newCancellationTokenSource.Token, compressed: _configuration.NATSRequestCompression || (location.Compression ?? false));
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null)
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }

        public async Task<Result<SerializableHttpResponse>> HTTP(NATSHttpRequest request, Location location, CancellationToken token, int secondsTimeout = 30)
        {
            request.HandleNoResponseHeadersOverride();
            // clean up defaults
            if (request.Method == MethodType.GET)
                request.Method = null;
            if (request.NetType == NetType.Either)
                request.NetType = null;
            if (request.EnableConnectionReuse == false)
                request.EnableConnectionReuse = null;
            if (request.ReturnBody == true)
                request.ReturnBody = null;
            if (request.ReturnBodyOnError == true)
                request.ReturnBodyOnError = null;
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(secondsTimeout));

     
            var tryGetReply = await SendMessage<NATSHttpRequest, SerializableHttpResponse>($"HTTP-{location.NATSName ?? location.Name}", request, cancellationToken: newCancellationTokenSource.Token, secondsTimeout, compressed: _configuration.NATSRequestCompression || (location.Compression ?? false));
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null) 
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }
        public async Task<Result<SerializablePingResponse>> Ping(NATSPingRequest request, Location location, CancellationToken token)
        {
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(30));
            var tryGetReply = await SendMessage<NATSPingRequest, SerializablePingResponse>($"PING-{location.NATSName ?? location.Name}", request, cancellationToken: newCancellationTokenSource.Token, compressed: _configuration.NATSRequestCompression || (location.Compression ?? false));
            if (tryGetReply.IsFailed)
                return Result.Fail(tryGetReply.Errors);
            if (tryGetReply.ValueOrDefault == null)
                return Result.Fail("Failed to get result");
            return tryGetReply.ValueOrDefault;
        }

        public async Task JobStatusUpdate(string jobName, string? newStatus, ulong? runLength, DateTime? lastUpdate)
        {
            await SendMessageNoReply<NATSJobUpdate>($"jobs.{jobName}",
                new NATSJobUpdate()
                    { JobName = jobName, RunLength = runLength, RunTime = lastUpdate, Status = newStatus }, CancellationToken.None, 30, true);
        }

        public async Task JobLocationUpdate(string jobName, string locationName, string? newStatus, ulong? runLength, DateTime? lastUpdate)
        {
            await SendMessageNoReply<NATSJobLocationUpdate>($"jobs.{jobName}.{locationName}",
                new NATSJobLocationUpdate()
                    { JobName = jobName, LocationName = locationName, RunLength = runLength, RunTime = lastUpdate, Status = newStatus }, CancellationToken.None, 30, true);
        }


        public static JsonSerializerOptions DefaultJsonSerializerOptions = new JsonSerializerOptions()
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault,
            AllowTrailingCommas = true,
            PropertyNameCaseInsensitive = true,
            TypeInfoResolver = SerializableRequestJsonContext.Default,
        };

        public async Task<Result> SendMessageNoReply<TIn>(string subject, TIn message, CancellationToken cancellationToken, int secondsTimeout = 30, bool compressed = false)
        {
            try
            {

                if (compressed)
                {

                    var serializedMsg = JsonSerializer.Serialize(message, DefaultJsonSerializerOptions);
                    var getString = Encoding.UTF8.GetBytes(serializedMsg);

                    using var memOwner = MemoryPool<byte>.Shared.Rent(Compressor.GetCompressBound(getString.Length));
                    Memory<byte> outgoingData = null;
                    Compressor getComp = null;
                    try
                    {

                        getComp = GetCompressor();
                        int length = getComp.Wrap(new ReadOnlySpan<byte>(getString), memOwner.Memory.Span);
                        outgoingData = memOwner.Memory.Slice(0, length);


                    }
                    finally
                    {
                        if (getComp != null)
                        {
                            ReturnCompressor(getComp);
                        }
                    }

                    if (outgoingData.Length == 0)
                        return Result.Fail($"Failed to compress");



                    await _natsConnection.PublishAsync<Memory<byte>>(subject, outgoingData,
                        cancellationToken: cancellationToken, headers: new NatsHeaders() { { "Comp", "1" } }, serializer:  NatsDefaultSerializer<Memory<byte>>.Default);
                    return Result.Ok();

                }
                else
                {
                    await _natsConnection.PublishAsync<TIn>(subject, message,
                        cancellationToken: cancellationToken);
                    return Result.Ok();

                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "NATS Connection to {subject} failed.", subject);
            }

            return Result.Fail("NATS Connection Failed");
        }

        public async Task<Result<tOut?>> SendMessage<TIn, tOut>(string subject, TIn message, CancellationToken cancellationToken, int secondsTimeout = 30, bool compressed = false)
        {
            try
            {

                if (compressed)
                {

                    var serializedMsg = JsonSerializer.Serialize(message, DefaultJsonSerializerOptions);
                    var getString = Encoding.UTF8.GetBytes(serializedMsg);

                    using var memOwner = MemoryPool<byte>.Shared.Rent(Compressor.GetCompressBound(getString.Length));
                    Memory<byte> outgoingData = null;
                    Compressor getComp = null;
                    try
                    {

                        getComp = GetCompressor();
                        int length = getComp.Wrap(new ReadOnlySpan<byte>(getString), memOwner.Memory.Span);
                        outgoingData = memOwner.Memory.Slice(0, length);


                    }
                    finally
                    {
                        if (getComp != null)
                        {
                            ReturnCompressor(getComp);
                        }
                    }

                    if (outgoingData.Length == 0)
                        return Result.Fail($"Failed to compress");



                    var tryGetMessage = await _natsConnection.RequestAsync<Memory<byte>, NatsMemoryOwner<byte>>(subject, outgoingData,
                        cancellationToken: cancellationToken,
                        replyOpts: new NatsSubOpts()
                        {
                            Timeout = TimeSpan.FromSeconds(60),
                            StartUpTimeout = TimeSpan.FromSeconds(60),
                            IdleTimeout = TimeSpan.FromSeconds(60),
                            ThrowIfNoResponders = true
                        }, headers: new NatsHeaders() { { "Comp", "1" } }, replySerializer: NatsDefaultSerializer<NatsMemoryOwner<byte>>.Default, requestSerializer: NatsDefaultSerializer<Memory<byte>>.Default);
                    try
                    {
                        if (tryGetMessage.Error != null)
                            return Result.Fail($"Failed to get message from {subject}");

                        Decompressor getDecomp = null;
                        try
                        {
                            getDecomp = GetDecompressor();

                            var decompressed = getDecomp.Unwrap(tryGetMessage.Data.Span);
                            var stringData = Encoding.UTF8.GetString(decompressed);


                            var deserializedData =
                                JsonSerializer.Deserialize<tOut>(stringData, DefaultJsonSerializerOptions);
                            return deserializedData;
                        }
                        finally
                        {
                            if (getDecomp != null)
                            {
                                ReturnDecompressor(getDecomp);
                            }
                        }
                    }

                    finally
                    {
                        tryGetMessage.Data.Dispose();
                    }
                }
                else
                {
                    var tryGetMessage = await _natsConnection.RequestAsync<TIn, tOut>(subject, message,
                        cancellationToken: cancellationToken,
                        replyOpts: new NatsSubOpts()
                        {
                            Timeout = TimeSpan.FromSeconds(60), StartUpTimeout = TimeSpan.FromSeconds(60),
                            IdleTimeout = TimeSpan.FromSeconds(60), ThrowIfNoResponders = true
                        });
                    if (tryGetMessage.Data == null)
                        return Result.Fail($"Failed to get message from {subject}");

                    return tryGetMessage.Data;
                }
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
