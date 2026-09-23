import { initialPreset } from './stories';
import { validateSpec, DEFAULT_MAX_POINTS } from './spec';
import type { CompareSpec } from './spec';
import type { Preset } from './presets';
import { isLifetime } from './lifetime';
export const VIEW_PARAMS = ['view','range','metric','from','to','custom','history'];
const HOURS = [6,24,72,168,720,2160,4320,8760];
type Metrics = {id:string;metrics:{metric:string;op:string}[]}[];
export interface ViewState {spec:CompareSpec|null; presetId:string|null; title:string; hours:number|null; history:boolean; notice?:string}
const duration=(spec:CompareSpec)=>(Date.parse(spec.to)-Date.parse(spec.from))/3600000;
const rolling=(spec:CompareSpec,hours:number,now:number)=>({...spec,from:new Date(now-hours*3600000).toISOString(),to:new Date(now).toISOString()});
function canonical(value:any):any {
  if(Array.isArray(value)) return value.map(canonical);
  if(value && typeof value==='object') return Object.fromEntries(Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k=>[k,canonical(value[k])]));
  return value;
}
const equal=(a:unknown,b:unknown)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
export function parseView(params:URLSearchParams,presets:Preset[],metrics:Metrics=[],now=Date.now()):ViewState {
  const initial=initialPreset(presets);
  const fallback=():ViewState=>({spec:initial ? rolling(initial.spec,duration(initial.spec),now) : null,presetId:initial?.id??null,title:initial?.label??'',hours:initial ? duration(initial.spec) : 168,history:false});
  try {
    for(const key of VIEW_PARAMS) if(params.getAll(key).length>1) throw Error('duplicate');
    let state=fallback();
    if(params.has('custom')) {
      if(params.has('view') || params.has('metric')) throw Error('conflicting');
      const raw=params.get('custom')!;
      if(new TextEncoder().encode(raw).length>65536) throw Error('size');
      const custom=JSON.parse(raw);
      if(!custom || !Array.isArray(custom.series)) throw Error('custom');
      const spec={...custom,series:custom.series.map((s:any)=>({...s,op:s.op??'median'}))};
      state={spec,title:custom.title??'Custom comparison',presetId:null,hours:168,history:false};
    } else if(params.has('view')) {
      const p=presets.find(p=>p.id===params.get('view'));
      if(!p) throw Error('preset');
      state={spec:p.spec,presetId:p.id,title:p.label,hours:duration(p.spec),history:false};
    }
    if(!state.spec) return state;
    if(params.has('metric')) {
      const choice=metrics.find(c=>c.id===state.presetId)?.metrics.find(m=>m.metric===params.get('metric'));
      if(!choice) throw Error('metric');
      state.spec={...state.spec,series:state.spec.series.map(s=>({...s,metric:choice.metric,op:choice.op as any}))};
    }
    if(params.has('from') || params.has('to')) {
      if(!params.get('from') || !params.get('to')) throw Error('dates');
      state.spec={...state.spec,from:params.get('from')!,to:params.get('to')!}; state.hours=null;
    } else {
      if(params.has('range')) {const h=Number(params.get('range'));if(!HOURS.includes(h)) throw Error('range');state.hours=h;}
      state.spec=rolling(state.spec,state.hours!,now);
    }
    const valid=validateSpec(state.spec); if(!valid.ok) throw Error('spec');
    state.spec=valid.spec;
    if(params.has('history') && params.get('history')!=='1') throw Error('history');
    state.history=params.get('history')==='1' && isLifetime(state.spec);
    return state;
  } catch { return {...fallback(),notice:'This saved view is unavailable or invalid. Showing the default view.'}; }
}
export function serializeView(state:ViewState,presets:Preset[],metrics:Metrics=[],existing=new URLSearchParams()):URLSearchParams {
  const params=new URLSearchParams(existing); VIEW_PARAMS.forEach(k=>params.delete(k));
  if(!state.spec) return params;
  const spec=state.spec;
  let chosen:Preset|undefined,metric:string|undefined;
  for(const p of [...presets].sort((a,b)=>Number(b.id===state.presetId)-Number(a.id===state.presetId))) {
    if((spec.maxPoints??DEFAULT_MAX_POINTS)!==(p.spec.maxPoints??DEFAULT_MAX_POINTS)) continue;
    if(equal(spec.series,p.spec.series)) {chosen=p;break;}
    const choice=metrics.find(c=>c.id===p.id)?.metrics.find(m=>equal(spec.series,p.spec.series.map(s=>({...s,metric:m.metric,op:m.op}))));
    if(choice){chosen=p;metric=choice.metric;break;}
  }
  if(chosen) {
    if(chosen.id!==initialPreset(presets)?.id) params.set('view',chosen.id);
    if(metric) params.set('metric',metric);
  } else {
    const custom={...(state.title && state.title!=='Custom comparison' ? {title:state.title} : {}),...(spec.maxPoints!=null && spec.maxPoints!==DEFAULT_MAX_POINTS ? {maxPoints:spec.maxPoints} : {}),series:spec.series.map(s=>({...s,op:s.op==='median'?undefined:s.op}))};
    params.set('custom',JSON.stringify(canonical(custom)));
  }
  if(state.hours===null) {params.set('from',spec.from);params.set('to',spec.to);}
  else if(state.hours!==(chosen ? duration(chosen.spec) : 168)) params.set('range',String(state.hours));
  if(state.history && isLifetime(spec)) params.set('history','1');
  return params;
}
