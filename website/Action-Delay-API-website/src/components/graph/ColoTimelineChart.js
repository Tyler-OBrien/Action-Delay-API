import { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import { isDarkMode, baseLayout, axis } from './chartTheme';

const PALETTE = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4',
  '#42d4f4', '#f032e6', '#bfef45', '#469990', '#dcbeff',
  '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1',
  '#000075', '#a9a9a9', '#e6beff', '#fabebe', '#008080',
];

const JOB_OPTIONS = [
  { value: 'cloudflare-worker-uncached-10kb-free-plan',     label: 'Free Plan' },
  { value: 'cloudflare-worker-uncached-10kb-pro-plan',      label: 'Pro Plan' },
  { value: 'cloudflare-worker-uncached-10kb-business-plan', label: 'Business Plan' },
  { value: 'cloudflare-worker-uncached-10kb',               label: 'Enterprise' },
  { value: 'cloudflare-worker-uncached-10kb-argo',          label: 'Argo Addon' },
  { value: 'cloudflare-worker-uncached-10kb-spectrum',      label: 'Enterprise Spectrum HTTP' },
];

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000,           label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000,       label: 'Last 6 Hours' },
  { value: 12 * 60 * 60 * 1000,      label: 'Last 12 Hours' },
  { value: 24 * 60 * 60 * 1000,      label: 'Last 24 Hours' },
  { value: 72 * 60 * 60 * 1000,      label: 'Last 72 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000,  label: 'Last 7 Days' },
  { value: 14 * 24 * 60 * 60 * 1000, label: 'Last 14 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' },
];

const ColoTimelineChart = ({ locationName }) => {
  const plotRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState('cloudflare-worker-uncached-10kb-free-plan');
  const [timeRange, setTimeRange] = useState(7 * 24 * 60 * 60 * 1000);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [coloMap, setColoMap] = useState({});
  const [niceNameMap, setNiceNameMap] = useState({});
  const [points, setPoints] = useState([]);
  const [customTimeRangeObj, setCustomTimeRangeObj] = useState(null);
  const [customTimeRange, setCustomTimeRange] = useState(null);

  useEffect(() => {
    setIsDark(isDarkMode());
    const handler = () => setIsDark(isDarkMode());
    window.addEventListener('themeChange', handler);
    return () => window.removeEventListener('themeChange', handler);
  }, []);

  // Fetch colo metadata once on mount — static data, no need to re-fetch
  useEffect(() => {
    fetch('https://delay.cloudflare.chaika.me/v2/colos')
      .then(r => r.json())
      .then(data => {
        const map = {};
        const nameMap = {};
        for (const colo of (data?.results ?? [])) {
          map[colo.ID] = colo.IATA ?? String(colo.ID);
          if (colo.IATA && colo.niceName) nameMap[colo.IATA] = colo.niceName;
        }
        setColoMap(map);
        setNiceNameMap(nameMap);
      })
      .catch(() => {});
  }, []);

  // Effect 2: fetch analytics — does NOT depend on coloMap
  useEffect(() => {
    if (!locationName) return;
    setIsLoading(true);

    let startDate, endDate;
    if (customTimeRangeObj) {
      startDate = new Date(customTimeRangeObj.min);
      endDate   = new Date(customTimeRangeObj.max);
    } else {
      endDate   = new Date();
      startDate = new Date(endDate.getTime() - timeRange);
    }
    const start = startDate.toISOString();
    const end = endDate.toISOString();

    fetch(`https://delay.cloudflare.chaika.me/v2/jobs/${encodeURIComponent(selectedJob)}/locations/${encodeURIComponent(locationName)}/coloanalytics?StartDateTime=${start}&EndDateTime=${end}&MaxPoints=200`)
      .then(r => r.json())
      .then(data => setPoints(data?.data?.points ?? []))
      .catch(err => {
        console.error('ColoTimelineChart fetch error:', err);
        setPoints([]);
      })
      .finally(() => setIsLoading(false));
  }, [locationName, selectedJob, timeRange, customTimeRangeObj]);

  // Effect 3: render plot — pure derivation, no fetch
  useEffect(() => {
    if (!plotRef.current) return;

    // Group by coloId, then re-group by IATA name (multiple IDs can share the same IATA)
    const byColoId = {};
    for (const pt of points) {
      if (!byColoId[pt.coloId]) byColoId[pt.coloId] = [];
      byColoId[pt.coloId].push(pt);
    }

    // Filter out invalid IDs (0, negative, or unmapped) then group by IATA
    const validColoIds = Object.keys(byColoId).map(Number).filter(id => id > 0 && coloMap[id]);
    const byIATA = {};
    for (const coloId of validColoIds) {
      const iata = coloMap[coloId];
      if (!byIATA[iata]) byIATA[iata] = {};
      for (const pt of byColoId[coloId]) {
        const key = pt.timePeriod;
        if (!byIATA[iata][key]) {
          byIATA[iata][key] = { timePeriod: pt.timePeriod, runCount: 0, medianLatency: 0, avgLatency: 0 };
        }
        const existing = byIATA[iata][key];
        const totalRuns = existing.runCount + pt.runCount;
        if (totalRuns > 0) {
          existing.medianLatency = (existing.medianLatency * existing.runCount + pt.medianLatency * pt.runCount) / totalRuns;
          existing.avgLatency    = (existing.avgLatency    * existing.runCount + pt.avgLatency    * pt.runCount) / totalRuns;
        }
        existing.runCount = totalRuns;
      }
    }

    const iataRunCounts = {};
    for (const iata of Object.keys(byIATA)) {
      iataRunCounts[iata] = Object.values(byIATA[iata]).reduce((sum, p) => sum + p.runCount, 0);
    }
    const grandTotal = Object.values(iataRunCounts).reduce((sum, n) => sum + n, 0);

    const sortedIATAs = Object.keys(byIATA).sort();
    const traces = sortedIATAs.map((iata, i) => {
      const buckets = Object.values(byIATA[iata]).sort((a, b) => new Date(a.timePeriod) - new Date(b.timePeriod));
      const c = PALETTE[i % PALETTE.length];
      const pct = grandTotal > 0 ? (iataRunCounts[iata] / grandTotal * 100).toFixed(1) : '?';
      const niceName = niceNameMap[iata] ? `${niceNameMap[iata]} (${iata})` : iata;
      const label = `${niceName} — ${pct}%`;
      return {
        type: 'scatter',
        mode: 'lines+markers',
        name: label,
        x: buckets.map(p => p.timePeriod),
        y: buckets.map(p => Math.round(p.medianLatency)),
        line: { color: c, width: 2 },
        marker: { size: 4, color: c },
        customdata: buckets.map(p => [iata, p.runCount, Math.round(p.avgLatency)]),
        hovertemplate: '<b>%{customdata[0]}</b><br>Median Latency: %{y} ms<br>Avg Latency: %{customdata[2]} ms<br>Run Count: %{customdata[1]}<br>%{x}<extra></extra>',
      };
    });

    const layout = {
      ...baseLayout(isDark),
      height: 300,
      margin: { l: 60, r: 20, t: 10, b: 50 },
      xaxis: axis(isDark, { type: 'date' }),
      yaxis: axis(isDark, { title: { text: 'Latency (ms)', font: { size: 11 } }, ticksuffix: ' ms' }),
      showlegend: true,
    };

    Plotly.newPlot(plotRef.current, traces, layout, { responsive: true, displayModeBar: false, scrollZoom: true })
      .then(() => {
        plotRef.current.on('plotly_relayout', (eventData) => {
          if (eventData['xaxis.range[0]'] && eventData['xaxis.range[1]']) {
            const minDate = new Date(eventData['xaxis.range[0]']);
            const maxDate = new Date(eventData['xaxis.range[1]']);
            if (Math.ceil(Math.abs(maxDate - minDate) / 1000) < 5 * 60) return;

            setCustomTimeRangeObj({ min: minDate.getTime(), max: maxDate.getTime() });
            setTimeRange('custom');
            const fmt = (d) => `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} ${d.toLocaleTimeString('default', {
              hour: '2-digit', minute: '2-digit',
              hour12: navigator.language === 'en-US' || Intl.DateTimeFormat().resolvedOptions().hour12,
            })}`;
            setCustomTimeRange(`${fmt(minDate)} → ${fmt(maxDate)}`);
          }
        });
      });
  }, [points, coloMap, niceNameMap, isDark]);

  return (
    <div class="w-full">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded p-1.5"
        >
          {JOB_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={timeRange}
          onChange={(e) => {
            setCustomTimeRange(null);
            setCustomTimeRangeObj(null);
            setTimeRange(Number(e.target.value));
          }}
          class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded p-1.5"
        >
          {SELECT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
          {customTimeRange && (
            <option value="custom">{customTimeRange}</option>
          )}
        </select>
        {isLoading && <span class="text-xs text-gray-400 animate-pulse">Loading...</span>}
      </div>
      <div ref={plotRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default ColoTimelineChart;
