import airports from "./airports.json";
import countrycodes from "./country_codes.json";
import airporttocity from "./airport2city.json";

export interface LoadBalancerRegions {
    result:   LBRegionsResult;
    success:  boolean;
    errors:   any[];
    messages: any[];
}

export interface LBRegionsResult {
    iso_standard: string;
    regions:      Region[];
}

export interface Region {
    region_code: string;
    countries:   Country[];
}

export interface Country {
    country_code_a2:       string;
    country_name:          string;
    country_subdivisions?: CountrySubdivision[];
}

export interface CountrySubdivision {
    subdivision_code_a2: string;
    subdivision_name:    string;
}

export interface Airports {
    continent:   string;
    iata_code:   string;
    iso_country: string;
    iso_region:  string;
    coordinates: string;
}


export function GetAirports() : Airports[]
{
    return JSON.parse(airports);
}

export function GetCountryCodes() : any
{
    return JSON.parse(countrycodes);
}

export function GetAirportCodeToCity() : any
{
    return JSON.parse(airporttocity);
}

export async function GetRegions(authorizationToken: string): Promise<LoadBalancerRegions> {
    var newRequest = new Request(`https://api.cloudflare.com/client/v4/accounts/6b9f7e0e1478562986a4db3cf9fcfac3/load_balancers/regions`, { method: "GET", headers: {  "content-type": "application/json", "Authorization": "Bearer " + authorizationToken }}) 
    var getLBRegions = await fetchPlus(newRequest);
    if (getLBRegions.status != 200) {
        throw new Error("Failed to get LB Regions: " + getLBRegions.status + " " + getLBRegions.statusText + " " + await getLBRegions.text());
    }
    return getLBRegions.json() as LoadBalancerRegions;
}

export async function fetchPlus(url: any, options = {}, retries = 5): Promise<any>
{
  return fetch(url, options)
    .then(async (res) => {
      if (res.ok) {
        return res;
      }
      if (retries > 0) {
        console.log(`Retrying ${url}... ${retries} retries left (${res.status} ${res.statusText})`)
        await wait(100);
        return fetchPlus(url, options, retries - 1)
      }
      return res;
    })
    .catch(error => console.error(error.message))
}



    function wait(time: number) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }