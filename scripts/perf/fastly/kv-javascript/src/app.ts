import { KVStore } from "fastly:kv-store";
import { env } from "fastly:env";
import { SecretStore } from "fastly:secret-store";

export async function app(event: FetchEvent) {
  // Log out which version of the Fastly Service is responding to this request.
  // This is useful to know when debugging.


  /**
        Construct an KVStore instance which is connected to the KV Store named `my-store`

        [Documentation for the KVStore constuctor can be found here](https://js-compute-reference-docs.edgecompute.app/docs/fastly:kv-store/KVStore/)
    */
  var req = event.request;
  var getSecretStartReq = globalThis.performance.now();
  const secrets = new SecretStore('action-delay-api-secrets')
  var tryGetApiKeySecret = await secrets.get('APIKEY');
  if (!tryGetApiKeySecret) {
    return new Response("Can't get API Key from Secret Store", {
      status: 500,
    });
  }
  const apiKey = tryGetApiKeySecret.plaintext()
  var getDurSecret = globalThis.performance.now() - getSecretStartReq;
  if ((req.headers.get("apikey") === apiKey) == false) {
    return new Response("Bad Human", { status: 403 });
  }
  if (req.method != "GET" && req.method != "PUT") {
    return new Response("Method Not Allowed, Bad Human.", {
      status: 405,
    });
  }
  const store = new KVStore("action-delay-api");

  var url = new URL(req.url);
  const key = url.pathname.slice(1);

  if (key == "" || key == "." || key == "..") {
    return new Response("nothing here, key is invalid...", {
      status: 200,
      headers: {
        "x-fastly-pop": env("FASTLY_POP"),
      },
    });
  }

  if (req.method === "PUT") {
    if (req.body == null) {
      return new Response("No Body but put", {
        headers: {
          "x-fastly-pop": env("FASTLY_POP"),
        },
        status: 400,
      });
    }
    if (key.startsWith("cached") || key.startsWith("uncached")) {
      return new Response("cached and uncached dirs are protected.", {
        status: 401,
        headers: {
          "x-fastly-pop": env("FASTLY_POP"),
        },
      });
    }
    try {
      var startReq = globalThis.performance.now();
      await store.put(key, req.body);
      var getDur = globalThis.performance.now() - startReq;
      return new Response(null, {
        status: 200,
        headers: {
          "x-dur": getDur.toString(),
          "x-dur-secret": getDurSecret.toString(),
          "x-fastly-pop": env("FASTLY_POP"),
        },
      });
    } catch (exception) {
      console.log(exception);
      return new Response(`Error KV PUT: ${exception}`, {
        status: 500,
        headers: {
          "x-fastly-pop": env("FASTLY_POP"),
        },
      });
    }
  }

  try {
    var startReq = globalThis.performance.now();
    var tryGet = await store.get(key);
    var getDur = globalThis.performance.now() - startReq;
    if (tryGet === null) {
      return new Response("Could not get key: " + key, {
        status: 404,
        headers: {
          "x-dur": getDur.toString(),
          "x-dur-secret": getDurSecret.toString(),
          "x-fastly-pop": env("FASTLY_POP"),
        },
      });
    }
    return new Response(tryGet.body, {
      headers: {
        "x-dur": getDur.toString(),
        "x-dur-secret": getDurSecret.toString(),
        "x-fastly-pop": env("FASTLY_POP"),
      },
    });
  } catch (exception) {
    console.log(exception);
    return new Response(`Error KV GET: ${exception}`, { status: 500 });
  }
}
