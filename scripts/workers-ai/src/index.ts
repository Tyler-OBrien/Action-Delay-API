export interface Env {
	APIKEY: string;
	AI: Ai
}

var handler = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		var url = new URL(request.url);
		if (request.headers.get("APIKEY") !== env.APIKEY) {
			console.log("Unauthorized")
			return new Response("Unauthorized", { status: 401 });
		}
		if (url.pathname == "/") {
			return new Response("yum, connection warmed");
		}
		if (request.headers.has("model") == false) {
			return new Response("no model specified :(", { status: 404 });
		}
		var modelToUse = request.headers.get("model");
		if (request.headers.has("input") == false) {
			return new Response("no input specified :(", { status: 404 });
		}
		var inputType = request.headers.get("input");
		if (request.headers.has("inputField") == false) {
			return new Response("no inputField specified :(", { status: 404 });
		}
		var inputField = request.headers.get("inputField") as string;

		if (request.headers.has("outputType") == false) {
			return new Response("no outputType specified :(", { status: 404 });
		}
		var outputType = request.headers.get("outputType") as string;

		var outputContentType = request.headers.get("outputContentType") as string;

		var maxTokens = request.headers.get("maxTokens") as string;


		var inputObj: object = {}

		switch (inputType?.toLowerCase()) {
			case "text":
				var setVal = await request.text();
				inputObj[inputField] = setVal;
				break;
			case "uint8array":
				inputObj[inputField] = [...new Uint8Array(await request.arrayBuffer())];
				break;
			case "raw":
				var input = await request.json();
				for (const [key, value] of Object.entries(input)) {
					if (value.toString().startsWith("$base64touint8array")) {
						input[key] = [...base64ToUint8Array(value)]
					}
				}
				inputObj = input;
				break;
		}

		if (maxTokens) {
			var tryParse = Number.parseInt(maxTokens);
			if (Number.isNaN(tryParse) == false && tryParse > 0) {
				inputObj["max_tokens"] = tryParse;
			}
		}

		if (outputType.toLowerCase() === "buffereventstream") {
			inputObj["stream"] = true;
		}
		const start: number = performance.now();
		try {
			const response = await env.AI.run(modelToUse, inputObj);
			if (outputType.toUpperCase() === "JSON") {
				var getRateLimitingMessage = checkForRateLimitMessage(response); // some models do this
				if (getRateLimitingMessage != null) {
					return new Response(JSON.stringify({
						success: false,
						error: {
							code: "Custom RL",
							message: `RL Response: ${getRateLimitingMessage}`,
							logs: JSON.stringify(env.AI.getLogs())
						}
					}), { status: 200 });
				}
				var resp = JSON.stringify({
					success: true,
					result: response
				});
				return new Response(resp);
			}
			else if (outputType.toUpperCase() === "RAW") {
				return new Response(response, {
					headers: {
						"content-type": outputContentType ?? "text/event-stream",
					},
				});
			}
			else if (outputType.toLowerCase() === "buffereventstream") {
				var result = await processLineByLine(response);
				var resultString = ""
				for (const key of result) {
					resultString += key.token;
				}
				if (resultString.toLowerCase().includes("too many requests in") || resultString.toLowerCase().includes("try again later")) { // some models do this
					return new Response(JSON.stringify({
						success: false,
						error: {
							code: "Custom RL Stream",
							message: `RL Response: ${resultString}`,
							logs: JSON.stringify(env.AI.getLogs())
						}
					}), { status: 200 });
				}
				return new Response(JSON.stringify({
					success: true,
					result: { response: resultString },
					tokens: result.length
				}));
			}
			else {
				var tryGetSize = await getReadableStreamSizeAndCheckIfEmpty(response)
				if (tryGetSize === 0) {
					return new Response(JSON.stringify({
						success: false,
						error: {
							code: 'EmptyStreamResponse',
							message: 'Empty Stream Response, length 0',
							logs: JSON.stringify(env.AI.getLogs())
						}
					}), { status: 200 });
				}
				return new Response(JSON.stringify({
					success: true,
					result: {
						length: tryGetSize
					}
				}));
			}
		} catch (error:any) {
			console.log(`We think this request for ${modelToUse} took ${performance.now() - start}`)
			console.log(JSON.stringify(env.AI))
			console.log(JSON.stringify(error))
			console.log(error.message)
			return new Response(JSON.stringify({
				success: false,
				error: {
					code: error.name ?? 'Unknown',
					message: error.message ?? error.toString(),
					logs: JSON.stringify(env.AI.getLogs())
				}
			}), { status: 200 });
		}
		return new Response("Unknown Internal Error", { status: 504 });
	},
};

function checkForRateLimitMessage(obj: any) {
	for (const key in obj) {
	  const value = obj[key];
	  if (typeof value === "string") {
		if (value.toLowerCase().includes("too many requests in") || value.toLowerCase().includes("try again later")) {
		  console.log(`"${key}" contains a rate limit message: "${value}"`);
		  return value;
		}
	  }
	}
	return null;
}

function base64ToUint8Array(base64: string) {
	const base64WithoutPrefix = base64.replace("$base64touint8array:", "");
	const binary_string = atob(base64WithoutPrefix);
	const len = binary_string.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes;
}

async function processLineByLine(readableStream: ReadableStream) {
	let decoder = new TextDecoder('utf-8');
	let reader = readableStream.getReader();
	let { done, value } = await reader.read();
	let line = '';
	var output = [];
	var start = Date.now()
	while (!done) {
		let segment = decoder.decode(value);

		for (let character of segment) {
			if (character === '\n' && line.length > 0) {
				if (line.endsWith("[DONE]")) {
					done = true;
					break;
				}
				var findPosition = line.indexOf("{");
				var findLastPosition = line.indexOf("}");
				if (findLastPosition == -1 || findLastPosition == -1) {
					console.log(`Failed to parse json out of ${line}, got first pos ${findPosition}, last ${findLastPosition}`)
					break;
				}
				var jsonString = line.substring(findPosition, findLastPosition + 1);
				try {
					var parsedData = JSON.parse(jsonString);
					if (parsedData.response == null) {
						console.log(`Failed to parse ${jsonString} out of ${line}, nothing in response ${parsedData}`)
					}
					output.push({
						token: parsedData.response,
						delay: Date.now() - start,
					})
				}
				catch (error) {
					console.error(error)
					console.log(`Failed to parse ${jsonString} out of ${line}, error: ${error}`)
				}

				line = '';
			} else {
				line += character;
			}
		}

		let result = await reader.read();
		done = result.done;
		value = result.value;
	}
	return output;
}

async function getReadableStreamSizeAndCheckIfEmpty(stream) {
	// Get a lock on the stream:
	const reader = stream.getReader();

	let length = 0;
	while (true) {
		const { done, value } = await reader.read();

		// When no more data needs to be consumed, break out of the loop.
		if (done) {
			break;
		}

		if (!value) {
			//No data read from the stream
			continue;
		}

		// If there is data, update length
		length += value.length;
	}

	// Close the stream
	reader.releaseLock();

	return length;
}
export default handler;