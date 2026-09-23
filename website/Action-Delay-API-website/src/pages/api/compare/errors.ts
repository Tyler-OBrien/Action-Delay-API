import type { APIRoute } from 'astro';
import {runLocationErrors,runLocationLatency,locationErrorSpec,locationLatencySpec} from '../../../lib/compare/locationErrors';
import {graphqlEndpoint,json,readJson} from '../../../lib/compare/runtime';
import {validateSpec} from '../../../lib/compare/spec';
export const prerender=false;
export const POST:APIRoute=async({request})=>{
  let body:any;
  try{body=await readJson(request);}catch{return json({error:'Invalid request'},400);}
  const checked=validateSpec(body?.spec);
  if(!checked.ok||typeof body.job!=='string'||body.location!==undefined&&typeof body.location!=='string')return json({error:'Invalid performance comparison'},400);
  try {
    const derived=body.location===undefined?locationErrorSpec(checked.spec,body.job):locationLatencySpec(checked.spec,body.job,body.location);
    if(!validateSpec(derived).ok)return json({error:'Invalid location selection'},400);
  }catch(e){return json({error:e instanceof Error?e.message:'Invalid selection'},400);}
  try{return json(body.location===undefined?await runLocationErrors(checked.spec,body.job,graphqlEndpoint()):await runLocationLatency(checked.spec,body.job,body.location,graphqlEndpoint()));}
  catch{return json({error:body.location===undefined?'Location error data is not available yet.':'Probe latency could not be loaded.'},502);}
};
