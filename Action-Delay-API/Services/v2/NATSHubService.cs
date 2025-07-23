using Action_Delay_API.Controllers.v2;
using Action_Delay_API.Models.API.Local;
using Action_Delay_API.Models.Services.v2;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Event;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Win32;
using NATS.Client.Core;
using System.Buffers;
using System.Collections.Concurrent;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ZstdSharp;

namespace Action_Delay_API.Services.v2;

public class MixedSerializerRegistry : INatsSerializerRegistry
{
    //public INatsSerialize<T> GetSerializer<T>() => new NatsJsonContextSerializer<T>(SerializableRequestJsonContext.Default, NatsRawSerializer<T>.Default);
    public INatsSerialize<T> GetSerializer<T>() => NatsRawSerializer<T>.Default;

    //public INatsDeserialize<T> GetDeserializer<T>() => new NatsJsonContextSerializer<T>(SerializableRequestJsonContext.Default, NatsRawSerializer<T>.Default);
    public INatsDeserialize<T> GetDeserializer<T>() => NatsRawSerializer<T>.Default;
}
public class NATSHubService
{


    private readonly APIConfig _configuration;
    private readonly IHubContext<JobSignalRHub> _hubContext;


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
    private readonly ICacheSingletonService _cacheSingletonService;
    private readonly ILoggerFactory _loggerFactory;

    public NATSHubService(ILogger<NATSHubService> logger, IOptions<APIConfig> baseConfiguration, ILoggerFactory loggerFactory, IHubContext<JobSignalRHub> hubContext, ICacheSingletonService cacheSingletonService)
    {
        _cacheSingletonService = cacheSingletonService;
        _hubContext = hubContext;
        _configuration = baseConfiguration.Value;
        _logger = logger;
        _loggerFactory = loggerFactory;


        try
        {
            var assembly = Assembly.GetExecutingAssembly();
            using (var stream = assembly.GetManifestResourceStream("Action_Delay_API.EmbeddedResources.customdict.zstd"))
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




      
    }

    public static JsonSerializerOptions DefaultJsonSerializerOptions = new JsonSerializerOptions()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault,
        AllowTrailingCommas = true,
        PropertyNameCaseInsensitive = true,
        TypeInfoResolver = SerializableRequestJsonContext.Default,
    };



    public async Task Run(CancellationToken stoppingToken)
    {
        await _cacheSingletonService.CacheJobNames(stoppingToken);


        List<Task> tasks = new List<Task>();

        var myRegistry = new MixedSerializerRegistry();


        foreach (var natsEvents in _configuration.NATSConnectionURLsForEvents)
        {
            var options = NatsOpts.Default with { LoggerFactory = _loggerFactory, Url = natsEvents, RequestTimeout = TimeSpan.FromSeconds(60), ConnectTimeout = TimeSpan.FromSeconds(60), SerializerRegistry = myRegistry, CommandTimeout = TimeSpan.FromSeconds(60), InboxPrefix = String.IsNullOrWhiteSpace(_configuration.CoreName) ? "_INBOX_ActionDelayAPI" : $"_INBOX_{_configuration.CoreName}", Name = String.IsNullOrWhiteSpace(_configuration.CoreName) ? "Action-Delay-API" : _configuration.CoreName, SubPendingChannelCapacity = 10_000, SubscriptionCleanUpInterval = TimeSpan.FromMinutes(2), MaxReconnectRetry = -1 };
            var natsConnection = new NatsConnection(options);


            var task =  Task.Run(async () =>
            {
                while (stoppingToken.IsCancellationRequested == false)
                {
                    try
                    {
                        await foreach (var msg in natsConnection
                                           .SubscribeAsync<NatsMemoryOwner<byte>>($"jobs.>",
                                               cancellationToken: stoppingToken,
                                               serializer: NatsRawSerializer<NatsMemoryOwner<byte>>.Default))
                        {
                            _ = HandleNatsMessage(msg, stoppingToken);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error with Jobs NATS Connection, retrying in 5 seconds");
                        // reconnect throttle
                        await Task.Delay(5000, stoppingToken);
                    }
                }
            });
            tasks.Add(task);
        }
        if (_configuration.NATSConnectionURLsForEvents.Any() == false) 
            _logger.LogWarning($"Warning: No NATSConnectionURLsForEvents to use to connect for events");
        await Task.WhenAll(tasks);
        _logger.LogWarning($"Nats Hub Done, ending loop");
    }

    private async Task HandleNatsMessage(NatsMsg<NatsMemoryOwner<byte>> msg, CancellationToken stoppingToken)
    {
        try
        {
            string DATA = null;
            if (msg.Headers?.ContainsKey("Comp") ?? false)
            {
                Decompressor decomp = null;
                try
                {
                    decomp = GetDecompressor();
                    var decompressed = decomp.Unwrap(msg.Data.Span);
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
                DATA = Encoding.UTF8.GetString(msg.Data.Span);
            }



            // Parse the NATS subject to determine the type and target
            var parts = msg.Subject.Split('.');

            if (parts.Length < 2) return;

            var jobName = parts[1];
            var isLocation = parts.Length > 2;

            // Send to different groups based on the message type
            if (isLocation)
            {
                var deserializedData =
                    JsonSerializer.Deserialize<NATSJobLocationUpdate>(DATA, DefaultJsonSerializerOptions);
                


                // Send to clients subscribed to both all updates and specific job locations
                await _hubContext.Clients.Groups($"job_{jobName}").SendAsync("ReceiveLocationUpdate", msg.Subject, deserializedData, cancellationToken: stoppingToken);
            }
            else
            {
                var deserializedData =
                    JsonSerializer.Deserialize<NATSJobUpdate>(DATA, DefaultJsonSerializerOptions);

                await _hubContext.Clients.Groups("all_jobs").SendAsync("ReceiveJobUpdate", msg.Subject, deserializedData, cancellationToken: stoppingToken);
                await _hubContext.Clients.Groups($"job_{jobName}").SendAsync("ReceiveJobUpdate", msg.Subject, deserializedData, cancellationToken: stoppingToken);

                var resolveType =  _cacheSingletonService.GetJobTypeFromNameSync(jobName, stoppingToken);
                if (String.IsNullOrWhiteSpace(resolveType) == false)
                    await _hubContext.Clients.Groups($"type_{resolveType}").SendAsync("ReceiveJobUpdate", msg.Subject, deserializedData, cancellationToken: stoppingToken);


            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling NATS message");
        }
    }

    /*

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
    */
}