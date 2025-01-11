// Decompression logpush Credit to https://gist.github.com/stefandanaita/88c4d8b187400d5b07524cd0a12843b2
// SPDX-License-Identifier: MIT-0

export interface Env {
  AuthSecret: string;
  LogPushSecret: string;
  Dataset: string;
  IngestRateBunnyLogs: AnalyticsEngineDataset;
  DB: D1Database;
  DB2: D1Database;
}
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    var timeStart = new Date();
    var url = new URL(request.url);
    if (url.pathname == "/data") {
      var newUrlMatch = `https://${url.hostname}/data`;
      var tryMatch = await caches.default.match(newUrlMatch);
      if (tryMatch != null) return tryMatch;

      var getColos = await env.DB.prepare(
        "SELECT   coloId,   MAX(lastUpdated) as latestUpdate,   MIN(dateFound) as dateFound,   COUNT(*) as activeMachinesCount FROM machines WHERE lastUpdated >= date('now', '-14 day') GROUP BY coloId"
      ).all();
      var coloInfo = getColos.results;

      var getMachines = await env.DB.prepare(
        "Select * from machines  WHERE lastUpdated >= date('now', '-14 day')"
      ).all();

      for (var i = 0; i < coloInfo.length; i++) {
        coloInfo[i].machines = getMachines.results
          .filter((machine: any) => machine.coloId == coloInfo[i].coloId)
          .map((machine: any) => ({
            serverId: machine.serverId,
            lastUpdated: machine.lastUpdated,
            dateFound: machine.dateFound,
          }));
      }

      var newResponse = new Response(JSON.stringify(coloInfo), { status: 200 });
      newResponse.headers.append(
        "Cache-Control",
        "public, max-age=600, immutable"
      );
      ctx.waitUntil(caches.default.put(newUrlMatch, newResponse.clone()));
      return newResponse;
    }
    if (url.pathname == "/colos") {
      var newUrlMatch = `https://${url.hostname}/colos`;
      var tryMatch = await caches.default.match(newUrlMatch);
      if (tryMatch != null) return tryMatch;

      var getColos = await env.DB.prepare(
        "SELECT   coloId,   MAX(lastUpdated) as latestUpdate,   MIN(dateFound) as dateFound,   COUNT(*) as activeMachinesCount FROM machines WHERE lastUpdated >= date('now', '-14 day') GROUP BY coloId"
      ).all();
      var coloInfo = getColos.results;
      var newResponse = new Response(JSON.stringify(coloInfo), { status: 200 });
      newResponse.headers.append(
        "Cache-Control",
        "public, max-age=600, immutable"
      );
      ctx.waitUntil(caches.default.put(newUrlMatch, newResponse.clone()));
      return newResponse;
    }
    if (url.pathname == "/colonames") {
      var newUrlMatch = `https://${url.hostname}/colonames`;
      var tryMatch = await caches.default.match(newUrlMatch);
      if (tryMatch != null) return tryMatch;

      var getColos = await env.DB.prepare(
        "SELECT coloId as ID, coloName as IATA, upperTierColo as CacheFillColo, region as cfRegion, friendlyLocation as niceName, Country as country from colos order by coloId asc;"
      ).all();
      var coloInfo = getColos.results;
      var newResponse = new Response(JSON.stringify(coloInfo), { status: 200 });
      newResponse.headers.append(
        "Cache-Control",
        "public, max-age=600, immutable"
      );
      ctx.waitUntil(caches.default.put(newUrlMatch, newResponse.clone()));
      return newResponse;
    }
    /*
    if (url.pathname == "/count") {
      var tryMatch = await caches.default.match(request);
      if (tryMatch != null) return tryMatch;
      var newResponse = new Response(
        JSON.stringify(
          await env.DB.prepare(
            "Select COUNT(*) from machines where coloId = ? and lastUpdated >= datetime('now','-14 day')"
          )
            .bind(url.searchParams.get("colo"))
            .all()
        ),
        { status: 200 }
      );
      newResponse.headers.append(
        "Cache-Control",
        "public, max-age=600, immutable"
      );
      ctx.waitUntil(caches.default.put(request, newResponse.clone()));
      return newResponse;
    }
    if (url.pathname == "/machines") {
      var tryMatch = await caches.default.match(request);
      if (tryMatch != null) return tryMatch;
      var newResponse = new Response(
        JSON.stringify(
          (
            await env.DB.prepare(
              "Select * from machines where coloId = ? and lastUpdated >= date('now', '-14 day');"
            )
              .bind(url.searchParams.get("colo"))
              .all()
          ).results
        ),
        { status: 200 }
      );
      newResponse.headers.append(
        "Cache-Control",
        "public, max-age=600, immutable"
      );
      ctx.waitUntil(caches.default.put(request, newResponse.clone()));
      return newResponse;
    }
    */
    if (request.headers.get("Authorization") !== env.LogPushSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!request.body) {
      return new Response("No Body", { status: 500 });
    }
    const internalType = request.headers.get("internal-type") ?? "http"; // If you are pushing more then one logpush datasets into the same Axiom dataset, you can use this to differentiate them.
    const zone = request.headers.get("requestZone") ?? "all"; // If you are pushing more then one logpush datasets into the same Axiom dataset, you can use this to differentiate them.
    
    
    const events = request.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(readlineStream());
      

    let eventsToPush: string[] = [];
    for await (const eventTxt of streamAsyncIterator(events)) {
      try {
        // Do stuff with the event
       var event = JSON.parse(eventTxt.replaceAll("\\\\", "\\").replaceAll(",,", ",").replaceAll(`""`, `"`))

       try {
        var cleanerEvent = (event.message.replaceAll(",,", ",")).replaceAll(`""`, `"`).replaceAll("\"\"", `"`).replace(`""`, `"`).trim();
      var parsedEvent = JSON.parse(cleanerEvent);
       }
       catch (exception) {
        console.log(exception)
        console.log(`Cannot inner event parse:`)
        console.log(cleanerEvent)
        continue;
       }
      // Trying to support most types. Most logpush events just have "Timestamp". Workers Logpush has "EventTimestampMs". HTTP has "Timestamp". Access Requests use CreatedAt. ZT Gateway Events use Datetime.
      parsedEvent["_time"] =
        parsedEvent.Timestamp;


  
      parsedEvent["timeReceived"] = new Date(event.timestamp).toISOString();
      parsedEvent["source"] = "LogPush";

      // faking for now..
      parsedEvent.UpperTierColoID  = 0;
      parsedEvent.SmartRouteColoID  = 0;

      try {

        var parsedTimestamp = new Date(parsedEvent["timeReceived"]);
        // syslog received time minus event, notably not time this worker is recieving since we buffer inside of Vector
        parsedEvent["eventDelay"] = (timeStart.getTime() - parsedTimestamp.getTime());
      } catch (error: any) {
        console.log(`Error parsing EndEdgeTimestamp: ${error}, ${error?.cause}`);
      }
      
      eventsToPush.push(parsedEvent);
    }
    catch (exception) {
      console.log(exception)
      console.log(`Cannot parse: ${eventTxt}`)
    }
    }
    let dataset = url.pathname.substring(1);
    /*
    if (env.AuthSecret) {
      let json = JSON.stringify(eventsToPush);
      var response = await fetch(
        `https://api.axiom.co/v1/datasets/${dataset}/ingest`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.AuthSecret}`,
          },
          body: json,
        }
      );
      if (response.ok == false) {
        return new Response(`Axiom responded with: ${await response.text()}`, {
          status: 500,
        });
      }
      console.log(
        `Ingested ${eventsToPush.length} events into ${dataset} : ${internalType}`
      );
    }
      */
    try {
      if (env.IngestRateBunnyLogs) {
        env.IngestRateBunnyLogs.writeDataPoint({
          blobs: [dataset, internalType],
          doubles: [eventsToPush.length],
          indexes: [dataset],
        });
        console.log(`Pushed stats to Analytics Engine, ${eventsToPush.length} events of dataset ${dataset}, internalType ${internalType}`)
      }
    } catch (exception) {
      console.error(
        `Error ingesting Analytics Engine events into ${dataset}, ${internalType}: ${exception}`
      );
    }
    ctx.waitUntil(handleHTTPEvents(env, eventsToPush, ctx, zone));

    return new Response("Nom nom!", { status: 202 });
  },
};

async function /* `handleHTTPEvents` is a function that takes in an `Env` object and an array of
`httpEvents`. It filters the `httpEvents` array to remove duplicates based on the
`ServerZone` and `ServerId` properties. It then creates a SQL query
string using the filtered events and inserts them into a  database using the
`machines` table. If there are any errors during the process, they are logged to the
console. */
  handleHTTPEvents(env: Env, httpEvents: any, ctx: ExecutionContext, zone: string): Promise<void> {

  const uniqueEvents: any = {};
  const uniqueUpperTierColos: any = {};
  const uniqueSmartRoutingColos: any = {};
  const uniqueEventsArray: object[] = [];
  var lastEventDate: Date = new Date(0);
  var oldestEventDate: Date = new Date();

  // Remove duplicates and prepare query values
  httpEvents.forEach((event: any) => {
    const key = `${event.ServerZone}-${event.ServerId}`
    if (event.UpperTierColoID != 0 && event.UpperTierColoID.length != 0 && !uniqueUpperTierColos[event.UpperTierColoID])
      uniqueUpperTierColos[event.UpperTierColoID] = true;

    if (event.SmartRouteColoID != 0 && event.SmartRouteColoID.length != 0 && !uniqueSmartRoutingColos[event.SmartRouteColoID])
      uniqueSmartRoutingColos[event.SmartRouteColoID] = true;

    if (
      !uniqueEvents[key] &&
      (event.ServerZone.length > 0) &&
      !isNaN(parseInt(event.ServerId))
    ) {
      uniqueEvents[key] = true;
      uniqueEventsArray.push(event);
    }
    try {
      var endEdgeTimestamp = event.Timestamp != null ? new Date(event.Timestamp) : new Date(event.Timestamp);
      if (endEdgeTimestamp > lastEventDate)
        lastEventDate = endEdgeTimestamp;
      if (endEdgeTimestamp < oldestEventDate)
        oldestEventDate = endEdgeTimestamp;
    } catch (error: any) {
      console.log(`Error parsing EndEdgeTimestamp: ${error}, ${error?.cause}`);
    }
  });

  var sqlCount = uniqueEventsArray.length;

  console.log(
    `We have ${sqlCount} unique events to insert into the database, and ${httpEvents.length} total events.`
  );

  try {

    const sqlite = `INSERT INTO machines (coloId, serverId, dateFound, lastUpdated) VALUES (?1, ?2, datetime('now'), datetime('now'))  ON CONFLICT (coloId, serverId) DO UPDATE SET lastUpdated = datetime('now');`;


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
      var db2result = await env.DB2.batch(uniqueEventsArray.map((event: any) => preparedStmt2.bind(event.ServerZone, parseInt(event.ServerId))));
      console.log(`DB2 SQLITE  Execute:  count: ${db2result.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${db2result.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
      var requestStartTime = Date.now();
      var preparedStmt2colos = env.DB2.prepare(sqlite2);
      var db2resultcolos = await env.DB2.batch(uniqueEventsArray.filter((event: any) => event.ServerZone && event.ServerZone.length != 0).map((event: any) => preparedStmt2colos.bind(event.ServerZone, event.ServerZone, uniqueSmartRoutingColos[event.ServerZone] ? 1 : 0, uniqueUpperTierColos[event.ServerZone] ? 1 : 0)));
      console.log(`DB2 SQLITE Colos  Execute:  count: ${db2resultcolos.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${db2resultcolos.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
    } catch (error: any) {
      console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
    }
    try {
      var requestStartTime = Date.now();
      var preparedStmt = env.DB.prepare(sqlite);
      var dbresult = await env.DB.batch(uniqueEventsArray.map((event: any) => preparedStmt.bind(event.ServerZone, parseInt(event.ServerId))));
      console.log(`DB SQLITE  Execute:  count: ${dbresult.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${dbresult.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)
      var requestStartTime = Date.now();
      var preparedStmtcolos = env.DB.prepare(sqlite2);
      var dbresultcolos = await env.DB.batch(uniqueEventsArray.filter((event: any) => event.ServerZone && event.ServerZone.length != 0).map((event: any) => preparedStmtcolos.bind(event.ServerZone, event.ServerZone, uniqueSmartRoutingColos[event.ServerZone] ? 1 : 0, uniqueUpperTierColos[event.ServerZone] ? 1 : 0)));
      console.log(`DB SQLITE Colos  Execute:  count: ${dbresultcolos.reduce((accumulator, item) => accumulator + item.meta.changes, 0)}, dbtime: ${dbresultcolos.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(Date.now() - requestStartTime)}ms`)

    } catch (error: any) {
      console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
    }
  } catch (error: any) {
    console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
  }
  await pushMetadata(env.DB, zone, lastEventDate, oldestEventDate);
  await pushMetadata(env.DB2, zone, lastEventDate, oldestEventDate);
  return;
}
async function pushMetadata(DB: D1Database, zone: string, latestEdgeEnd: Date, oldestEventDate: Date ) {
  try {
    var lastUpdate = await DB.prepare("Select Value from meta where Key = 'LastHttpEvent' and Type = 'logpushmeta' limit 1;").first();

    try {
      if (lastUpdate != null) {
        var tryParseState = new Date(lastUpdate.Value);
        if (tryParseState > latestEdgeEnd) {
          console.log(`pushMetadata returning because latest Edge Update from here is ${latestEdgeEnd}, but DB says it is ${lastUpdate.Value}. Zone ${zone},  Lag: ${(new Date().getTime() - latestEdgeEnd.getTime()) / 1000}, Oldest Event: ${(new Date().getTime() - oldestEventDate.getTime()) / 1000}`)
          return;
        }
      }
    } catch (error: any) {
      console.log(`Error parsing last Update from meta: ${error}, ${error?.cause}`);
    }

    var requestStartTime = Date.now();
    var updateMeta = DB.prepare(`INSERT OR REPLACE INTO meta (Key, Value, Type)
    VALUES (?1, ?2, ?3)
    ON CONFLICT (Key) DO UPDATE SET Value = EXCLUDED.Value;`)

    var newData = [
      updateMeta.bind("LastDataUpdate", latestEdgeEnd.toISOString(), "colometa"),

    ]
    newData.push(updateMeta.bind("LastHttpEvent", latestEdgeEnd.toISOString(), "logpushmeta"));


    var dbmetaresult = await DB.batch(newData);

    console.log(
      `DB Meta SQLITE  Execute:  count: ${dbmetaresult.reduce(
        (accumulator, item) => accumulator + item.meta.changes,
        0
      )}, dbtime: ${dbmetaresult.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(
        Date.now() - requestStartTime
      )}ms, for zone: ${zone}, last edge end ${latestEdgeEnd}, got ${lastUpdate.Value} before this. Lag: ${(new Date().getTime() - latestEdgeEnd.getTime()) / 1000}, Oldest Event: ${(new Date().getTime() - oldestEventDate.getTime()) / 1000}`
    );

  } catch (error: any) {
    console.log(`Error inserting into SQLITE: ${error}, ${error?.cause}`);
  }
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
    this.separator = /[\r\n]+/;  }

  public transform(
    chunk: string,
    controller: TransformStreamDefaultController
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

  public flush(controller: TransformStreamDefaultController) {
    if (this.lastString.length > 0) controller.enqueue(this.lastString);
  }
}

export const readlineStream = () =>
  new TransformStream(new ReadlineTransformer());
