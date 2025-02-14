// src/index.ts
import HTML from "./6674419b1a4cd9f6df1edfd025737f63c66e3bd9-index.html";
import LEAFLETMINCSS from "./a5aec2249df041c934f3884b9a405702d6a49dd8-leaflet.min.css";
import PROTOMAPSJS from "./ba1f9423cb5e4d67b054989aa1d576d487c96219-protomaps-leaflet.js";
import LEAFLETMINJS from "./576bf4234cd6f322e93a0e26b82479bf96b569e4-leaflet.min.js";

// src/DurableObjects.json
var DurableObjects_default = { LAX: true, EWR: true, SJC: true, MXP: true, WAW: true, BNE: true, KIX: true, HKG: true, HAM: true, MRS: true, TPE: true, MIA: true, NRT: true, IAD: true, FRA: true, CDG: true, VIE: true, SEA: true, LHR: true, SYD: true, MAD: true, AKL: true, AMS: true, ARN: true, MEL: true, SIN: true, ORD: true, DFW: true, PRG: true, ATL: true };

// src/index.ts
globalThis.durableObjects = JSON.stringify(DurableObjects_default);
var src_default = {
  async fetch(req, env, ctx) {
    if (req.method != "GET")
      return new Response("", { status: 405 });
    var newUrl = new URL(req.url);
    if (newUrl.pathname == "/") {
      return new Response(HTML.replaceAll("{{PLSINJECTUSRCOLOCLOUDFLAREOK}}", req.cf?.colo).replaceAll("{{PLSINJECTUSRLAT}}", req.cf?.latitude ?? 0).replaceAll("{{PLSINJECTUSRLONG}}", req.cf?.longitude ?? 0).replaceAll("{{INJECTDURABLEOBJECTSDATA}}", globalThis.durableObjects), { status: 200, headers: { "content-type": "text/html" } });
    }
    if (newUrl.pathname == "/map.pmtiles") {
      return fetch("https://map.cloudflare.chaika.me/map.pmtiles", req);
    }
    if (newUrl.pathname == "/leaflet.min.css") {
      return new Response(LEAFLETMINCSS, { headers: { "content-type": "text/css" } });
    }
    if (newUrl.pathname == "/protomaps-leaflet.js") {
      return new Response(PROTOMAPSJS, { headers: { "content-type": "text/javascript" } });
    }
    if (newUrl.pathname == "/leaflet.min.js") {
      return new Response(LEAFLETMINJS, { headers: { "content-type": "text/javascript" } });
    }
    return new Response("404", { status: 404 });
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
