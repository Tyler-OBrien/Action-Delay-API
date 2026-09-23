using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseWebSockets();

app.Map("/ws", async (HttpContext context, CancellationToken token) =>
{
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = 400;
        return;
    }

    var ws = await context.WebSockets.AcceptWebSocketAsync();
    var buffer = new byte[4096];

    try
    {
        while (ws.State == WebSocketState.Open)
        {
            var result = await ws.ReceiveAsync(buffer, token);

            if (result.MessageType == WebSocketMessageType.Close)
            {
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Goodbye", CancellationToken.None);
                break;
            }

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

                // Handle ping/pong
                try
                {
                    var json = System.Text.Json.JsonSerializer.Deserialize<Ping>(message);
                    if (json?.Type == "ping")
                    {
                        var pong = JsonSerializer.Serialize(new { type = "pong", id = json.Id });



                        var pongBytes = Encoding.UTF8.GetBytes(pong);
                        await ws.SendAsync(pongBytes, WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
                catch (Exception ex)
                {
                    app.Logger.LogDebug(ex, "Received a non-ping WebSocket message");
                    // Not a ping message, echo it back
                    await ws.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count),
                                     WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
    catch (WebSocketException)
    {
        // Connection closed unexpectedly
    }
});

app.MapGet("/events", async (HttpContext context) =>
{
    context.Response.Headers.Append("Content-Type", "text/event-stream");
    context.Response.Headers.Append("Cache-Control", "no-cache");
    context.Response.Headers.Append("Connection", "keep-alive");

    var writer = new StreamWriter(context.Response.Body);
    var cancellationToken = context.RequestAborted;

    try
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var pingData = JsonSerializer.Serialize(new { type = "ping", time = DateTime.UtcNow.ToString("O") });

            await writer.WriteAsync($"data: {pingData}\n\n");
            await writer.FlushAsync();

            await Task.Delay(30000, cancellationToken); // 30 seconds
        }
    }
    catch (OperationCanceledException)
    {
        // Client disconnected
    }
});

app.Run();


public  class Ping
{
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }
}
