using Microsoft.Extensions.Options;
using NATS.Client.Core;
using System.Reflection;
using Action_Delay_API_Clickhouse_Worker.Models;
using NATS.Client.JetStream.Models;
using NATS.Net;
using System.Threading;
using NATS.Client.JetStream;
using System.Collections.Concurrent;
using System.Diagnostics;
using ClickHouse.Client.ADO;
using ClickHouse.Client.Copy;
using ZstdSharp;
using System.Text.Json.Nodes;

namespace Action_Delay_API_Clickhouse_Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ILoggerFactory _loggerFactory;
        private readonly LocalConfig _localConfig;






        public Worker(ILogger<Worker> logger, ILoggerFactory loggerFactory, IOptions<LocalConfig> workerConfig)
        {
            _logger = logger;
            _loggerFactory = loggerFactory;
            _localConfig = workerConfig.Value;

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
                //newDecomp.LoadDictionary(EmbeddedZstdDict);
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
                //newComp.LoadDictionary(EmbeddedZstdDict);
                return newComp;
            }
        }

        public void ReturnCompressor(Compressor dctx)
        {
            _poolComp.Add(dctx);
        }





        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            if (string.IsNullOrWhiteSpace(_localConfig.NATSConnectionURL))
            {
                _logger.LogInformation("NATS URL not setup or blank, aborting Queue Load");
                return;
            }
            /*
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
            */


            //var myRegistry = new NatsJsonContextSerializerRegistry(SerializableRequestJsonContext.Default);


            var options = NatsOpts.Default with { LoggerFactory = _loggerFactory, Url = _localConfig.NATSConnectionURL, MaxReconnectRetry = -1, CommandTimeout = TimeSpan.FromSeconds(60), ConnectTimeout = TimeSpan.FromSeconds(60), RequestTimeout = TimeSpan.FromSeconds(60) };
            await using var natsConnection = new NatsConnection(options);

            await natsConnection.ConnectAsync();



            List<Task> ingestStreams = new List<Task>();

            foreach (var syncTable in _localConfig.TablesToSync)
            {
                var table = syncTable;
                ingestStreams.Add(Task.Run((async () =>
                {
                    var js = natsConnection.CreateJetStreamContext();
                    var streamName = $"clickhouse_{table}";
                    var tryGetStream = await js.CreateOrUpdateStreamAsync(new StreamConfig(streamName, new List<string>() { $"clickhouse.{table}" })
                    {
                        Storage = StreamConfigStorage.File,
                        Retention = StreamConfigRetention.Interest,
                        Compression = StreamConfigCompression.S2,
                        MaxMsgs = 20000000
                    });


                    var getConsumer =
                        await js.CreateOrUpdateConsumerAsync(streamName, 
                            new ConsumerConfig($"clickhouse-{table}-{_localConfig.RunnerName}"));

                    while (stoppingToken.IsCancellationRequested == false)
                    {

                        try
                        {

                            var tryFetch = getConsumer.FetchAsync<byte[]>(new NatsJSFetchOpts()
                                    { Expires = TimeSpan.FromSeconds(10), MaxMsgs = 1_000 })
                                .WithCancellation(stoppingToken);

                            try
                            {
                                List<Tuple<NatsJSMsg<byte[]>, ClickhouseRow>> messages =
                                    new List<Tuple<NatsJSMsg<byte[]>, ClickhouseRow>>();

                                Decompressor deCompressor = GetDecompressor();

                                try
                                {
                                    await foreach (var msg in tryFetch)
                                    {
                                        var getData = deCompressor.Unwrap(msg.Data);
                                        var tryDeserialize =
                                            System.Text.Json.JsonSerializer.Deserialize<ClickhouseRow>(getData);
                                        messages.Add(new Tuple<NatsJSMsg<byte[]>, ClickhouseRow>(msg, tryDeserialize));
                                    }
                                }
                                finally
                                {
                                    ReturnDecompressor(deCompressor);
                                }

                                if (stoppingToken.IsCancellationRequested) return;
                        
                                Stopwatch newStopWatch = Stopwatch.StartNew();
                                foreach (var dataGroupedByColumns in messages.GroupBy(msg => GetColumnName(msg.Item2)))
                                {
                                    try
                                    {
                                        await InsertGeneric(dataGroupedByColumns.Select(grp => grp.Item2).ToList(),
                                            stoppingToken);
                                        foreach (var msg in dataGroupedByColumns)
                                        {
                                            await msg.Item1.AckAsync(cancellationToken: stoppingToken);
                                        }
                                    }
                                    catch (Exception ex)
                                    {
                                        _logger.LogError(ex, $"Error inserting/dealing with results for {streamName}");
                                    }
                                }
                                if (messages.Count != 0)
                                    _logger.LogInformation($"Handled {messages.Count} messages for {streamName}, in {newStopWatch.ElapsedMilliseconds}ms");
                            }
                            finally
                            {
                            }
                        }
                        catch (NatsJSProtocolException e)
                        {
                            _logger.LogError(e, "Error processing NATS Events, NatsJSProtocolException");
                        }
                        catch (NatsJSException e)
                        {
                            _logger.LogError(e, "Error processing NATS Events, NatsJSException");
                            await Task.Delay(1000, stoppingToken); 
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error processing NATS Events");
                        }

                    }
                })));
            }

       



            _logger.LogInformation($"NATS Enabled, Connection State: {natsConnection.ConnectionState}");
            await Task.WhenAll(ingestStreams);
            _logger.LogInformation($"NATS Done..");
        }

        public async Task InsertGeneric(List<ClickhouseRow> data, CancellationToken token = default)
        {
            var sample = data.FirstOrDefault();
            var getData = ProcessDataGroup(data);
            await using var connection = new ClickHouseConnection(_localConfig.ClickhouseConnectionString); 
            try
            {

                using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                {
                    DestinationTableName = sample.TableName,
                    ColumnNames = getData.ColumnNames,
                    BatchSize = 100000
                };


                await bulkCopyInterface.InitAsync();

                await bulkCopyInterface.WriteToServerAsync(
                    getData.DataRows, token);

            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse InsertGeneric");
                SentrySdk.CaptureException(ex);
                throw;
            }

        }

        public string GetColumnName(ClickhouseRow row)
        {
            if (row.Data is not JsonObject jsonObject)
            {
                _logger.LogWarning($"Skipping non-object data for type {row.TableName}");
                return string.Empty;
            }

            return String.Join("", jsonObject.Select(p => p.Key).ToArray());
        }

        public (List<object[]> DataRows, string[] ColumnNames) ProcessDataGroup(List<ClickhouseRow> dataGroup)
        {
            var dataRows = new List<object[]>();
            string[] columnNames = null;

            foreach (var dataPoint in dataGroup)
            {
                // Ensure the data is a JsonObject
                if (dataPoint.Data is not JsonObject jsonObject)
                {
                    _logger.LogWarning($"Skipping non-object data for type {dataPoint.TableName}");
                    continue;
                }

                // Extract column names (lowercase) on the first iteration
                if (columnNames == null)
                {
                    columnNames = jsonObject.Select(p => p.Key).ToArray();
                }

                // Extract values, preserving their original types
                var rowValues = new object[columnNames.Length];
                for (int i = 0; i < columnNames.Length; i++)
                {
                    var propertyName = columnNames[i];
                    var jsonValue = jsonObject[propertyName];

                    rowValues[i] = ConvertJsonNodeToValue(jsonValue);
                }

                dataRows.Add(rowValues);
            }

            return (dataRows, columnNames);
        }

        private static readonly string[] DateTimeFormats = new[]
        {
            "yyyy-MM-ddTHH:mm:ssZ",     // ISO 8601 UTC 
            "yyyy-MM-ddTHH:mm:ss.FFFZ",  // ISO 8601 with milliseconds
            "o",  // Round-trip date/time pattern
            "yyyy-MM-dd'T'HH:mm:sszzz",   // ISO 8601 with timezone,
            "yyyy-MM-ddTHH:mm:ss.FFFFFFFZ",  // With 7 decimal places for UTC
            "yyyy-MM-ddTHH:mm:ss.FFFFFFF",   // With 7 decimal places, no Z
            "yyyy-MM-ddTHH:mm:ssZ",          // No decimal places, with Z
            "yyyy-MM-ddTHH:mm:ss",           // No decimal places, no Z
            "yyyy-MM-ddTHH:mm:ss.FFFFFFFK",  // With timezone offset

        };
        private object TryParseDatetime(string strValue)
        {

            if (DateTime.TryParseExact(strValue, DateTimeFormats,
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.AdjustToUniversal,
                    out DateTime parsedDateTime))
            {
                return parsedDateTime;
            }

            return null;
        }


        public object ConvertJsonNodeToValue(JsonNode jsonValue)
        {
            if (jsonValue == null) return DBNull.Value;

            return jsonValue switch
            {
                JsonValue jv when jv.TryGetValue<string>(out var strValue) =>
                    TryParseDatetime(strValue) ?? strValue,
                JsonValue jv when jv.TryGetValue<long>(out var longValue) => longValue,
                JsonValue jv when jv.TryGetValue<double>(out var doubleValue) => doubleValue,
                JsonValue jv when jv.TryGetValue<bool>(out var boolValue) => boolValue,
                JsonArray ja => ja.Select(ConvertJsonNodeToValue).ToArray(),
                JsonObject jo => jo,
                _ => jsonValue.ToString()
            };
        }
    }
}
