import { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min'
import { isDarkMode, themeColors, baseLayout, axis, themeRelayout } from './chartTheme';
import { completeBuckets } from './analytics';

// Success-rate-over-time graph for a single job (used on AI job detail pages).
// Fetches the /successrate endpoint and plots % successful runs per bucket on a
// fixed 0–100% axis. Window capped at 31 days (the endpoint reads the raw runs
// table, so longer ranges are rejected server-side).

const SELECT_OPTIONS = [
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 hours' },
  { value: 72 * 60 * 60 * 1000, label: 'Last 72 hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 days' },
  { value: 14 * 24 * 60 * 60 * 1000, label: 'Last 14 days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 days' },
];

// Threshold band ([line, fill]) for a success-rate value: green >=90, orange <90, red <80.
function band(y) {
  if (y == null) return { line: '#9ca3af', fill: 'rgba(156,163,175,0.10)' };
  if (y < 80) return { line: '#ef4444', fill: 'rgba(239,68,68,0.15)' };
  if (y < 90) return { line: '#f59e0b', fill: 'rgba(245,158,11,0.14)' };
  return { line: '#10b981', fill: 'rgba(16,185,129,0.12)' };
}

async function fetchSuccessRate(jobName, start, end) {
  const datetimeNow = new Date(Date.now());
  const startParam = new Date(start).toISOString();
  let endParam = new Date(end).toISOString();
  if (new Date(end) > datetimeNow) endParam = datetimeNow.toISOString();

  const encJob = jobName.replaceAll('/', '%2F');
  const url = `https://delay.cloudflare.chaika.me/v2/jobs/${encJob}/successrate` +
    `?StartDateTime=${startParam}&EndDateTime=${endParam}`;
  {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Chart request failed (${resp.status})`);
    const json = await resp.json();
    return completeBuckets(json.data, new Date(startParam).getTime(), new Date(endParam).getTime())
      .map(point => ({
        x: new Date(point.timePeriod).getTime(),
        y: point.successRate,
        total: point.totalCount,
      }));
  }
}

const SuccessRateGraph = (props) => {
  const { jobName, label } = props;
  const plotRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeRange, setTimeRange] = useState(24 * 60 * 60 * 1000);

  useEffect(() => {
    let alive = true;
    const endDate = Date.now();
    const startDate = endDate - timeRange;
    setIsLoading(true);
    setLoadError(false);
    setPoints([]);
    fetchSuccessRate(jobName, startDate, endDate)
      .then(data => { if (alive) { setPoints(data); setIsLoading(false); } })
      .catch(() => { if (alive) { setLoadError(true); setIsLoading(false); } });
    return () => { alive = false; };
  }, [jobName, timeRange]);

  useEffect(() => {
    if (!plotRef.current) return;
    const isDark = isDarkMode();

    const endDate = new Date();
    const xRange = [new Date(endDate.getTime() - timeRange), endDate];

    const valid = points.filter(p => p.y != null);

    // One line+fill trace per segment, colored by the worse of its two endpoints,
    // so the line/area turns orange under 90% and red under 80%.
    const segments = [];
    for (let i = 0; i < valid.length - 1; i++) {
      const a = valid[i];
      const b = valid[i + 1];
      const c = band(Math.min(a.y, b.y));
      segments.push({
        x: [new Date(a.x), new Date(b.x)],
        y: [a.y, b.y],
        type: 'scatter',
        mode: 'lines',
        line: { shape: 'linear', width: 2.5, color: c.line },
        fill: 'tozeroy',
        fillcolor: c.fill,
        hoverinfo: 'skip',
        showlegend: false,
      });
    }

    // Markers carry the hover (and emphasize each bucket), colored per-point by band.
    const markerTrace = {
      x: valid.map(p => new Date(p.x)),
      y: valid.map(p => p.y),
      type: 'scatter',
      mode: 'markers',
      marker: { size: 5, color: valid.map(p => band(p.y).line) },
      showlegend: false,
      hovertemplate: `Time: %{x}<br>Success: %{y:.1f}%<br>Runs: %{customdata}<extra></extra>`,
      customdata: valid.map(p => p.total),
    };

    const layout = {
      ...baseLayout(isDark),
      title: {
        text: `${label} - Success Rate`,
        font: { size: 16, color: themeColors(isDark).textStrong }
      },
      xaxis: axis(isDark, { title: 'Time', type: 'date', range: xRange }),
      yaxis: axis(isDark, {
        title: 'Success %',
        range: [0, 101],
        ticksuffix: '%',
        fixedrange: true,
      }),
      shapes: [
        { type: 'line', xref: 'paper', x0: 0, x1: 1, yref: 'y', y0: 90, y1: 90, line: { color: '#f59e0b', width: 1, dash: 'dot' }, opacity: 0.6 },
        { type: 'line', xref: 'paper', x0: 0, x1: 1, yref: 'y', y0: 80, y1: 80, line: { color: '#ef4444', width: 1, dash: 'dot' }, opacity: 0.6 },
      ],
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'resetScale2d', 'zoom2d'],
      displaylogo: false
    };

    const node = plotRef.current;
    const observer = new ResizeObserver(() => { if (node._fullLayout) Plotly.Plots.resize(node); });
    observer.observe(node);
    Plotly.newPlot(node, [...segments, markerTrace], layout, config);
    return () => { observer.disconnect(); Plotly.purge(node); };
  }, [points, label, timeRange]);

  useEffect(() => {
    function handleThemeChange() {
      if (!plotRef.current) return;
      Plotly.relayout(plotRef.current, themeRelayout(isDarkMode()));
    }
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <select aria-label="Time range"
          value={timeRange}
          onChange={event => setTimeRange(Number(event.target.value))}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {SELECT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div role="status" className="chart-state">{isLoading ? 'Loading chart…' : loadError ? 'Chart unavailable. Try another range or reload.' : !points.some(p => p.y != null) ? 'No readings in this period.' : null}</div>
      <div ref={plotRef} aria-busy={isLoading} style={{ height: 'var(--monitor-chart-height)', width: '100%' }} />
    </div>
  );
};

export default SuccessRateGraph;
