export interface Env {
	BATCHER: DurableObjectNamespace;
	APIKEY: string;


	EdgeIngestRate: AnalyticsEngineDataset;
	DB: D1Database;
	DB2: D1Database;

  }


export default {
	async fetch(request: Request, env: Env) {


		var url = new URL(request.url);
		if (request.headers.get("Authorization") !== env.APIKEY && url.searchParams.get("header_Authorization") !== env.APIKEY) {
			console.log("Unauthorized")
		  return new Response("Unauthorized", { status: 401 });
		}
		if (!request.body) {
			console.log("No Body")
		  return new Response("No Body", { status: 500 });
		}
		const events = request.body
		  .pipeThrough(new DecompressionStream("gzip"))
		  .pipeThrough(new TextDecoderStream())
		  .pipeThrough(readlineStream());
	
		let eventsToPush: string[] = [];
		for await (const event of streamAsyncIterator(events)) {
		  // Do stuff with the event
		  var parsedEvent = JSON.parse(event);
		  // Trying to support most types. Most logpush events just have "Timestamp". Workers Logpush has "EventTimestampMs". HTTP has "EdgeStartTimestamp". Access Requests use CreatedAt. ZT Gateway Events use Datetime.
		  parsedEvent["_time"] =
			parsedEvent.EventTimestampMs ??
			parsedEvent.Timestamp ??
			parsedEvent.EdgeStartTimestamp ??
			parsedEvent.CreatedAt ??
			parsedEvent.Datetime;
		  eventsToPush.push(parsedEvent);
		}

		var DOIdName: string  = 'global';
		/*
		
		var DOIdName: string = regions?.results[request.cf?.colo ?? ""] ?? "global";
    // just flattening regions down to 3
    if (DOIdName == "wnam") {
      DOIdName = "enam";
    }
    if (DOIdName == "eeur") {
      DOIdName = "weur";
    }
	*/
		console.log(`[${DOIdName}] Pushing ${eventsToPush.length} items.. to batcher`);
	  let id = env.BATCHER.idFromName(DOIdName);
	  return await env.BATCHER.get(id).fetch(request, {
		body: JSON.stringify(eventsToPush)
	  });
	},
  };
  
  const SECONDS = 1000;
    const countKey = 'count';
  export class Batcher {


	queue: object[];
	storage: DurableObjectStorage;
	state: DurableObjectState;
	env: Env

	ID: string;


	constructor(state: DurableObjectState, env: Env) {
	  this.state = state;
	  this.storage = state.storage;
	  this.queue = [];
	  this.env = env;
	  this.ID = "unk";
	}
	async fetch(request: Request) {

		this.ID = 'global';
  /*
    this.ID = regions?.results[request.cf?.colo ?? ""] ?? "global";
    // just flattening regions down to 3
    if (this.ID  == "wnam") {
      this.ID  = "enam";
    }
    if (this.ID  == "eeur") {
      this.ID  = "weur";
    }
	*/
	  // If there is no alarm currently set, set one for 10 seconds from now
	  // Any further POSTs in the next 10 seconds will be part of this kh.
	  let currentAlarm = await this.storage.getAlarm();
	  if (currentAlarm == null) {
      // you may want to adjust the alarm
	  var alarmDate = Date.now() + 10 * SECONDS;
      this.storage.setAlarm(alarmDate);
	  console.log(`[${this.ID}] Set Alarm for ${alarmDate}`)
	  }
  
	  // Add the request to the batch.
	  // json array
	  var arrayItems = await request.json() as object[];
	  //console.log(`Adding ${arrayItems.length} items to queue..`)
	  this.queue.push(...arrayItems);
	  var currentCount: number = (await this.storage.get(countKey)) ?? 0;
	  await this.storage.put(countKey, currentCount += arrayItems.length);
	  if (this.queue.length > 1000) {
		  await this.alarm();
	  }

	  return new Response(JSON.stringify({ queued: this.queue.length }), {
		headers: {
		  "content-type": "application/json;charset=UTF-8",
		},
	  });
	}
	async alarm() {
		var currentCount: number = (await this.storage.get(countKey)) ?? 0;
		await this.storage.put(countKey, 0);
		if (this.queue.length == 0 ) {
			console.log(`[${this.ID}] No items to push, returning. We thought there would be ${currentCount}`)
			return;
		}
	
	  try {
		if (this.env.EdgeIngestRate) {
		  this.env.EdgeIngestRate.writeDataPoint({
			blobs: [
			  this.ID,
			  "HTTP"
			],
			doubles: [this.queue.length, currentCount],
			indexes: [this.ID],
		  });
		}
	  } catch (exception) {
		console.error(
		  `[${this.ID}] Error ingesting Analytics Engine events into ${this.ID}, HTTP: ${exception}`
		);
	  }
	  console.log(`[${this.ID}] Alarm! Pushing ${this.queue.length} items.. we thought there would be ${currentCount}`)

	  this.state.waitUntil(handleHTTPEvents(this.env, this.queue));


	  this.queue = [];
	}
  }

  async function /* `handleHTTPEvents` is a function that takes in an `Env` object and an array of
  `httpEvents`. It filters the `httpEvents` array to remove duplicates based on the
  `EdgeColoID` and `ResponseHeaders.metal` properties. It then creates a SQL query
  string using the filtered events and inserts them into a  database using the
  `machines` table. If there are any errors during the process, they are logged to the
  console. */
  handleHTTPEvents(env: Env, httpEvents: any): Promise<void> {
  
    const uniqueEvents: any = {};
    const uniqueUpperTierColos: any = {};
    const uniqueSmartRoutingColos: any = {};
    const uniqueEventsArray: object[] = [];
  
    // Remove duplicates and prepare query values
    httpEvents.forEach((event: any) => {
      const key = `${event.EdgeColoID}-${event.ResponseHeaders.metal}`
      if (event.UpperTierColoID != 0 && event.UpperTierColoID.length != 0 && !uniqueUpperTierColos[event.UpperTierColoID])
      uniqueUpperTierColos[event.UpperTierColoID] = true;
  
      if (event.SmartRouteColoID != 0 && event.SmartRouteColoID.length != 0 && !uniqueSmartRoutingColos[event.SmartRouteColoID])
      uniqueSmartRoutingColos[event.SmartRouteColoID] = true;
  
      if (
        !uniqueEvents[key] &&
        Number.isInteger(event.EdgeColoID) &&
        !isNaN(parseInt(event.ResponseHeaders.metal))
      ) {
        uniqueEvents[key] = true;
        uniqueEventsArray.push(event);
      }
    });
  
    var sqlCount = uniqueEventsArray.length;
  
    console.log(
      `We have ${sqlCount} unique events to insert into the database, and ${httpEvents.length} total events.`
    );
  
    try {
  
      const sqlite = `INSERT INTO machines (coloId, machineId, dateFound, lastUpdated) VALUES (?1, ?2, datetime('now'), datetime('now'))  ON CONFLICT (coloId, machineId) DO UPDATE SET lastUpdated = datetime('now');`;
  
  
      const sqlite2 = `INSERT INTO colos (coloId, coloName)
      VALUES (
        ?1,
        ?2
      )
      ON CONFLICT (coloId) DO UPDATE SET
        coloName = ?2,
        smartRoutingColo = CASE WHEN colos.smartRoutingColo = 1 THEN 1 ELSE ?3 END,
        upperTierColo = CASE WHEN colos.upperTierColo = 1 THEN 1 ELSE ?4 END;`
      try {
        var requestStartTime = Date.now();
      
        var preparedStmt2 = env.DB2.prepare(sqlite);
        var db2result = await env.DB2.batch(uniqueEventsArray.map((event: any) =>  preparedStmt2.bind(event.EdgeColoID, parseInt(event.ResponseHeaders.metal))));
        console.log(`DB2 SQLITE  Execute:  count: ${db2result.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${db2result.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
        var requestStartTime = Date.now();
        var preparedStmt2colos = env.DB2.prepare(sqlite2);
        var db2resultcolos = await env.DB2.batch(uniqueEventsArray.filter((event: any) => event.EdgeColoCode && event.EdgeColoCode.length != 0).map((event: any) =>  preparedStmt2colos.bind(event.EdgeColoID, event.EdgeColoCode, uniqueSmartRoutingColos[event.EdgeColoID] ? 1 : 0, uniqueUpperTierColos[event.EdgeColoID] ? 1 : 0)));
        console.log(`DB2 SQLITE Colos  Execute:  count: ${db2resultcolos.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${db2resultcolos.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
      } catch (error: any) {
        console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
      }
      try {
        var requestStartTime = Date.now();
        var preparedStmt = env.DB.prepare(sqlite);
        var dbresult = await env.DB.batch(uniqueEventsArray.map((event: any) =>  preparedStmt.bind(event.EdgeColoID, parseInt(event.ResponseHeaders.metal))));
        console.log(`DB SQLITE  Execute:  count: ${dbresult.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${dbresult.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
        var requestStartTime = Date.now();
        var preparedStmtcolos = env.DB.prepare(sqlite2);
        var dbresultcolos = await env.DB.batch(uniqueEventsArray.filter((event: any) => event.EdgeColoCode && event.EdgeColoCode.length != 0).map((event: any) =>  preparedStmtcolos.bind(event.EdgeColoID, event.EdgeColoCode, uniqueSmartRoutingColos[event.EdgeColoID] ? 1 : 0, uniqueUpperTierColos[event.EdgeColoID] ? 1 : 0)));
        console.log(`DB SQLITE Colos  Execute:  count: ${dbresultcolos.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${dbresultcolos.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
  
      } catch (error: any) {
        console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
      }
    } catch (error: any) {
      console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
    }
    return;
  }
  
  

  async function* streamAsyncIterator(stream: ReadableStream) {
	// Get a lock on the stream
	const reader = stream.getReader();
  
	try {
	  while (true) {
		// Read from the stream
		const { done, value } = await reader.read();
  
		// Exit if we're done
		if (done) {
		  return;
		}
  
		// Else yield the chunk
		yield value;
	  }
	} finally {
	  reader.releaseLock();
	}
  }
  
  interface ReadlineTransformerOptions {
	skipEmpty: boolean;
  }
  
  const defaultOptions: ReadlineTransformerOptions = {
	skipEmpty: true,
  };
  
  export class ReadlineTransformer implements Transformer {
	options: ReadlineTransformerOptions;
	lastString: string;
	separator: RegExp;
  
	public constructor(options?: ReadlineTransformerOptions) {
	  this.options = { ...defaultOptions, ...options };
	  this.lastString = "";
	  this.separator = /[\r\n]+/;
	}
  
	public transform(
	  chunk: string,
	  controller: TransformStreamDefaultController<string>
	) {
	  // prepend with previous string (empty if none)
	  const str = `${this.lastString}${chunk}`;
	  // Extract lines from chunk
	  const lines = str.split(this.separator);
	  // Save last line as it might be incomplete
	  this.lastString = (lines.pop() || "").trim();
  
	  // eslint-disable-next-line no-restricted-syntax
	  for (const line of lines) {
		const d = this.options.skipEmpty ? line.trim() : line;
		if (d.length > 0) controller.enqueue(d);
	  }
	}
  
	public flush(controller: TransformStreamDefaultController<string>) {
	  if (this.lastString.length > 0) controller.enqueue(this.lastString);
	}
  }
  
  export const readlineStream = () =>
	new TransformStream(new ReadlineTransformer());