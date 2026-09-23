using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

public sealed class MonitoringOptions
{
    public string IngestUrl { get; set; } = "";
    public string IngestApiKey { get; set; } = "";
    public int PingIntervalSeconds { get; set; } = 30;
    public int ReconnectDelaySeconds { get; set; } = 5;
    public int ConnectTimeoutSeconds { get; set; } = 30;
    public List<MonitoredEndpoint> Endpoints { get; set; } = [];

    public static bool IsValid(MonitoringOptions options) =>
        Uri.TryCreate(options.IngestUrl, UriKind.Absolute, out var ingest) && ingest.Scheme == Uri.UriSchemeHttps &&
        !string.IsNullOrWhiteSpace(options.IngestApiKey) &&
        options.PingIntervalSeconds > 0 && options.ReconnectDelaySeconds > 0 && options.ConnectTimeoutSeconds > 0 &&
        options.Endpoints.Count > 0 && options.Endpoints.All(endpoint =>
            !string.IsNullOrWhiteSpace(endpoint.Name) && endpoint.Connections > 0 &&
            Uri.TryCreate(endpoint.Url, UriKind.Absolute, out var uri) && uri.Scheme is "ws" or "wss");
}

public sealed class MonitoredEndpoint
{
    public string Name { get; set; } = "";
    public string Url { get; set; } = "";
    public int Connections { get; set; } = 1;
}

public sealed class Worker : BackgroundService
{
    private static readonly HttpClient ReportClient = new();
    private readonly MonitoringOptions _options;
    private readonly ILogger<Worker> _logger;

    public Worker(IOptions<MonitoringOptions> options, ILogger<Worker> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var monitors = _options.Endpoints.SelectMany(endpoint =>
            Enumerable.Range(0, endpoint.Connections).Select(_ => MonitorLoop(endpoint, stoppingToken)));
        return Task.WhenAll(monitors);
    }

    private async Task MonitorLoop(MonitoredEndpoint endpoint, CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await MonitorSession(endpoint, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "WebSocket connection to {Endpoint} failed", endpoint.Name);
            }

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(_options.ReconnectDelaySeconds), stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }

    private async Task MonitorSession(MonitoredEndpoint endpoint, CancellationToken stoppingToken)
    {
        using var socket = new ClientWebSocket();
        socket.Options.SetRequestHeader("User-Agent", "Action-Delay-API Websocket Monitoring");

        using (var connect = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken))
        {
            connect.CancelAfter(TimeSpan.FromSeconds(_options.ConnectTimeoutSeconds));
            await socket.ConnectAsync(new Uri(endpoint.Url), connect.Token);
        }

        var started = DateTime.UtcNow;
        var pending = new ConcurrentDictionary<string, long>();
        var latencies = new List<double>();
        using var session = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
        var sendTask = SendPings(socket, pending, session.Token);
        var receiveTask = ReceivePongs(socket, pending, latencies, session.Token);

        await Task.WhenAny(sendTask, receiveTask);
        session.Cancel();
        string reason = "Connection ended";
        try
        {
            await Task.WhenAll(sendTask, receiveTask);
        }
        catch (OperationCanceledException) when (session.IsCancellationRequested)
        {
            // Closing one side cancels the other.
        }
        catch (Exception ex)
        {
            reason = ex.Message;
            _logger.LogWarning(ex, "WebSocket session for {Endpoint} ended", endpoint.Name);
        }

        if (latencies.Count == 0 || stoppingToken.IsCancellationRequested)
            return;

        await ReportSession(endpoint.Name, started, latencies.Average(),
            socket.CloseStatus?.ToString() ?? "Disconnected", socket.CloseStatusDescription ?? reason, stoppingToken);
    }

    private async Task SendPings(ClientWebSocket socket, ConcurrentDictionary<string, long> pending,
        CancellationToken token)
    {
        while (socket.State == WebSocketState.Open && !token.IsCancellationRequested)
        {
            var id = Guid.NewGuid().ToString("N");
            pending[id] = Stopwatch.GetTimestamp();
            var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { type = "ping", id }));
            await socket.SendAsync(bytes, WebSocketMessageType.Text, true, token);
            await Task.Delay(TimeSpan.FromSeconds(_options.PingIntervalSeconds), token);
        }
    }

    private static async Task ReceivePongs(ClientWebSocket socket, ConcurrentDictionary<string, long> pending,
        List<double> latencies, CancellationToken token)
    {
        var buffer = new byte[4096];
        while (socket.State == WebSocketState.Open && !token.IsCancellationRequested)
        {
            var result = await socket.ReceiveAsync(buffer, token);
            if (result.MessageType == WebSocketMessageType.Close)
                return;
            if (result.MessageType != WebSocketMessageType.Text || !result.EndOfMessage)
                continue;

            PingMessage? pong;
            try
            {
                pong = JsonSerializer.Deserialize<PingMessage>(buffer.AsSpan(0, result.Count));
            }
            catch (JsonException)
            {
                continue;
            }

            if (pong?.Type == "pong" && pong.Id is not null && pending.TryRemove(pong.Id, out var sent))
            {
                latencies.Add(Stopwatch.GetElapsedTime(sent).TotalMilliseconds);
                if (latencies.Count > 50)
                    latencies.RemoveAt(0);
            }
        }
    }

    private async Task ReportSession(string source, DateTime started, double averagePing,
        string closeCode, string closeReason, CancellationToken token)
    {
        var payload = new[]
        {
            new
            {
                InputType = "websocket_monitoring",
                Data = new
                {
                    source,
                    timestamp = DateTime.UtcNow,
                    duration = (int)(DateTime.UtcNow - started).TotalMilliseconds,
                    closecode = closeCode,
                    closereason = closeReason,
                    avgping = (int)averagePing,
                }
            }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, _options.IngestUrl);
        request.Headers.Add("APIKEY", _options.IngestApiKey);
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        using var response = await ReportClient.SendAsync(request, token);
        if (!response.IsSuccessStatusCode)
            _logger.LogWarning("WebSocket report for {Endpoint} failed with HTTP {StatusCode}", source, response.StatusCode);
    }

    private sealed class PingMessage
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("id")]
        public string? Id { get; set; }
    }
}
