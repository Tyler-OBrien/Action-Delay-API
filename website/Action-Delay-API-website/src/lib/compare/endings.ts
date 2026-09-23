import type { CompareSpec } from './spec';
import { sourceLabel } from './labels';
export const endingCode=(raw:string)=>raw===''||raw==='Empty'?'':raw;
export function endingLabel(code:string) {
  if(!code) return 'No close code';
  if(code==='NormalClosure') return 'Normal closure';
  if(code==='EndpointUnavailable') return 'Endpoint unavailable';
  return code.replace(/([a-z])([A-Z])/g,'$1 $2');
}
export function endingCounts(points:{source:string;closecode:string;count:number}[], selected:string[]=[]) {
  const codes=[...new Set(points.map(p=>endingCode(p.closecode)))].sort();
  const categories=codes.map(code=>({code,label:endingLabel(code),rawCodes:[...new Set(points.filter(p=>endingCode(p.closecode)===code).map(p=>p.closecode))]}));
  const sources=[...new Set([...selected,...points.map(p=>p.source)])];
  const rows=sources.map(sourceId=>{
    const own=points.filter(p=>p.source===sourceId);
    const total=own.reduce((sum,p)=>sum+p.count,0);
    return {sourceId,label:sourceLabel('websocketMonitoring',sourceId),total,cells:codes.map(code=>{
      const count=own.filter(p=>endingCode(p.closecode)===code).reduce((sum,p)=>sum+p.count,0);
      return {code,count,percent:total?100*count/total:null};
    })};
  });
  return {categories,rows};
}
export async function runEndings(spec:CompareSpec,endpoint:string,code?:string,fetchImpl:typeof fetch=fetch) {
  const s=spec.series[0];
  let closecode=s.filters?.closecode;
  if(code!==undefined) {
    const requested=code===''?['','Empty']:[code];
    closecode=closecode?requested.filter(c=>closecode!.includes(c)):requested;
    if(!closecode.length) return {summaries:[]};
  }
  const variables={from:spec.from,to:spec.to,source:s.filters?.source,closecode};
  const args='($from: Time!, $to: Time!, $source: [String!], $closecode: [String!])';
  const filters='from:$from,to:$to,source:$source,closecode:$closecode';
  const query=code===undefined
    ? `query Endings${args} { result:websocketMonitoring(${filters},maxPoints:50) { tier intervalMinutes points { source closecode count } } }`
    : `query EndingLifetime${args} { result:websocketMonitoringSummary(${filters}) { source medianDuration count } }`;
  const resp=await fetchImpl(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(30000)});
  const body=await resp.json();
  if(!resp.ok||body.errors?.length||!body.data?.result) throw new Error('Connection endings unavailable');
  if(code!==undefined) {
    if(!Array.isArray(body.data.result)) throw new Error('Invalid lifetime summary');
    for(const row of body.data.result) if(typeof row.source!=='string'||!Number.isFinite(row.count)||row.count<0||!(row.medianDuration===null||Number.isFinite(row.medianDuration)&&row.medianDuration>=0)) throw new Error('Invalid lifetime summary');
    return {summaries:body.data.result.map((r:any)=>({sourceId:r.source,medianDuration:r.medianDuration,count:r.count}))};
  }
  const result=body.data.result;
  if(!Array.isArray(result.points)) throw new Error('Incomplete connection endings');
  for(const p of result.points) if(typeof p.source!=='string'||typeof p.closecode!=='string'||!Number.isFinite(p.count)||p.count<0) throw new Error('Invalid ending counts');
  return {...endingCounts(result.points,s.filters?.source),tier:result.tier,intervalMinutes:result.intervalMinutes};
}
