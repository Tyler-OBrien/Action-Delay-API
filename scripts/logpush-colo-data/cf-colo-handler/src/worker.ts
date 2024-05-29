/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { CountrySubdivision, GetAirportCodeToCity, GetAirports, GetCountryCodes, GetRegions, Region } from './lbregions';
import { GetCFSpeed, SpeedLocations } from './speedcloudflare';

export interface Env {
  TOKEN: string;
  CRONAPIKEY: string;
  DB: D1Database;
  DB2: D1Database;
}

export class ResultObj {
  constructor() { }

  Region?: string;
  FriendlyLocation?: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;
}

export default {
  GetDORegions(coloInfo: any[]) {
    for (const colo of coloInfo) {
      colo.cfRegionDO = '';
      switch (colo.cfRegionLB) {
        case 'EEU':
        case 'ME':
          colo.cfRegionDO = 'eeur';
          break;
        case 'ENAM':
        case 'NSAM':
        case 'SSAM':
          colo.cfRegionDO = 'enam';
          break;
        case 'WEU':
        case 'NAF':
        case 'SAF':
          colo.cfRegionDO = 'weur';
          break;
        case 'SAS':
        case 'SEAS':
        case 'NEAS':
        case 'OC':
          colo.cfRegionDO = 'apac';
          break;
        case 'WNAM':
          colo.cfRegionDO = 'wnam';
          break;
      }
    }
  },
  async scheduled(event: ScheduledEvent | null, env: Env, ctx: ExecutionContext) {
    await Promise.allSettled([this.executeDefault(env.DB, env), this.executeDefault(env.DB2, env)]);
  },
  async executeDefault(DB: D1Database, env: Env) {
    console.log('running...');
    var requestStartTime = Date.now();
    let batchStmts = [];
    var getColos = await DB.prepare('SELECT * from colos order by coloId asc;').all();
    var stmt = DB.prepare(`UPDATE colos
    SET region = ?1,
        friendlyLocation = ?2,
        Country = ?3,
        latitude = ?4,
        longitude = ?5
    WHERE coloId = ?6`);
    console.log(`we got colos: ${getColos.results.length}`);
    var getLBRegions = await GetRegions(env.TOKEN);

    console.log(`we got lb regions: ${getLBRegions.result.regions.length}`);
    var getCFSpeed: SpeedLocations[] | null = null;
    try {
      getCFSpeed = await GetCFSpeed();
      console.log(`we got getCFSpeed ${getCFSpeed.length}`);
    } catch (error) {
      console.error(error);
      console.log(`Error getting cf speed`);
    }

    var getAirports = await GetAirports();
    var getCountryCodes = await GetCountryCodes();
    var getAirportCodeToCity = await GetAirportCodeToCity();
    console.log(`we got airports ${Object.keys(getAirports).length}`);
    console.log(`finished gets`);

    var coloInfo = getColos.results;
    for (const colo of coloInfo) {
      var result: ResultObj = new ResultObj();
      let coloName: string = colo.coloName!;
      if (coloName == 'SFO-DOG') {
        coloName = 'SFO';
      }
      if (!getAirports[coloName]) {
        console.log("couldn't get airport for " + colo.coloName);
      } else {
        var foundRegion: Region | null = null;
        var foundSubdivision: CountrySubdivision | null = null;
        var getAirport = getAirports[coloName];
        //console.log(`got airport ${getAirport.iso_region} for ${colo.coloName}`);
        for (const region of getLBRegions.result.regions) {
          for (const country of region.countries) {
            if (country.country_code_a2 == getAirport.iso_country) {
              if (country.country_subdivisions && country.country_subdivisions.length != 0) {
                for (const subdivision of country.country_subdivisions) {
                  let regionCodeOverride = getAirport.iso_region;
                  if (regionCodeOverride == 'US-DC') regionCodeOverride = 'US-VA';
                  if (regionCodeOverride.endsWith(subdivision.subdivision_code_a2)) {
                    foundRegion = region;
                    foundSubdivision = subdivision;
                  }
                }
              } else {
                foundRegion = region;
              }
            }
          }
        }
        if (foundRegion == null) {
          // custom override if not set, the lb stuff wrongly doesn't include it, not much we can do :/
          if ((coloName = 'GND')) {
            foundRegion = getLBRegions.result.regions.find((region) => region.region_code == 'NSAM');
          }
        }
        if (foundRegion == null) {
          console.log("couldn't get region for " + colo.coloName);
        } else {
          var tryGetCountryName = getCountryCodes[getAirport.iso_country];
          var tryGetCityName = getAirportCodeToCity[coloName];
          if (!tryGetCountryName) {
            console.log("couldn't get country code for " + colo.coloName);
            tryGetCountryName = '';
          }
          if (!getAirportCodeToCity[coloName]) {
            console.log("couldn't get city name " + colo.coloName);
          } else {
            tryGetCityName = tryGetCityName + ', ';
          }
          //console.log(foundRegion.region_code, foundSubdivision ? `${foundSubdivision.subdivision_name}, ${tryGetCountryName}` : tryGetCountryName, tryGetCountryName, getAirport.coordinates.split(',')[0].trim(), getAirport.coordinates.split(',')[1].trim(), colo.coloId, colo.coloName)
          result.Region = foundRegion.region_code;
          result.FriendlyLocation = foundSubdivision
            ? `${tryGetCityName}${foundSubdivision.subdivision_name}, ${tryGetCountryName}`
            : tryGetCityName + tryGetCountryName;
          result.Country = tryGetCountryName;
          result.Latitude = getAirport.coordinates.split(',')[1].trim();
          result.Longitude = getAirport.coordinates.split(',')[0].trim();
        }
      }
      if (getCFSpeed != null) {
        var tryGetCfSpeed = getCFSpeed.find((findColo) => findColo.iata == coloName);
        if (tryGetCfSpeed != null) {
          var tryGetCountryName = getCountryCodes[tryGetCfSpeed.cca2];
          if (!tryGetCountryName) {
            console.log("couldn't get country code for " + coloName);
          } else {
            result.Country = tryGetCountryName;
            if (result.FriendlyLocation == null || result.FriendlyLocation.trim().length == 0) {
              // silly fallback
              result.FriendlyLocation = `${tryGetCfSpeed.city}, ${tryGetCountryName}`;
              console.log(`Warn: Had to use fallback to get friendly name of ${colo.coloName}, we got ${result.FriendlyLocation}`);
            }
          }

          if (result.Region == null || result.Region.trim().length == 0) {
            // fallback
            switch (tryGetCfSpeed.region.toLowerCase()) {
              case 'africa':
                result.Region = 'NAF';
                break;
              case 'asia pacific':
                result.Region = 'OC';
                break;
              case 'europe':
                result.Region = 'EEU';
                break;
              case 'Middle East':
                result.Region = 'ME';
                break;
              case 'North America':
                result.Region = 'ENAM';
                break;
              case 'South America':
                result.Region = 'SSAM';
                break;
            }
            console.log(`Warn: Had to use fallback to get region of ${colo.coloName}, we got ${result.Region}`);
          }
          result.Latitude = tryGetCfSpeed.lat;
          result.Longitude = tryGetCfSpeed.lon;
        } else {
          console.log("couldn't find cf speed location for " + coloName + " doesn't really matter, we used fallback.");
        }
      }

      if (result.FriendlyLocation != null && result.FriendlyLocation.trim().length != 0) {
        batchStmts.push(
          stmt.bind(result.Region, result.FriendlyLocation, result.Country, result.Latitude, result.Longitude, colo.coloId)
        );
      }
    }

    // extra stuff 



    if (batchStmts.length != 0) {
      var dbresult = await DB.batch(batchStmts);
      console.log(
        `DB SQLITE  Execute:  count: ${dbresult.reduce(
          (accumulator, item) => accumulator + item.meta.changes,
          0
        )}, dbtime: ${dbresult.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(
          Date.now() - requestStartTime
        )}ms`
      );

      try {
        var lastMachineUpdate = await DB.prepare("Select lastUpdated from machines order by lastUpdated desc limit 1;").first();

        var updateMeta = DB.prepare(`INSERT OR REPLACE INTO meta (Key, Value, Type)
        VALUES (?1, ?2, ?3)
        ON CONFLICT (Key) DO UPDATE SET Value = EXCLUDED.Value;`)
        var dbmetaresult = await DB.batch([
          updateMeta.bind("msg", `LastListRecompile is the last time (every 30 minutes), we find region/country/lat/long/nice name and update. LastDataUpdate was the last time we got updated (not necessarily new) data from an http logpush. You can include ?nometa to exclude this section, or ?simple for just ColoId:IATA. `, "colometa"),
          updateMeta.bind("LastListRecompile", new Date().toISOString().slice(0, 19).replace('T', ' '), "colometa"),
          updateMeta.bind("LastDataUpdate", lastMachineUpdate.lastUpdated, "colometa"),
          updateMeta.bind("UpdateTimeMs", `${Math.round(Date.now() - requestStartTime)}ms`, "colometa"),
          updateMeta.bind("colos", coloInfo.length.toFixed(0), "colometa"),
          updateMeta.bind("pops", (new Set(coloInfo.map(colo => colo.coloName))).size.toFixed(0), "colometa"),
        ]);
        console.log(
          `DB Meta SQLITE  Execute:  count: ${dbmetaresult.reduce(
            (accumulator, item) => accumulator + item.meta.changes,
            0
          )}, dbtime: ${dbmetaresult.reduce((accumulator, item) => accumulator + item.meta.duration, 0)}ms, actual time: ${Math.round(
            Date.now() - requestStartTime
          )}ms`
        );
      }
      catch (error) {
        console.error(error)
        console.log("error trying to update meta..")
      }
    }
  },
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    var url = new URL(request.url);
    if (url.pathname == "/supersecretfetchmetotriggercron" && request.headers.has("APIKEY") && request.headers.get("APIKEY") === env.CRONAPIKEY) {
      await this.scheduled(null, env, ctx);
      return new Response('Yerp', { status: 200 });
    }
    if (url.searchParams.has('simple') || url.pathname == '/v2/colos/iata') {
      var newUrlMatch = `https://${url.hostname}/colonamessimple`;
      var tryMatch = await caches.default.match(newUrlMatch);
      if (tryMatch != null) return tryMatch;

      var getColos = null;
      try {
        getColos = await env.DB.prepare('SELECT coloId as ID, coloName as IATA from colos order by coloId asc;').all();
      }
      catch {
        getColos = await env.DB2.prepare('SELECT coloId as ID, coloName as IATA from colos order by coloId asc;').all();
      }
      var coloInfo = getColos.results;
      var newResponse = new Response(JSON.stringify(coloInfo), { status: 200, headers: { "Content-Type": "application/json" } });
      newResponse.headers.append('Cache-Control', 'public, max-age=600, immutable');
      ctx.waitUntil(caches.default.put(newUrlMatch, newResponse.clone()));
      return newResponse;
    }
    if (url.pathname == '/' || url.pathname == '/v2/colos/' || url.pathname == '/v2/colos/iataregion' ||  url.pathname == '/v2/colos/idregion')
    {
      let noMeta = url.searchParams.has("nometa");
      let extraCacheKey = noMeta ? "nometa" : "meta";


      let selectColumns = 'coloId as ID, coloName as IATA, region as cfRegionLB, friendlyLocation as niceName, Country as country,  latitude as lat, longitude as long';

      let iataRegion = url.searchParams.has("iataregion") || url.pathname == '/v2/colos/iataregion';
      let idRegion = url.searchParams.has("idregion")  || url.pathname == '/v2/colos/idregion';
      if (iataRegion || idRegion) noMeta = true;
      if (iataRegion) {
        selectColumns = 'coloName as IATA, region as cfRegionLB'
        extraCacheKey += "iataRegion"
      }
      if (idRegion) {
        selectColumns = 'coloId as ID, region as cfRegionLB'
        extraCacheKey += "idRegion"
      }



      var newUrlMatch = `https://${url.hostname}/colonames${extraCacheKey}`;
      var tryMatch = await caches.default.match(newUrlMatch);
      if (tryMatch != null) return tryMatch;

      var getColos =  null;
      try {
        getColos = await env.DB.prepare(
          `SELECT ${selectColumns} from colos order by coloId asc;`
        ).all();
      }
      catch {
        getColos = await env.DB2.prepare(
          `SELECT ${selectColumns} from colos order by coloId asc;`
        ).all();
      }
      var coloInfo = getColos.results;
      this.GetDORegions(coloInfo)

      var results: any = {}
      if (iataRegion || idRegion) {
        results.results = {};
        if (iataRegion) {
          for (const colo of coloInfo) {
            if (colo.cfRegionDO)
              results.results[colo.IATA] = colo.cfRegionDO;
          }
        }
        else if (idRegion) {
          for (const colo of coloInfo) {
            if (colo.cfRegionDO)
              results.results[colo.ID] = colo.cfRegionDO;
          }
        }
      }
      else {
        results.results = coloInfo;
      }
      if (noMeta == false) {
        var getMeta = null;
        try {
          getMeta = await env.DB.prepare(
            'SELECT Key, Value from meta where Type = "colometa";'
          ).all();
        }
        catch {
          var getMeta = await env.DB2.prepare(
            'SELECT Key, Value from meta where Type = "colometa";'
          ).all();
        }
        results.meta = {}
        for (const result of getMeta.results) {
          results.meta[result.Key] = result.Value;
        }
      }
      var newResponse = new Response(JSON.stringify(results), { status: 200, headers: { "Content-Type": "application/json" } });
      newResponse.headers.append('Cache-Control', 'public, max-age=600, immutable');
      ctx.waitUntil(caches.default.put(newUrlMatch, newResponse.clone()));
      return newResponse;
    }
    return new Response("Found nothing", { status: 404})
  },
};
