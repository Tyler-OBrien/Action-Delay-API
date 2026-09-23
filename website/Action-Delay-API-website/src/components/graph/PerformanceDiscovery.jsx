import { useMemo, useState } from 'react';
import { DISCOVERY_GROUPS, resolveDiscovery, relatedDiscovery, searchDiscovery, discoveryHref, discoveryKey } from '../../lib/compare/discovery';

export default function PerformanceDiscovery({ presets, curated, activePreset, activeMetric, onSelect }) {
  const [search,setSearch]=useState('');
  const [expanded,setExpanded]=useState(false);
  const entries=useMemo(()=>resolveDiscovery(presets,curated),[presets,curated]);
  const related=relatedDiscovery(entries,activePreset,activeMetric);
  const relatedKeys=new Set(related.map(e=>e.key));
  const searching=Boolean(search.trim());
  const visible=searching ? searchDiscovery(entries,search) : expanded ? entries : entries.filter(e=>e.curated && !relatedKeys.has(e.key));
  const activeKey=activePreset ? discoveryKey(activePreset.id,activeMetric) : null;
  const entryLink=e=><a key={e.key} data-astro-prefetch="false" data-discovery-key={e.key} href={discoveryHref(e,presets,curated)}
    aria-current={e.key===activeKey?'page':undefined}
    className="block min-w-0 rounded px-2 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
    onClick={event=>{
      if(event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      event.preventDefault();onSelect(e.preset);setSearch('');
      requestAnimationFrame(()=>{const heading=document.getElementById('performance-view-title');heading?.focus({preventScroll:true});heading?.scrollIntoView({block:'start'});});
    }}>
    <span className="block text-sm font-medium">{e.title}</span>
    <span className="block text-xs mt-1 text-gray-600 dark:text-gray-300">{e.description}</span>
  </a>;
  return <section className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-5" aria-labelledby="performance-discovery-title">
    <h2 id="performance-discovery-title" className="text-lg font-semibold">More to explore</h2>
    {!searching && related.length>0 && <div className="mt-3">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Related experiments</h3>
      <div className="grid sm:grid-cols-3 gap-2 mt-1">{related.map(entryLink)}</div>
    </div>}
    <label className="block text-sm mt-4">Find a comparison
      <input type="search" value={search} onInput={e=>setSearch(e.target.value)} placeholder="Search workloads, providers, or metrics…"
        className="block w-full mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500" />
    </label>
    <div id="performance-discovery-list" className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
      {DISCOVERY_GROUPS.map(group=>{
        const matches=visible.filter(e=>e.group===group);
        return matches.length>0 && <div key={group}><h3 className="text-sm font-semibold mb-1">{group}</h3>{matches.map(entryLink)}</div>;
      })}
    </div>
    {searching && <p role="status" className="text-xs text-gray-500 mt-2">{visible.length ? `${visible.length} comparisons match.` : 'No comparisons match.'}</p>}
    {!searching && <button type="button" className="mt-4 text-sm underline rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500" aria-expanded={expanded} aria-controls="performance-discovery-list" onClick={()=>setExpanded(v=>!v)}>{expanded?'Show curated comparisons':'Show all comparisons'}</button>}
  </section>;
}
