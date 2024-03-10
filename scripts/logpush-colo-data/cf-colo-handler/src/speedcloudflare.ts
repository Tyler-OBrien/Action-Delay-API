export interface SpeedLocations {
    iata:   string;
    lat:    number;
    lon:    number;
    cca2:   string;
    region: string;
    city:   string;
}

export async function GetCFSpeed(): Promise<SpeedLocations[]> {
    var newRequest = new Request(`https://speed.cloudflare.com/locations`, { method: "GET", headers: {  "content-type": "application/json", }}) 
    var getSpeedJson = await fetchPlus(newRequest);
    if (getSpeedJson.status != 200) {
        throw new Error("Failed to get Speed CF Regions: " + getSpeedJson.status + " " + getSpeedJson.statusText + " " + await getSpeedJson.text());
    }
    return getSpeedJson.json() as SpeedLocations[];
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