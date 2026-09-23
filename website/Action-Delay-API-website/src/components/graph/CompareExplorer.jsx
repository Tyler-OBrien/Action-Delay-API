import './compare.css';
import CompareTooltip from './CompareTooltip';
import { AI_COMPARE_ENABLED } from '../../lib/compare/featureFlags';
import { BENCHMARK_METHOD } from '../../lib/compare/benchmarks';
import PerformanceDiscovery from './PerformanceDiscovery';
import { parseView, serializeView } from '../../lib/compare/urlState';
import { comparisonPresentation, limitedBenchmarkHistory } from '../../lib/compare/presentation';
import { isLifetime } from '../../lib/compare/lifetime';
import { LIFETIME_CONTEXT } from '../../lib/compare/measurement';
import { resolveStories, resolveTopics, storyIsActive } from '../../lib/compare/stories';
import { sourceLabel } from '../../lib/compare/labels';
import { highlights } from '../../lib/compare/facts';
import { formatValue, rawValue } from '../../lib/compare/scale';
import { compareColor } from './chartTheme';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import CompareGraph from './CompareGraph';
import LifetimeResults from './LifetimeResults';
import ConnectionEndings from './ConnectionEndings';
import RecordedErrors from './RecordedErrors';

// The interactive Performance explorer at /perf/.
//
// One island rather than Astro-side controls, because every control edits the
// same CompareSpec and a spec is only meaningful as a whole. It never talks to
// adp-proxy directly — /api/compare validates the spec server-side, which is
// what keeps the endpoint out of the browser's reach.

const RANGES = [
  { label: 'Last 6 hours', hours: 6 },
  { label: 'Last 24 hours', hours: 24 },
  { label: 'Last 3 days', hours: 72 },
  { label: 'Last 7 days', hours: 168 },
  { label: 'Last 30 days', hours: 720 },
  { label: 'Last 90 days', hours: 2160 },
  { label: 'Last 180 days', hours: 4320 },
  { label: 'Last year', hours: 8760 },
];

const OPS = [
  { value: 'median', label: 'Median' },
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
];

// Which job list a family draws from. Families without a jobName dimension
// (websocketMonitoring, yabs) are keyed by `source` instead and get no picker.
const JOB_TYPE_BY_FAMILY = {
  workersDelay: 'delay',
  workersDelayLocations: 'delay',
  apiErrors: 'delay',
  perf: 'perf',
  perfLocations: 'perf',
  apiErrorsPerf: 'perf',
  ai: 'ai',
  aiLocations: 'ai',
  apiErrorsAi: 'ai',
};

const SELECT_CLASS =
  'min-w-0 max-w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5';

function withRange(spec, hours) {
  const to = Date.now();
  return { ...spec, from: new Date(to - hours * 3600000).toISOString(), to: new Date(to).toISOString() };
}

const CompareExplorer = (props) => {
  const { presets = [], families = [], jobsByType = {}, regions = [], curated = [], limits } = props;
  const initial = useMemo(() => parseView(new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search),presets,curated), []);
  const [hours,setHours]=useState(initial.hours);
  const [notice,setNotice]=useState(initial.notice);
  const restoring=useRef(true);
  const previousSpec=useRef(null);
  const stories = resolveStories(presets);
  const topics = resolveTopics(presets);
  const [narrationRequested, setNarrationRequested] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(initial.history);
  const [spec, setSpec] = useState(initial?.spec ?? null);
  const [title, setTitle] = useState(initial.title);
  // Tracked separately from the title: the title also changes from the AI and
  // manual paths, so using it to decide which chip is active would clear the
  // highlight whenever a preset was refined rather than replaced.
  const [activePresetId, setActivePresetId] = useState(initial.presetId);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [narration, setNarration] = useState(null);
  const [narrating, setNarrating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [interpreting, setInterpreting] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(()=>{
    const restore=()=>{
      const view=parseView(new URLSearchParams(window.location.search),presets,curated);
      restoring.current=true;
      setSpec(view.spec);setActivePresetId(view.presetId);setTitle(view.title);
      setHours(view.hours);setHistoryOpen(view.history);setNotice(view.notice);
    };
    window.addEventListener('popstate',restore);
    return ()=>window.removeEventListener('popstate',restore);
  },[presets,curated]);
  useEffect(()=>{
    const query=serializeView({spec,presetId:activePresetId,title,hours,history:historyOpen},presets,curated,new URLSearchParams(window.location.search));
    const url=window.location.pathname+(query.size ? `?${query}` : '')+window.location.hash;
    const signature=JSON.stringify({spec,presetId:activePresetId,title,hours});
    const replace=restoring.current || previousSpec.current===signature;
    if(url!==window.location.pathname+window.location.search+window.location.hash) window.history[replace?'replaceState':'pushState'](null,'',url);
    restoring.current=false;previousSpec.current=signature;
  },[spec,activePresetId,title,hours,historyOpen,presets,curated]);

  // --- Data -----------------------------------------------------------------

  useEffect(() => {
    if (!spec) return;
    let cancelled = false;

    setIsLoading(true);
    setNarrationRequested(false);
    setResult(null);
    setNarrating(false);
    setError(null);
    setNarration(null);

    fetch('/api/compare', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ spec }),
    })
      .then(async (resp) => {
        const body = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          throw new Error([body.error, ...(body.details ?? [])].filter(Boolean).join(' — '));
        }
        return body;
      })
      .then((body) => {
        if (cancelled) return;
        setResult(body);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Could not load this comparison.');
        setResult(null);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [spec]);

  // Narration is a second, optional request so the chart is never waiting on it.
  useEffect(() => {
    if (!AI_COMPARE_ENABLED || !narrationRequested || !result?.facts?.series?.length) return;
    let cancelled = false;
    setNarrating(true);

    fetch('/api/compare/narrate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ facts: result.facts }),
    })
      .then((resp) => { if (!resp.ok) throw new Error('Summary unavailable'); return resp.json(); })
      .then((body) => {
        if (!cancelled && body?.text) setNarration(body.text);
      })
      .catch(() => { if (!cancelled) setNarration('The AI explanation is unavailable. The computed results are shown above.'); })
      .finally(() => {
        if (!cancelled) setNarrating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [result, narrationRequested]);

  const askAi = useCallback(
    (event) => {
      event.preventDefault();
      const text = prompt.trim();
      if (!AI_COMPARE_ENABLED || !text || interpreting) return;

      setInterpreting(true);
      setError(null);
      fetch('/api/compare/interpret', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      })
        .then(async (resp) => {
          const body = await resp.json().catch(() => ({}));
          if (!resp.ok) {
            throw new Error([body.error, ...(body.details ?? [])].filter(Boolean).join(' — '));
          }
          return body;
        })
        .then((body) => {
          setHours(null);
          setHistoryOpen(false);
          setTitle(body.spec.title || 'Custom comparison');
          setActivePresetId(null);
          setSpec(body.spec);
        })
        .catch((err) => setError(err.message || 'Could not interpret that.'))
        .finally(() => setInterpreting(false));
    },
    [prompt, interpreting]
  );

  const onZoom = useCallback(({ min, max }) => {
    setHours(null);
    setSpec((current) =>
      current ? { ...current, from: new Date(min).toISOString(), to: new Date(max).toISOString() } : current
    );
  }, []);

  // Preset windows are computed during SSR, so on a tab left open they point at
  // whenever the page was rendered. Re-base to now on use, keeping the span the
  // preset chose.
  const applyPreset = useCallback((preset) => {
    setHistoryOpen(false);
    const hours = (Date.parse(preset.spec.to) - Date.parse(preset.spec.from)) / 3600000;
    setHours(hours);
    setNotice(null);
    setTitle(preset.label);
    setActivePresetId(preset.id);
    setSpec(withRange(preset.spec, hours));
  }, []);

  // A curated set can offer several metrics; for the CI runners the winner
  // changes depending on which one you ask for, so switching has to be one
  // control rather than five near-identical presets.
  const activeCurated = curated.find((c) => c.id === activePresetId);
  const activeMetric = spec?.series?.[0]?.metric;

  const switchMetric = useCallback(
    (metric) => {
      const choice = activeCurated?.metrics.find((m) => m.metric === metric);
      if (!choice || !spec) return;
      setSpec({
        ...spec,
        series: spec.series.map((s) => ({ ...s, metric: choice.metric, op: choice.op })),
      });
    },
    [activeCurated, spec]
  );

  const activeRange = hours;
  const activePreset = presets.find(p => p.id === activePresetId);
  const topic = topics.find(t => t.id === activePreset?.topic);
  const lifetime = isLifetime(spec);
  const benchmarkView=spec?.series?.every(s=>s.family==='yabs');
  const context = lifetime ? LIFETIME_CONTEXT : benchmarkView ? [...new Set(result?.facts?.series.map(s=>s.metricContext).filter(Boolean)??[])].join(' ') : result?.series?.some(s => s.experiment) ? 'Response-time summaries use successful probe measurements. Typical values summarize plotted time points; see experiment details for configured coverage and backend placement.' : [...new Set(result?.facts?.series.map(s => s.measurementContext).filter(Boolean) ?? [])].join(' ');


  return (
    <div className="performance-explorer w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {stories.map(story => <button type="button" key={story.id}
          aria-pressed={storyIsActive(story, activePreset)}
          onClick={() => applyPreset(story.options[0])}
          className={`text-left p-3 rounded-lg border ${storyIsActive(story, activePreset) ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-600'}`}>
          <span className="block font-semibold mb-1">{story.title}</span>
          <span className="block text-sm">{story.question}</span>
        </button>)}
      </div>
      <section id="compare-detail" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-3 sm:p-5" aria-busy={isLoading}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">{topic?.label ?? 'Your comparison'}</p>
        <h2 id="performance-view-title" tabIndex={-1} className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{activePreset?.description}</p>
        {context && <details className="mt-1 text-xs text-gray-500 dark:text-gray-400"><summary className="cursor-pointer">About these measurements</summary><p className="mt-1">{context}</p></details>}
      </div>
      {/* Range */}
      {spec && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <select
            aria-label="Time range"
            value={activeRange ?? ''}
            onChange={(e) => {if(e.target.value){setHours(Number(e.target.value));setSpec(withRange(spec, Number(e.target.value)));}}}
            className={SELECT_CLASS}
          >
            {activeRange === null && <option value="">Custom range</option>}
            {(lifetime ? RANGES.filter(r => [720, 2160, 4320].includes(r.hours) || r.hours === activeRange) : RANGES).map((r) => (
              <option key={r.hours} value={r.hours}>
                {r.label}
              </option>
            ))}
          </select>
          {activeCurated && (
            <select
              aria-label="Comparison metric"
              value={activeMetric}
              onChange={(e) => switchMetric(e.target.value)}
              className={SELECT_CLASS}
            >
              {activeCurated.metrics.map((m) => (
                <option key={m.metric} value={m.metric}>
                  {m.label}
                </option>
              ))}
            </select>
          )}

        </div>
      )}

      {notice && <p role="status" className="mb-3 text-sm">{notice}</p>}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {result?.warnings?.map((warning) => (
        <div
          key={warning}
          className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-sm"
        >
          {warning}
        </div>
      ))}

      {isLoading && <p role="status" className="py-6 text-gray-500">Loading comparison…</p>}
      {!isLoading && result && (lifetime ? <LifetimeResults result={result} /> : <SourceSummaries result={result} />)}
      {lifetime && spec && <ConnectionEndings key={JSON.stringify(spec)} spec={spec} chartSeries={result?.series ?? []} />}
      {!isLoading && !lifetime && result?.facts && <Highlights facts={result.facts} />}
      {spec && (lifetime ? <details open={historyOpen} className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4" onToggle={e => setHistoryOpen(e.currentTarget.open)}>
        <summary className="cursor-pointer text-sm font-medium">Changes over time</summary>
        <h3 className="text-sm font-medium mt-4">{result?.intervalMinutes === 1440 ? 'Daily median reported lifetime' : 'Median lifetime by reporting period'}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Reports arrive when connections end. Gaps mean no reports; a quiet period alone does not indicate failure.</p>
        {historyOpen && <CompareGraph series={result?.series ?? []} lifetime isLoading={isLoading} onZoom={onZoom} />}
      </details> : <>
        <h3 className="text-sm font-medium mt-6 mb-2">How it changed over time</h3>
        <CompareGraph series={result?.series ?? []} isLoading={isLoading} onZoom={onZoom} />
      </>)}

      {spec && <RecordedErrors spec={spec} chartSeries={result?.series ?? []} />}

      {result?.facts?.series?.length > 0 && <details className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
        <summary className="cursor-pointer text-sm font-medium">Detailed statistics</summary>
        <FactsTable facts={result.facts} />
      </details>}
      {AI_COMPARE_ENABLED && result?.facts?.series?.length > 0 && <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium">AI explanation</summary>
        <p className="text-xs text-gray-500 mt-2">Optional context from the chart statistics and measurement notes. Lifetime summaries above describe reports across the whole window.</p>
        {!narrationRequested && <button type="button" className={`${SELECT_CLASS} mt-3`} onClick={() => setNarrationRequested(true)}>Explain these results</button>}
        {narrating && <p role="status" className="mt-3 text-sm">Writing explanation…</p>}
        {narration && <p className="mt-3 text-sm">{narration}</p>}
      </details>}
      </section>
      <PerformanceDiscovery presets={presets} curated={curated} activePreset={activePreset} activeMetric={activeMetric} onSelect={applyPreset} />
      <details className="mt-8">
        <summary className="text-lg font-semibold cursor-pointer mb-4">Create your own comparison</summary>
      {/* Natural language */}
      {AI_COMPARE_ENABLED && (
        <form onSubmit={askAi} className="mb-6">
          <label htmlFor="compare-prompt" className="block text-sm font-medium mb-2">
            Ask for a comparison
          </label>
          <div className="flex gap-2">
            <input
              id="compare-prompt"
              type="text"
              value={prompt}
              onInput={(e) => setPrompt(e.target.value)}
              placeholder="e.g. compare DNS and free DNS delay over the last 2 weeks"
              maxLength={500}
              className={`${SELECT_CLASS} flex-1`}
            />
            <button
              type="submit"
              disabled={interpreting || !prompt.trim()}
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {interpreting ? 'Reading…' : 'Ask'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Interpreted by Workers AI into a query over the jobs and metrics listed below. It picks
            from that list only — it cannot invent a metric or reach anything else.
          </p>
        </form>
      )}

      <button
        type="button"
        onClick={() => setShowBuilder((v) => !v)}
        className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        {showBuilder ? 'Hide' : 'Build one manually'}
      </button>

      {showBuilder && (
        <ManualBuilder
          families={families}
          jobsByType={jobsByType}
          regions={regions}
          limits={limits}
          onBuild={(built, label) => {
            setHours(168);
            setHistoryOpen(false);
            setTitle(label);
            setActivePresetId(null);
            setSpec(built);
          }}
        />
      )}

      </details>
    </div>
  );
};

// --- Manual builder ---------------------------------------------------------

const ManualBuilder = (props) => {
  const { families, jobsByType, regions, limits, onBuild } = props;
  const [familyId, setFamilyId] = useState(families[0]?.id ?? '');
  const family = families.find((f) => f.id === familyId) ?? families[0];
  const [metricId, setMetricId] = useState(family?.metrics[0]?.id ?? '');
  const [op, setOp] = useState('median');
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState('');
  const [byRegion, setByRegion] = useState(false);

  const metric = family?.metrics.find((m) => m.id === metricId) ?? family?.metrics[0];
  const jobs = jobsByType[JOB_TYPE_BY_FAMILY[familyId]] ?? [];
  const supportsRegions = Boolean(family?.dimensions.some((d) => d.id === 'locationName'));

  // A family change invalidates both the metric and the job selection.
  useEffect(() => {
    setMetricId(family?.metrics[0]?.id ?? '');
    setSelected([]);
    setByRegion(false);
  }, [familyId]);

  const availableOps = metric ? Object.keys(metric.fields) : [];
  const effectiveOp = availableOps.includes(op) ? op : availableOps[0];

  const shown = jobs.filter((j) => !filter || `${j} ${sourceLabel(familyId, j)}`.toLowerCase().includes(filter.toLowerCase()));

  // One series per region, or one grouped series for the chosen jobs. Region
  // mode is one root field per region, so it only fits one job at a time.
  const seriesCount = byRegion ? regions.length : selected.length ? 1 : 0;
  const overBudget = byRegion && selected.length > 1;

  const build = () => {
    if (!family || !metric || selected.length === 0) return;
    const to = Date.now();
    const range = { from: new Date(to - 7 * 86400000).toISOString(), to: new Date(to).toISOString() };

    if (byRegion) {
      onBuild(
        {
          ...range,
          series: regions.map((r) => ({
            family: familyId,
            metric: metricId,
            op: effectiveOp,
            label: r.name,
            filters: { jobName: [selected[0]], locationName: r.locations },
          })),
        },
        `${sourceLabel(familyId, selected[0])} by region`
      );
      return;
    }

    onBuild(
      {
        ...range,
        series: [
          {
            family: familyId,
            metric: metricId,
            op: effectiveOp,
            groupBy: 'jobName',
            filters: { jobName: selected },
          },
        ],
      },
      selected.length === 1 ? sourceLabel(familyId, selected[0]) : `${selected.length} jobs`
    );
  };

  if (!family) return null;

  return (
    <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2 mb-3">
        <select value={familyId} onChange={(e) => setFamilyId(e.target.value)} className={SELECT_CLASS}>
          {families.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <select value={metricId} onChange={(e) => setMetricId(e.target.value)} className={SELECT_CLASS}>
          {family.metrics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <select value={effectiveOp} onChange={(e) => setOp(e.target.value)} className={SELECT_CLASS}>
          {OPS.filter((o) => availableOps.includes(o.value)).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {jobs.length > 0 ? (
        <>
          <input
            type="text"
            value={filter}
            onInput={(e) => setFilter(e.target.value)}
            placeholder="Filter jobs…"
            className={`${SELECT_CLASS} w-full mb-2`}
          />
          <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-2 mb-3">
            {shown.map((job) => (
              <label key={job} className="flex items-center gap-2 py-0.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(job)}
                  onChange={(e) =>
                    setSelected((current) =>
                      e.target.checked ? [...current, job] : current.filter((j) => j !== job)
                    )
                  }
                />
                <span title={job}>{sourceLabel(familyId, job)}<small className="block text-gray-500">{job}</small></span>
              </label>
            ))}
            {shown.length === 0 && <p className="text-sm text-gray-500">No jobs match.</p>}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          This dataset is not organized by job; use a preset or the prompt above.
        </p>
      )}

      {supportsRegions && regions.length > 1 && (
        <label className="flex items-center gap-2 mb-3 text-sm cursor-pointer">
          <input type="checkbox" checked={byRegion} onChange={(e) => setByRegion(e.target.checked)} />
          <span>Split by probe region ({regions.length} series)</span>
        </label>
      )}

      {overBudget && (
        <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
          Splitting by region uses one query per region, so it works with a single job at a time.
          Pick one, or turn the split off.
        </p>
      )}
      {seriesCount > limits.maxRootFields && (
        <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
          That is {seriesCount} series; the endpoint allows {limits.maxRootFields} per request.
        </p>
      )}

      <button
        type="button"
        onClick={build}
        disabled={selected.length === 0 || overBudget || seriesCount > limits.maxRootFields}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Compare
      </button>
    </div>
  );
};

// --- Facts ------------------------------------------------------------------

const FactsTable = ({ facts }) => (
  <div className="mt-6 overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <th className="py-2 pr-4 font-medium">Series</th>
          <th className="py-2 pr-4 font-medium">Typical value</th>
          <th className="py-2 pr-4 font-medium">Min</th>
          <th className="py-2 pr-4 font-medium">Max</th>
          <th className="py-2 pr-4 font-medium">p10–p90</th>
          <th className="py-2 pr-4 font-medium">Trend</th>
          <th className="py-2 font-medium">Chart points</th>
        </tr>
      </thead>
      <tbody>
        {(highlights(facts)?.ranked ?? facts.series.map((s, index) => ({ ...s, index }))).map((s) => (
          <tr key={s.label} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 pr-4"><span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: compareColor(s.label, s.index) }} /><CompareTooltip label={s.sourceId}>{s.label}</CompareTooltip></td>
            <td className="py-2 pr-4"><Value value={s.typical} unit={s.unit} /></td>
            <td className="py-2 pr-4"><Value value={s.min} unit={s.unit} /></td>
            <td className="py-2 pr-4"><Value value={s.max} unit={s.unit} /></td>
            <td className="py-2 pr-4">
              <Value value={s.p10} unit={s.unit} /> – <Value value={s.p90} unit={s.unit} />
            </td>
            <td className="py-2 pr-4">
              {s.trendPercent === null ? '—' : `${s.trendPercent > 0 ? '+' : ''}${s.trendPercent}%`}
            </td>
            <td className="py-2">{s.buckets}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
      Each chart point summarizes readings over a period of time. “Typical value” is the median of those displayed values, not the median of individual runs.
    </p>
  </div>
);

function Value({ value, unit }) {
  return <CompareTooltip label={rawValue(value,unit)}>{formatValue(value,unit)}</CompareTooltip>;
}
function Highlights({ facts }) {
  const h = highlights(facts);
  if (!h) {
    const series = facts.series;
    const reason = series.some(s => !s.buckets) ? 'Some sources have no plotted reports in this window.'
      : series.some(s => s.direction === 'neutral') ? 'Capacity and observation counts are descriptive measurements.'
      : new Set(series.map(s => s.comparisonKey)).size > 1 ? 'These measurements cover different workloads or purposes; compare their context alongside the values.'
      : series.some(s => !s.rankingEligible) ? ''
      : 'There are too few readings from matching time periods to compare these sources reliably.';
    return reason ? <p className="my-4 text-sm text-gray-500 dark:text-gray-400">{reason}</p> : null;
  }
  if (h.weakSeparation) return <p className="my-4 text-sm text-gray-500 dark:text-gray-400">{h.spread === 0 ? "Typical value values are equal in this window." : "Typical value values differ by less than 2% in this window."}</p>;
  return <div className="my-4 grid gap-3 sm:grid-cols-3 text-sm">
    <p><strong>{h.best.length > 1 ? 'Best typical value (tie)' : 'Best typical value'}</strong><br />{h.best.map(s => s.label).join(', ')} · <Value value={h.best[0].typical} unit={h.best[0].unit} /></p>
    <p><strong>Typical-value spread</strong><br /><Value value={h.spread} unit={h.best[0].unit} />{h.spread === 0 && ' · No separation'}</p>
    <p><strong>Most consistent{h.consistent.length > 1 ? ' (tie)' : ''}</strong><br />{h.consistent.map(s => s.label).join(', ')}<br />Smallest range for the middle 80% of chart values</p>
  </div>;
}
function ExperimentFields({ fields }) {
  const workloadKeys=new Set(['operation','payload','access','backend','cache','probes']);
  const preparationKeys=new Set(['warmup','connection','network','requests']);
  const groups=fields.some(d=>workloadKeys.has(d.key)||preparationKeys.has(d.key))
    ? [['Measured operation',fields.filter(d=>workloadKeys.has(d.key))],['Preparation',fields.filter(d=>preparationKeys.has(d.key))],['Configuration',fields.filter(d=>!workloadKeys.has(d.key)&&!preparationKeys.has(d.key))]]
    : [['',fields]];
  return <>{groups.filter(([,rows])=>rows.length).map(([group,rows])=><div key={group} className="mt-2">
    {group && <p className="font-semibold mb-1">{group}</p>}
    <dl className="space-y-1">{rows.map(d=><div key={d.key}><dt className="font-medium inline">{d.label}: </dt><dd className="inline">
      {d.locations ? <details className="inline"><summary className="inline cursor-pointer underline decoration-dotted">{d.value}</summary><span className="block mt-1">{d.locations.join(', ')}</span></details> : d.value}
      {d.key === 'plan' && <> · <a className="underline" href="/routing/">Workers routing</a></>}
    </dd></div>)}</dl>
  </div>)}</>;
}
function SourceSummaries({ result }) {
  const rows = result.facts?.series ?? [];
  if (!rows.length) return <p className="my-5 text-sm">No reports in this window.</p>;
  const display = comparisonPresentation(rows);
  return <div className="my-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 items-stretch">
    {rows.map((s, index) => {
      const view=display.sources[index];
      const limitedHistory=limitedBenchmarkHistory(s);
      const colorIndex = result.series.findIndex(line => line.sourceId === s.sourceId && line.label === s.label);
      const movement=s.buckets === 0 ? 'No readings in this window' : s.min === s.max ? 'No movement' : s.typical !== null && s.typical !== 0 && (s.max - s.min) / Math.abs(s.typical) < 0.02 ? 'Less than 2% movement' : '';
      return <article data-source-id={s.sourceId} key={`${s.sourceId}:${index}`} className="compare-summary-card min-w-0 flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 p-2.5">
        <h3 className="text-sm font-medium break-words"><span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: compareColor(s.label, colorIndex < 0 ? index : colorIndex) }} /><CompareTooltip label={`${s.label} — ${s.sourceId}`}>{view.label}</CompareTooltip></h3>
        <p className="text-lg font-semibold mt-1"><Value value={s.typical} unit={s.unit} /><span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">Typical value</span></p>
        <p className="compare-summary-status text-xs leading-4 min-h-4 text-gray-500 dark:text-gray-400">{[limitedHistory && 'Limited history', movement].filter(Boolean).join(' · ')}</p>
        <details className="text-xs mt-auto pt-1 text-gray-600 dark:text-gray-300">
          <summary className="cursor-pointer">Details</summary>
          {limitedHistory && <p className="mt-2">Fewer than five chart points. These summarize reports, not individual runs.</p>}
          <ExperimentFields fields={view.details} />
          {view.narrowed && <p className="mt-2">Job coverage: {view.configured?.join(', ') ?? 'All enabled locations'}</p>}
          {view.note && <p className="mt-2"><strong>{s.benchmark ? "Observed example" : "Interpretation"}: </strong>{view.note}</p>}
          <p className="mt-1 break-all">Source: {s.sourceId}</p>
        </details>
      </article>;
    })}
    </div>
    {rows.some(s=>s.comparisonKey?.startsWith('yabs:')) && <details className="mt-3 text-xs text-gray-600 dark:text-gray-300">
      <summary className="cursor-pointer">How these benchmarks run</summary>
      {BENCHMARK_METHOD.map(text=><p key={text} className="mt-2">{text}</p>)}
    </details>}
    {display.shared.length > 0 && <details className="mt-3 text-xs text-gray-600 dark:text-gray-300">
      <summary className="cursor-pointer">Shared settings</summary>
      <ExperimentFields fields={display.shared} />
    </details>}
    {display.sources.some(s=>s.narrowed) && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">This comparison uses shared probe locations. Job coverage is listed in Details.</p>}
    {rows.some(s=>s.experiment) && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Probe locations describe comparison coverage; not every location necessarily reported data.</p>}
  </div>;
}
export default CompareExplorer;
