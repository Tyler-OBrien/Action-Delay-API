import { formatDuration as formatTime } from '../../lib/duration';
import { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min'
import { isDarkMode, themeColors, baseLayout, axis, themeRelayout } from './chartTheme';
import { seriesFromResponse } from './analytics';

// Per-location multi-line latency graph. Like RegionGraph, but one line per edge
// location (PoP) instead of per region — used on AI job detail pages, where a job
// runs from a small fixed set of locations. Self-contained: fetches the job's
// location list, then a time-series per location, and drops locations with no data.

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 hours' },
  { value: 12 * 60 * 60 * 1000, label: 'Last 12 hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 hours' },
  { value: 72 * 60 * 60 * 1000, label: 'Last 72 hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 days' },
  { value: 14 * 24 * 60 * 60 * 1000, label: 'Last 14 days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 days' },
  { value: 3 * 30 * 24 * 60 * 60 * 1000, label: 'Last 3 months' },
  { value: Number.MAX_VALUE, label: 'All data' },
];

const SELECT_DISPLAY_OPTIONS = [
  { value: "MedianApiResponseLatency", label: "Median Latency" },
  { value: "AvgApiResponseLatency", label: "Average Latency" },
  { value: "MinApiResponseLatency", label: "Min Latency" },
  { value: "MaxApiResponseLatency", label: "Max Latency" },
];

// Distinct line colors, assigned by location index.
const LOCATION_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];



async function fetchLocations(jobName) {
  const encJob = jobName.replaceAll('/', '%2F');
  {
    const resp = await fetch(`https://delay.cloudflare.chaika.me/v2/jobs/${encJob}/locations`);
    if (!resp.ok) throw new Error(`Chart request failed (${resp.status})`);
    const json = await resp.json();
    return (json.data ?? []).map(l => l.locationName).filter(Boolean);
  }
}

async function fetchLocationData(jobName, location, start, end, metric) {
  const datetimeNow = new Date(Date.now());
  const startParam = start ? new Date(start).toISOString() : new Date(2023, 8).toISOString();
  let endParam = end ? new Date(end).toISOString() : datetimeNow.toISOString();
  if (new Date(end) > datetimeNow) endParam = datetimeNow.toISOString();

  const encJob = jobName.replaceAll('/', '%2F');
  const url = `https://delay.cloudflare.chaika.me/v2/jobs/${encJob}/locations/${location}/analytics` +
    `?StartDateTime=${startParam}&EndDateTime=${endParam}&Metrics=${metric}`;
  {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Chart request failed (${resp.status})`);
    const json = await resp.json();
    return seriesFromResponse(
      json.data,
      metric,
      new Date(startParam).getTime(),
      new Date(endParam).getTime()
    );
  }
}

const LocationGraph = (props) => {
  const { jobName, label, defaultMetric = 'MedianApiResponseLatency' } = props;
  const plotRef = useRef(null);
  const [hidden, setHidden] = useState(new Set());

  const defaultOptionObj = SELECT_DISPLAY_OPTIONS.find(o => o.value === defaultMetric) ?? SELECT_DISPLAY_OPTIONS[0];

  const [locations, setLocations] = useState([]);
  const [locData, setLocData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeRange, setTimeRange] = useState(7 * 24 * 60 * 60 * 1000);
  const [customTimeRange, setCustomTimeRange] = useState(null);
  const [customTimeRangeObj, setCustomTimeRangeObj] = useState(null);
  const [displayOption, setDisplayOption] = useState(defaultOptionObj.value);
  const [displayOptionLabel, setDisplayOptionLabel] = useState(defaultOptionObj.label);

  // Fetch the job's location list once.
  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    setLoadError(false);
    setLocations([]);
    setLocData({});
    fetchLocations(jobName).then(locs => { if (alive) { setLocations(locs); if (!locs.length) setIsLoading(false); } }).catch(() => { if (alive) { setLoadError(true); setIsLoading(false); } });
    return () => { alive = false; };
  }, [jobName]);

  // Fetch per-location time-series whenever range / metric / locations change.
  useEffect(() => {
    if (locations.length === 0) return;
    let active = true;
    let endDate = Date.now();
    let startDate = null;
    if (customTimeRangeObj != null) {
      startDate = customTimeRangeObj.min;
      endDate = customTimeRangeObj.max;
    } else {
      startDate = timeRange === Number.MAX_VALUE ? null : endDate - timeRange;
    }

    setIsLoading(true);
    setLoadError(false);
    setLocData({});
    Promise.all(locations.map(loc => fetchLocationData(jobName, loc, startDate, endDate, displayOption)))
      .then(results => {
        if (!active) return;
        const data = {};
        locations.forEach((loc, i) => { data[loc] = results[i]; });
        setLocData(data);
        setIsLoading(false);
      })
      .catch(() => { if (active) { setLoadError(true); setIsLoading(false); } });
    return () => { active = false; };
  }, [locations, timeRange, displayOption, customTimeRangeObj, jobName]);

  useEffect(() => {
    if (!plotRef.current) return;

    const isDark = isDarkMode();
    // Only locations that actually returned data.
    const activeLocs = locations.filter(loc => (locData[loc] ?? []).length > 0);

    let xRange = null;
    if (customTimeRangeObj) {
      xRange = [new Date(customTimeRangeObj.min), new Date(customTimeRangeObj.max)];
    } else if (timeRange !== Number.MAX_VALUE) {
      const endDate = new Date();
      xRange = [new Date(endDate.getTime() - timeRange), endDate];
    }

    const traces = activeLocs.map((loc, i) => {
      const points = locData[loc] ?? [];
      const y = points.map(p => p.y);
      const color = LOCATION_COLORS[locations.indexOf(loc) % LOCATION_COLORS.length];
      return {
        x: points.map(p => new Date(p.x)),
        y,
        type: 'scatter',
        mode: 'lines+markers',
        name: loc,
        visible: hidden.has(loc) ? 'legendonly' : true,
        line: { shape: 'spline', width: 2, color },
        marker: { size: 4, color },
        connectgaps: true,
        hovertemplate: `<b>${loc}</b><br>Time: %{x}<br>Latency: %{customdata}<br>Raw: %{y:,.3f} ms<extra></extra>`,
        customdata: y.map(v => formatTime(v)),
      };
    });

    const allY = activeLocs.flatMap(loc => (locData[loc] ?? []).map(p => p.y)).filter(v => v > 0);
    let unit = 'ms', divisor = 1;
    if (allY.length > 0) {
      const maxY = Math.max(...allY);
      if (maxY >= 3600000) { unit = 'h'; divisor = 3600000; }
      else if (maxY >= 60000) { unit = 'min'; divisor = 60000; }
      else if (maxY >= 1000) { unit = 's'; divisor = 1000; }
    }

    const yTicks = allY.length > 0 ? (() => {
      const minY = Math.min(...allY);
      const maxY = Math.max(...allY);
      const range = maxY - minY;
      const numTicks = 8;
      const tickvals = [], ticktext = [];
      for (let i = 0; i <= numTicks; i++) {
        const val = minY + (range * i / numTicks);
        tickvals.push(val);
        ticktext.push(`${(val / divisor).toFixed(divisor === 1 ? 0 : 2)} ${unit}`);
      }
      return { tickvals, ticktext };
    })() : {};

    const layout = {
      ...baseLayout(isDark),
      showlegend: false,
      title: {
        text: '',
        font: { size: 16, color: themeColors(isDark).textStrong }
      },
      xaxis: axis(isDark, { title: 'Time', type: 'date', range: xRange }),
      yaxis: axis(isDark, {
        title: 'Latency',
        tickmode: allY.length > 0 ? 'array' : 'auto',
        fixedrange: true,
        ...yTicks,
      }),
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'resetScale2d', 'zoom2d'],
      displaylogo: false
    };

    const node = plotRef.current;
    let disposed = false;
    const observer = new ResizeObserver(() => { if (node._fullLayout) Plotly.Plots.resize(node); });
    observer.observe(node);
    Plotly.newPlot(node, traces, layout, config).then(() => {
      if (disposed) return;
      node.on('plotly_relayout', (eventData) => {
        if (eventData['xaxis.range[0]'] && eventData['xaxis.range[1]']) {
          const minDate = new Date(eventData['xaxis.range[0]']);
          const maxDate = new Date(eventData['xaxis.range[1]']);
          const timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
          if (Math.ceil(timeDiff / 1000) < 5 * 60) return;

          setCustomTimeRangeObj({ min: minDate.getTime(), max: maxDate.getTime() });
          const fmt = d => `${d.toLocaleString("default", { month: 'short' })} ${d.getDate()} ${d.toLocaleTimeString('default', {
            hour: "2-digit", minute: "2-digit",
            hour12: navigator.language === 'en-US' || Intl.DateTimeFormat().resolvedOptions().hour12
          })}`;
          setTimeRange("custom");
          setCustomTimeRange(`${fmt(minDate)} → ${fmt(maxDate)}`);
        }
      });
    });
    return () => { disposed = true; observer.disconnect(); Plotly.purge(node); };
  }, [hidden, locData, locations, displayOptionLabel, label, timeRange, customTimeRangeObj]);

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
      <h3 className="text-base font-semibold mb-3">{displayOptionLabel}</h3>
      <div className="flex gap-2 mb-4">
        <select aria-label="Time range"
          value={timeRange}
          onChange={event => {
            setCustomTimeRange(null);
            setCustomTimeRangeObj(null);
            setTimeRange(Number(event.target.value));
          }}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {SELECT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
          {customTimeRange && (
            <option value="custom">{customTimeRange}</option>
          )}
        </select>

        <select aria-label="Metric"
          value={displayOption}
          onChange={event => {
            setDisplayOption(event.target.value);
            setDisplayOptionLabel(SELECT_DISPLAY_OPTIONS.find(o => o.value === event.target.value).label);
          }}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {SELECT_DISPLAY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <ul className="chart-legend" aria-label="Chart series">
        {locations.filter(loc => (locData[loc] ?? []).length).map(loc => <li key={loc}>
          <button type="button" aria-pressed={!hidden.has(loc)} onClick={() => setHidden(previous => { const next = new Set(previous); next.has(loc) ? next.delete(loc) : next.add(loc); return next; })}>
            <span aria-hidden="true" style={{backgroundColor: LOCATION_COLORS[locations.indexOf(loc) % LOCATION_COLORS.length]}} />{loc}
          </button>
        </li>)}
      </ul>
      <div role="status" className="chart-state">{isLoading ? 'Loading chart…' : loadError ? 'Chart unavailable. Try another range or reload.' : !Object.values(locData).some(points => points.some(p => p.y != null)) ? 'No readings in this period.' : null}</div>
      <div ref={plotRef} aria-busy={isLoading} style={{ height: 'var(--monitor-chart-height)', width: '100%' }} />
    </div>
  );
};

export default LocationGraph;
