import type { APIRoute } from 'astro';
import { runEndings } from '../../../lib/compare/endings';
import { isLifetime } from '../../../lib/compare/lifetime';
import { graphqlEndpoint,json,readJson } from '../../../lib/compare/runtime';
import { validateSpec } from '../../../lib/compare/spec';
export const prerender=false;
export const POST:APIRoute=async({request})=>{
  let body:any;
  try {body=await readJson(request);} catch {return json({error:'Invalid request'},400);}
  const checked=validateSpec(body?.spec);
  if(!checked.ok||!isLifetime(checked.spec)||(body.code!==undefined&&(typeof body.code!=='string'||body.code.length>256))) return json({error:'Invalid connection comparison'},400);
  try {return json(await runEndings(checked.spec,graphqlEndpoint(),body.code));}
  catch {return json({error:'Connection endings could not be loaded.'},502);}
};
