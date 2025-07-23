import { WorkerEntrypoint } from 'cloudflare:workers';

export interface Env {
	QUEUE: Queue;
	SECRET_API_TOKEN: string;
	SECRET_INGEST_URL: string;
	SECRET_HTTP_INGEST: string;
}
export interface Input {
	InputType: string;
	Data: any;
}

export default class extends WorkerEntrypoint<Env> {
	async fetch(request: Request): Promise<Response> {
		var tryGetAPIKEY = request.headers.get('APIKEY');
		if (!tryGetAPIKEY || tryGetAPIKEY !== this.env.SECRET_HTTP_INGEST) {
			return new Response('', { status: 403 });
		}
		if (request.method != 'POST') {
			return new Response('', { status: 405 });
		}
		if (request.body == null) {
			return new Response('', { status: 400 });
		}
		var contentType = request.headers.get('Content-Type');
		if (!contentType || contentType !== 'application/json') {
			return new Response('Not JSON?', { status: 415 });
		}
		let incomingBody: Input[] | null = null;
		try {
			incomingBody = await request.json();
		} catch (exception) {
			console.error(exception);
			return new Response('Failure parsing JSON', { status: 400 });
		}
		var tryValidate = validateInput(incomingBody);
		if (!tryValidate.isValid) {
			return new Response('Invalid input: ' + tryValidate.message, { status: 422 });
		}
		var perf = performance.now();
		try {
			const batch: MessageSendRequest[] = incomingBody!.map((value) => ({
				body: value,
			}));
			await this.env.QUEUE.sendBatch(batch);
		} catch (exception) {
			console.error(exception);
			return new Response('Failure Sending to queue', { status: 500 });
		}
		console.log(`Ingested ${incomingBody!.length} to Queue, took ${performance.now() - perf}ms`);
		return new Response('', { status: 202 });
	}
	async queueDataPointAsync(data: Object, type: string) {
		await this.env.QUEUE.send({
			InputType: type,
			Data: data,
		});
	}
	queueDataPoint(data: Object, type: string): void {
		this.ctx.waitUntil(internalQueueDataPoint(data, type, this.env));
	}
	queueDataPoints(dataPoints: Input[]): void {
		this.ctx.waitUntil(internalQueueDataPoints(dataPoints, this.env));
	}
	async queueDataPointsAsync(dataPoints: Input[]): Promise<boolean> {
		await internalQueueDataPoints(dataPoints, this.env);
		return true;
	}

	async ingestDataPointsDirect(dataPoints: Input[]): Promise<boolean> {
		await ingestDataPointsDirect(dataPoints, this.env);
		return true;
	}
	async queue(batch: MessageBatch<unknown>): Promise<void> {
		try {
			var perf = performance.now();
			let data = batch.messages.map((msg) => msg.body);
			let count = 0;
			for (const element of data) {
				if (element.InputType == "websocket_monitoring") {
					if (element.Data.timestamp)
					{
						element.Data.timestamp = new Date(element.Data.timestamp)
						count++;
					}
				}
			}
			if (count > 0) 
				console.log(`Patched ${count} websocket monitoring timestamps`)
			var response = await fetch(this.env.SECRET_INGEST_URL, {
				body: JSON.stringify({ Data: data }),
				headers: {
					APIKEY: this.env.SECRET_API_TOKEN,
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
			if (!response.ok) {
				let tryGetBodyResp = '';
				try {
					if (response.body) tryGetBodyResp = await response.text();
				} catch (_) {
					/* nom */
				}

				throw new Error(`API returned ${response.status} ${tryGetBodyResp}, retrying later...`);
			}
			console.log(`Flushed ${batch.messages.length} to API, took ${performance.now() - perf}ms`);
			batch.ackAll();
		} catch (exception) {
			console.error(exception);
			console.log(`exception in handling batch, retrying later...`);
			let maxRetryCount = 0;
			for (const msg of batch.messages) {
				if (msg.attempts > maxRetryCount) maxRetryCount = msg.attempts;
			}
			batch.retryAll({ delaySeconds: calculateBackoff(maxRetryCount) });
		}
	}
}

function calculateBackoff(attempts: number): number {
	return 10 * attempts;
}

function validateInput(input: any) {
	if (!input || !Array.isArray(input)) {
		return { isValid: false, message: 'Input must be an array.' };
	}

	for (let i = 0; i < input.length; i++) {
		const item = input[i];

		if (typeof item !== 'object' || item === null) {
			return { isValid: false, message: `Item at index ${i} is not a valid object.` };
		}

		const keys = Object.keys(item);
		if (keys.length !== 2) {
			return { isValid: false, message: `Item at index ${i} has an incorrect number of properties (should be 2).` };
		}

		if (!keys.includes('InputType') || !keys.includes('Data')) {
			return { isValid: false, message: `Item at index ${i} must only contain 'InputType' and 'Data' properties.` };
		}

		if (typeof item.InputType !== 'string') {
			return { isValid: false, message: `Item at index ${i}: 'InputType' must be a string.` };
		}

		if (typeof item.Data !== 'object' || item.Data === null || Array.isArray(item.Data)) {
			return { isValid: false, message: `Item at index ${i}: 'Data' must be a non-null object (and not an array).` };
		}
	}

	return { isValid: true };
}


async function internalQueueDataPoints(dataPoints: Input[], env: Env) {
	for (let index = 0; index < 5; index++) {
		try {

			const batch: MessageSendRequest[] = dataPoints!.map((value) => ({
				body: value,
			}));
			await env.QUEUE.sendBatch(batch);
			return;
		} catch (ex: any) {
			console.log(`Error logging data points, error: ${ex.toString()}, retrying... attempt ${index}`);
			console.error(ex);
			await new Promise((r) => setTimeout(r, 200 * index));
		}
	}
}


async function ingestDataPointsDirect(dataPoints: Input[], env: Env) {
	for (let index = 0; index < 5; index++) {
		try {

			var perf = performance.now();
			var response = await fetch(env.SECRET_INGEST_URL, {
				body: JSON.stringify({ Data: dataPoints }),
				headers: {
					APIKEY: env.SECRET_API_TOKEN,
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
			if (!response.ok) {
				let tryGetBodyResp = '';
				try {
					if (response.body) tryGetBodyResp = await response.text();
				} catch (_) {
					/* nom */
				}

				throw new Error(`API returned ${response.status} ${tryGetBodyResp}, retrying later...`);
			}
			console.log(`Flushed ${dataPoints.length} to API, took ${performance.now() - perf}ms`);
			return;
		} catch (ex: any) {
			console.log(`Error ingesting data points, error: ${ex.toString()}, retrying... attempt ${index}`);
			console.error(ex);
			await new Promise((r) => setTimeout(r, 1000 * index));
		}
	}
}




async function internalQueueDataPoint(data: Object, type: string, env: Env) {
	for (let index = 0; index < 5; index++) {
		try {
			await env.QUEUE.send({
				InputType: type,
				Data: data,
			});
			return;
		} catch (ex) {
			console.log(`Error logging data point for ${type}, error: ${ex.toString()}, retrying... attempt ${index}`);
			console.error(ex);
			await new Promise((r) => setTimeout(r, 200 * index));
		}
	}
}
