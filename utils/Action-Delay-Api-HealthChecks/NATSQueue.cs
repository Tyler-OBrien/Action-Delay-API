using System.Buffers;
using System.Collections.Concurrent;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_Api_HealthChecks.Models;
using FluentResults;
using NATS.Client.Core;
using ZstdSharp;

namespace Action_Delay_Api_HealthChecks
{
    public class NATSQueue 
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

        public NATSQueue(LocalConfig baseConfiguration)
        {
            _configuration = baseConfiguration;


            try
            {
                var assembly = Assembly.GetExecutingAssembly();
                using (var stream = assembly.GetManifestResourceStream("Action_Delay_Api_HealthChecks.EmbeddedResources.customdict.zstd"))
                {
                    using var memoryStream = new MemoryStream();
                    stream.CopyTo(memoryStream);
                    EmbeddedZstdDict = memoryStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                _logger?.LogCritical(ex, "Critical Issue loading embedded zstd dict, we won't be able to handle compressed requests");
            }


            var myRegistry = new NatsJsonContextSerializerRegistry(SerializableRequestJsonContext.Default);


            var options = NatsOpts.Default with { Url = _configuration.NATSConnectionURL, RequestTimeout = TimeSpan.FromSeconds(60), ConnectTimeout = TimeSpan.FromSeconds(60), SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60) };
            _natsConnection = new NatsConnection(options);

            _logger?.LogInformation($"NATS Enabled, Connection Status: {_natsConnection.ConnectionState}");
        }


        public async Task<Result<SerializableDNSResponse>> DNS(NATSDNSRequest request, Location location, CancellationToken token)
        {
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
            using var newCancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(token);
            newCancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(secondsTimeout));

            if (request.Method == MethodType.GET)
                request.Method = null;
            if (request.NetType == NetType.Either)
                request.NetType = null;
            if (request.EnableConnectionReuse == false)
                request.EnableConnectionReuse = null;
            if (request.ReturnBody is true)
                request.ReturnBody = null;
            if (request.ReturnBodyOnError is true)
                request.ReturnBody = null;

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


        public static JsonSerializerOptions DefaultJsonSerializerOptions = new JsonSerializerOptions()
        {
            TypeInfoResolver = SerializableRequestJsonContext.Default,
            PropertyNameCaseInsensitive = true,
            AllowTrailingCommas = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault,
        };

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
                            Timeout = TimeSpan.FromSeconds(60),
                            StartUpTimeout = TimeSpan.FromSeconds(60),
                            IdleTimeout = TimeSpan.FromSeconds(60),
                            ThrowIfNoResponders = true
                        });
                    if (tryGetMessage.Data == null)
                        return Result.Fail($"Failed to get message from {subject}");

                    return tryGetMessage.Data;
                }
            }
            catch (Exception ex)
            {
                return Result.Fail($"NATS Connection to {subject} failed: {ex.Message}");
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
                    _logger?.LogInformation($"NATS Connection closed, ending task.");
                    return;
                }

                _logger?.LogInformation($"NATS Connection already closed, ending task.");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error disposing NATS");
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
                    _logger?.LogInformation($"NATS Connection closed, ending task.");
                    return;
                }

                _logger?.LogInformation($"NATS Connection already closed, ending task.");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error disposing NATS");
            }
        }
    }
}
