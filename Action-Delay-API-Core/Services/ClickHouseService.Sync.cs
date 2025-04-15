using NATS.Client.Core;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Event;
using Microsoft.Extensions.Primitives;
using NATS.Net;
using ZstdSharp;
using NATS.Client.JetStream.Models;
using NATS.Client.JetStream;
using System.Reflection.PortableExecutable;
using static Action_Delay_API_Core.Jobs.AI.AIJobConfigs;
using System.Buffers;
using System.Text.Json;
using System.Reactive.Subjects;
using Action_Delay_API_Core.Models.CloudflareAPI.WAF;
using FluentResults;
using Action_Delay_API_Core.Models.NATS;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService
    {
        private NatsConnection? _natsConnection;


        private static readonly ConcurrentBag<Compressor> _poolComp = new ConcurrentBag<Compressor>();


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

        public static JsonSerializerOptions DefaultJsonSerializerOptions = new JsonSerializerOptions()
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault,
            AllowTrailingCommas = true,
            PropertyNameCaseInsensitive = true,
        };

        private async Task<Result> PublishRows(List<ClickhouseRow> rows)
        {
            var span = SentrySdk.GetSpan();
            if (span != null)
            {
                span = span.StartChild("nats", $"Submit Clickhouse Results");
            }

            try
            {
                var js = _natsConnection.CreateJetStreamContext();

                var futures = new NatsJSPublishConcurrentFuture[rows.Count];

                for (var i = 0; i < rows.Count; i++)
                {
                    var row = rows[i];
                   
                    var serializedMsg = JsonSerializer.Serialize(row, DefaultJsonSerializerOptions);
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
                    {
                        span?.Finish(SpanStatus.InternalError);
                        return Result.Fail($"Failed to compress");
                    }

                    futures[i] = await js.PublishConcurrentAsync($"clickhouse.{row.TableName}", outgoingData,
                        opts: new NatsJSPubOpts() { RetryAttempts = 3, MsgId = Guid.NewGuid().ToString("N") },
                        headers: new NatsHeaders() { { "Comp", "1" } });
                }

                for (var i = 0; i < rows.Count; i++)
                {
                    await using var future = futures[i];
                    var ack = await future.GetResponseAsync();
                    ack.EnsureSuccess();
                }

                span?.Finish();
                return Result.Ok();
            }
            catch (Exception ex)
            {
                span?.Finish(ex);
                throw;
            }

        }

    }
}
