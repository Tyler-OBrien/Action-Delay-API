import type {CompareSpec,CompareSeriesSpec} from './spec';
import {buildQuery,runCompare} from './gql';
import {sourceLabel} from './labels';
export function errorJobs(spec:CompareSpec) {
  if(!spec.series.length||spec.series.some(s=>!['perf','perfLocations'].includes(s.family)||!['averageResponseLatency','responseLatency'].includes(s.metric)||!s.filters?.jobName?.length))return [];
  return [...new Set(spec.series.flatMap(s=>s.filters!.jobName))].map(id=>({id,label:sourceLabel('perf',id)}));
}
export function selectedErrorJob(spec:CompareSpec,job:string) {
  if(!errorJobs(spec).some(j=>j.id===job))throw new Error('Select a performance service.');
  const selections=spec.series.filter(s=>s.filters!.jobName.includes(job));
  const restricted=selections.every(s=>s.filters?.locationName?.length);
  const locations=restricted?[...new Set(selections.flatMap(s=>s.filters!.locationName))]:undefined;
  return {locations,op:selections[0].op};
}
export function locationLatencySpec(spec:CompareSpec,job:string,location:string):CompareSpec {
  const selection=selectedErrorJob(spec,job);
  if(!location||location.length>256||selection.locations&&!selection.locations.includes(location))throw new Error('Select a probe in this comparison.');
  return {from:spec.from,to:spec.to,maxPoints:spec.maxPoints,series:[{family:'perfLocations',metric:'responseLatency',op:selection.op,groupBy:'locationName',filters:{jobName:[job],locationName:[location]}}]};
}
export function locationErrorSpec(spec:CompareSpec,job:string):CompareSpec {
  const {locations}=selectedErrorJob(spec,job);
  const span=(Date.parse(spec.to)-Date.parse(spec.from))/60000;
  if(span<240)throw new Error('Choose a range of at least 4 hours.');
  const series:CompareSeriesSpec={family:'apiErrorsPerf',metric:'errors',op:'count',groupBy:'locationName',filters:{jobName:[job],...(locations?{locationName:locations}:{})}};
  return {from:spec.from,to:spec.to,maxPoints:Math.max(1,Math.min(100,Math.floor(span/240))),series:[series]};
}
export function locationErrorRows(raw:any,from:string,to:string) {
  if(!raw||!['m30','h12'].includes(raw.tier))throw new Error('Location error rollups are not available.');
  if(!Array.isArray(raw.points)||!Number.isFinite(raw.intervalMinutes)||raw.intervalMinutes<1)throw new Error('Incomplete location errors.');
  const step=raw.intervalMinutes*60000;
  const times:number[]=[];
  for(let x=Math.floor(Date.parse(from)/step)*step;x<=Date.parse(to);x+=step){if(times.length>5000)throw new Error('Too many periods.');times.push(x);}
  const grouped=new Map<string,Map<number,number>>();
  for(const p of raw.points) {
    if(typeof p.locationName!=='string'||!Number.isFinite(p.countErrors)||p.countErrors<0||!Number.isFinite(Date.parse(p.time)))throw new Error('Invalid location errors.');
    if(!p.countErrors)continue;
    if(!grouped.has(p.locationName))grouped.set(p.locationName,new Map());
    const values=grouped.get(p.locationName)!;const x=Date.parse(p.time);values.set(x,(values.get(x)??0)+p.countErrors);
  }
  const rows=[...grouped].map(([location,values])=>({location,total:[...values.values()].reduce((a,b)=>a+b,0),counts:times.map(t=>values.get(t)??0)})).sort((a,b)=>b.total-a.total||a.location.localeCompare(b.location));
  return {rows,times,intervalMinutes:raw.intervalMinutes,tier:raw.tier};
}
export async function runLocationErrors(spec:CompareSpec,job:string,endpoint:string,fetchImpl:typeof fetch=fetch) {
  const built=buildQuery(locationErrorSpec(spec,job));
  const response=await fetchImpl(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:built.query,variables:built.variables}),signal:AbortSignal.timeout(30000)});
  const body=await response.json();
  if(!response.ok||body.errors?.length)throw new Error('Location error data is not available yet.');
  return locationErrorRows(body.data?.s0,spec.from,spec.to);
}
export const runLocationLatency=(spec:CompareSpec,job:string,location:string,endpoint:string)=>runCompare(locationLatencySpec(spec,job,location),endpoint);
