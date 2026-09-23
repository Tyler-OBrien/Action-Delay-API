import {pendingSourceIndex} from '../../lib/compare/presentation';
import CompareTooltip from './CompareTooltip';
import {useEffect,useState} from 'react';
import {compareColor} from './chartTheme';
import {formatLifetimeDuration} from '../../lib/compare/lifetime';
import {rawValue} from '../../lib/compare/scale';
function useEndingRequest(spec,code,enabled=true) {
  const signature=JSON.stringify({spec,code});
  const [state,setState]=useState(null);
  useEffect(()=>{
    if(!enabled) return;
    let cancelled=false;
    const controller=new AbortController();
    setState({signature,loading:true});
    fetch('/api/compare/endings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({spec,code}),signal:controller.signal})
      .then(async r=>{if(!r.ok)throw new Error();return r.json();})
      .then(data=>{if(!cancelled)setState({signature,data});})
      .catch(()=>{if(!cancelled)setState({signature,error:true});});
    return ()=>{cancelled=true;controller.abort();};
  },[signature,enabled]);
  return state?.signature===signature?state:null;
}
function Duration({value}) {
  const raw=rawValue(value,'ms');
  return <CompareTooltip label={raw}>{formatLifetimeDuration(value)}</CompareTooltip>;
}
const countText=cell=>`${cell.count.toLocaleString()}${cell.percent===null?'':` · ${Number(cell.percent.toFixed(1))}%`}`;
export default function ConnectionEndings({spec,chartSeries=[]}) {
  const dataState=useEndingRequest(spec);
  const [selected,setSelected]=useState(null);
  const signature=JSON.stringify(spec);
  const code=selected?.signature===signature?selected.code:undefined;
  const detail=useEndingRequest(spec,code,code!==undefined);
  const data=dataState?.data;
  const choose=value=>setSelected(code===value?null:{signature,code:value});
  const category=data?.categories?.find(c=>c.code===code);
  const source=(row,index)=>{
    const chartIndex=chartSeries.findIndex(s=>s.sourceId===row.sourceId);
    return <CompareTooltip label={row.sourceId}><span className="inline-block w-3 h-3 mr-2 rounded-sm" style={{backgroundColor:compareColor(row.label,chartIndex<0?pendingSourceIndex(spec,row.sourceId,index):chartIndex)}}/>{row.label}</CompareTooltip>;
  };
  const categoryButton=c=><button type="button" className="underline decoration-dotted text-left" title={c.rawCodes.map(v=>v||'(blank)').join(', ')} aria-expanded={code===c.code} aria-controls="ending-lifetime-detail" onClick={()=>choose(c.code)}>{c.label}</button>;
  return <section aria-label="How connections ended" className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
    <h3 className="text-sm font-medium">How connections ended</h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Counts describe reported connections that ended.</p>
    {(!dataState||dataState.loading)&&<p role="status" className="compare-secondary-loading mt-2 text-sm">Loading connection endings…</p>}
    {dataState?.error&&<p role="status" className="mt-2 text-sm">Connection endings could not be loaded.</p>}
    {data&&(!data.rows.some(r=>r.total>0)?<p className="mt-2 text-sm">No reports.</p>:<>
      <div className="hidden md:block overflow-x-auto mt-2"><table className="w-full text-left text-sm"><thead><tr><th className="py-2 pr-3">Source</th>{data.categories.map(c=><th key={c.code} className="py-2 pr-3 font-medium">{categoryButton(c)}</th>)}</tr></thead>
        <tbody>{data.rows.map((r,i)=><tr key={r.sourceId} className="border-t border-gray-100 dark:border-gray-800"><th className="py-2 pr-3 font-medium">{source(r,i)}</th>{r.cells.map(c=><td key={c.code} className="py-2 pr-3 tabular-nums whitespace-nowrap">{countText(c)}</td>)}</tr>)}</tbody>
      </table></div>
      <div className="md:hidden mt-2 space-y-3">{data.rows.map((r,i)=><div key={r.sourceId} className="text-sm"><p className="font-medium">{source(r,i)}</p>{r.cells.map(c=><div key={c.code} className="flex justify-between gap-3 py-1">{categoryButton(data.categories.find(k=>k.code===c.code))}<span className="tabular-nums whitespace-nowrap">{countText(c)}</span></div>)}</div>)}</div>
    </>)}
    <div id="ending-lifetime-detail">{category&&<div className="mt-3 rounded border border-gray-200 dark:border-gray-700 p-3 text-sm">
      <h4 className="font-medium">{category.label} · Median reported lifetime</h4>
      {(!detail||detail.loading)&&<p role="status">Loading lifetimes…</p>}
      {detail?.error&&<p role="status">Lifetimes could not be loaded.</p>}
      {detail?.data&&data.rows.map((r,i)=>{const summary=detail.data.summaries.find(s=>s.sourceId===r.sourceId);return <div key={r.sourceId} className="flex justify-between gap-3 py-1">{source(r,i)}{summary?.count>0?<Duration value={summary.medianDuration}/>:<span>No reports</span>}</div>;})}
    </div>}</div>
  </section>;
}
