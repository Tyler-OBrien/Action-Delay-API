import HTML from "./index.html";
import LEAFLETMINCSS from "./leaflet.min.css";
import PROTOMAPSJS from "./protomaps-leaflet.js"
import LEAFLETMINJS from "./leaflet.min.js"

export interface Env {
}
export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (req.method != "GET")
			return new Response("", { status: 405 })
		
		var newUrl = new URL(req.url);
		
		if (newUrl.pathname == "/")
		{
		return new Response(HTML, { status: 200, headers: { "content-type": "text/html"}});
		}
		if (newUrl.pathname  == "/map.pmtiles") {

			return fetch("https://map.cloudflare.chaika.me/map.pmtiles", req)
		}
		if (newUrl.pathname  == "/leaflet.min.css") {
			return new Response(LEAFLETMINCSS, { headers: { "content-type": "text/css"}})
		}
		if (newUrl.pathname  == "/protomaps-leaflet.js") {
			return new Response(PROTOMAPSJS, { headers: { "content-type": "text/javascript"}})
		}
		if (newUrl.pathname  == "/leaflet.min.js") {
			return new Response(LEAFLETMINJS, { headers: { "content-type": "text/javascript"}})
		}
		return new Response('404', {status: 404})
	},
};
