import {useEffect,useState} from 'react';
import {errorJobs} from '../../lib/compare/locationErrors';
import CompareGraph from './CompareGraph';
function useErrorData(spec,job,location,enabled) {
  const signature=JSON.stringify({spec,job,location});
  const [state,setState]=useState(null);
  useEffect(()=>{
    if(!enabled)return;
    let cancelled=false;const controller=new AbortController();
    setState({signature,loading:true});
    fetch('/api/compare/errors',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({spec,job,location}),signal:controller.signal})
      .then(async r=>{const body=await r.json();if(!r.ok)throw new Error(body.error||'Data could not be loaded.');return body;})
      .then(data=>{if(!cancelled)setState({signature,data});})
      .catch(e=>{if(!cancelled)setState({signature,error:e.message||'Data could not be loaded.'});});
    return ()=>{cancelled=true;controller.abort();};
  },[signature,enabled]);
  return state?.signature===signature?state:null;
}
const period=(t,minutes)=>`${new Date(t).toLocaleString()} – ${new Date(t+minutes*60000).toLocaleString()}`;
function LocationErrorPanel({spec,jobs}) {
  const [open,setOpen]=useState(false),[job,setJob]=useState(jobs[0].id),[location,setLocation]=useState(undefined),[hover,setHover]=useState('');
  const state=useErrorData(spec,job,undefined,open);
  const latency=useErrorData(spec,job,location,open&&location!==undefined);
  const data=state?.data;
  const max=Math.max(1,...(data?.rows??[]).flatMap(r=>r.counts));
  const choose=loc=>setLocation(current=>current===loc?undefined:loc);
  return <details aria-label="Errors by location" open={open} onToggle={e=>setOpen(e.currentTarget.open)} className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
    <summary className="cursor-pointer text-sm font-medium">Errors by location</summary>
    {open&&<div className="mt-2 text-sm">
      {jobs.length>1&&<label className="block mb-2">Service <select aria-label="Error service" className="max-w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 p-2" value={job} onChange={e=>{setJob(e.target.value);setLocation(undefined);setHover('');}}>{jobs.map(j=><option key={j.id} value={j.id}>{j.label}</option>)}</select></label>}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recorded error occurrences for the probes in this comparison. Select a location to inspect its latency.</p>
      {(!state||state.loading)&&<p role="status">Loading location errors…</p>}
      {state?.error&&<p role="status">{state.error}</p>}
      {data&&(!data.rows.length?<p role="status">No recorded errors for these probes.</p>:<>
        <p aria-live="polite" className="text-xs min-h-8 mb-1">{hover||`Darker cells indicate more errors · 0–${max.toLocaleString()}`}</p>
        <div className="overflow-auto max-h-80 rounded border border-gray-200 dark:border-gray-700" aria-label="Location error heatmap">
          <table className="text-xs w-full border-separate border-spacing-0"><thead><tr><th className="sticky left-0 bg-white dark:bg-slate-900 p-2">Probe</th><th colSpan={data.times.length} className="p-2"><span className="flex justify-between gap-6"><span>{new Date(data.times[0]).toLocaleString()}</span><span>{new Date(data.times.at(-1)).toLocaleString()}</span></span></th></tr></thead>
          <tbody>{data.rows.map(row=><tr key={row.location}><th className="sticky left-0 bg-white dark:bg-slate-900 p-1 text-left"><button type="button" className="p-1 underline decoration-dotted" disabled={!row.location} aria-pressed={location===row.location} onClick={()=>choose(row.location)}>{row.location||'No probe label'}</button></th>{row.counts.map((count,i)=>{
            const label=`${row.location||'No probe label'} · ${period(data.times[i],data.intervalMinutes)} · ${count.toLocaleString()} errors`;
            return <td key={data.times[i]} className="p-px"><button type="button" disabled={!row.location} aria-label={label} onFocus={()=>setHover(label)} onMouseEnter={()=>setHover(label)} onClick={()=>choose(row.location)} className="block w-5 min-w-5 h-7 rounded-sm" style={{backgroundColor:count?`rgba(249,115,22,${0.2+0.8*count/max})`:'transparent'}} /></td>;
          })}</tr>)}</tbody></table>
        </div>
        <details className="mt-2"><summary className="cursor-pointer">Error counts table</summary><div className="overflow-auto max-h-80"><table className="text-left text-xs w-full"><thead><tr><th className="p-2">Probe</th><th className="p-2">Period</th><th className="p-2">Errors</th></tr></thead><tbody>{data.rows.flatMap(row=>row.counts.map((count,i)=><tr key={`${row.location}:${i}`}><th className="p-2"><button type="button" className="underline" disabled={!row.location} onClick={()=>choose(row.location)}>{row.location||'No probe label'}</button></th><td className="p-2">{period(data.times[i],data.intervalMinutes)}</td><td className="p-2 tabular-nums">{count.toLocaleString()}</td></tr>))}</tbody></table></div></details>
      </>)}
      {location!==undefined&&<section aria-label="Selected probe latency" className="mt-3"><h4 className="font-medium">{location} · Response latency</h4>
        {latency?.error?<p role="status">{latency.error}</p>:<CompareGraph series={latency?.data?.series??[]} isLoading={!latency||latency.loading}/>}</section>}
    </div>}
  </details>;
}
export default function RecordedErrors({spec}) {
  const jobs=errorJobs(spec);
  return jobs.length?<LocationErrorPanel key={JSON.stringify(spec)} spec={spec} jobs={jobs}/>:null;
}
