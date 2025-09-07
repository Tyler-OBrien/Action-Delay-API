import { DurableObject } from "cloudflare:workers";

export interface Env {
  WEBSOCKET_HIBERNATION_SERVER: DurableObjectNamespace<WebSocketHibernationServer>;
}

// Worker
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    var parsedUrl = new URL(request.url);
    if (parsedUrl.pathname.endsWith("/ws")) {
      // Expect to receive a WebSocket Upgrade request.
      // If there is one, accept the request and return a WebSocket Response.
      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Durable Object expected Upgrade: websocket", {
          status: 426,
        });
      }

      // This example will refer to the same Durable Object,
      // since the name "foo" is hardcoded.
      let id = env.WEBSOCKET_HIBERNATION_SERVER.newUniqueId();
      let stub = env.WEBSOCKET_HIBERNATION_SERVER.get(id, {
        locationHint: parsedUrl.searchParams.get("region"),
      });

      return stub.fetch(request);
    }

    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
};

// Durable Object
export class WebSocketHibernationServer extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    // Creates two ends of a WebSocket connection.
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Calling `accept()` tells the runtime that this WebSocket is to begin terminating
    // request within the Durable Object. It has the effect of "accepting" the connection,
    // and allowing the WebSocket to send and receive messages.
    server.accept();


    server.addEventListener("message", (event) => {
      this.handleWebSocketMessage(server, event.data);
    });

    // If the client closes the connection, the runtime will close the connection too.
    server.addEventListener("close", (closeEvent) => {
      this.handleConnectionClose(server, closeEvent);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleWebSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    var parsed = JSON.parse(message);
    if (parsed && parsed.type.toLowerCase() == "ping") {
      ws.send(JSON.stringify({ type: "pong", id: parsed.id }));
    }
  }

  async handleConnectionClose(ws: WebSocket, closeEvent: CloseEvent) {
    ws.close(
      closeEvent.code,
      `Durable Object closing due to client. Reason: ${closeEvent.reason}, was clean: ${closeEvent.wasClean}`
    );
 
  }


}
