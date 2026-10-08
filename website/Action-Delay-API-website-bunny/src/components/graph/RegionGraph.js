import { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min'
import { isDarkMode, themeColors, baseLayout, axis, themeRelayout, REGION_COLORS } from './chartTheme';

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 Hours' },
  { value: 12 * 60 * 60 * 1000, label: 'Last 12 Hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 Hours' },
  { value: 72 * 60 * 60 * 1000, label: 'Last 72 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 Days' },
  { value: 14 * 24 * 60 * 60 * 1000, label: 'Last 14 Days' },
  { value: 21 * 24 * 60 * 60 * 1000, label: 'Last 21 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' },
  { value: 3 * 30 * 24 * 60 * 60 * 1000, label: 'Last 3 Months' },
  { value: 6 * 30 * 24 * 60 * 60 * 1000, label: 'Last 6 Months' },
  { value: 12 * 30 * 24 * 60 * 60 * 1000, label: 'Last Year' },
  { value: Number.MAX_VALUE, label: 'All Data' },
];

const SELECT_DISPLAY_OPTIONS = [
  { value: "MedianRunLength", label: "Median Job Time" },
  { value: "AvgRunLength", label: "Average Job Time" },
  { value: "MinRunLength", label: "Min Job Time" },
  { value: "MaxRunLength", label: "Max Job Time" },
];

const REGIONS = ['NA', 'EU', 'AS', 'OC', 'SA'];

function formatTime(ms) {
  if (typeof ms !== 'number' || !isFinite(ms)) return ms;
  if (ms < 1000) return ms.toFixed(0) + ' ms';
  let seconds = ms / 1000;
  if (seconds < 60) return seconds.toFixed(2) + ' s';
  let minutes = seconds / 60;
  if (minutes < 60) return minutes.toFixed(2) + ' min';
  return (minutes / 60).toFixed(2) + ' h';
}

async function fetchRegionData(jobName, region, start, end, metric) {
  const datetimeNow = new Date(Date.now());
  const startParam = start ? new Date(start).toISOString() : new Date(2023, 8).toISOString();
  let endParam = end ? new Date(end).toISOString() : datetimeNow.toISOString();
  if (new Date(end) > datetimeNow) endParam = datetimeNow.toISOString();

  const url = `https://api.bunny.chaika.me/v2/jobs/${jobName}/locations/region/${region}/analytics` +
    `?StartDateTime=${startParam}&EndDateTime=${endParam}&Metrics=${metric}`;
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    return (json.data?.points ?? []).map(point => ({
      x: new Date(point.timePeriod).getTime(),
      y: point[metric] ?? point[metric.charAt(0).toLowerCase() + metric.slice(1)] ?? 0,
    }));
  } catch {
    return [];
  }
}

const RegionGraph = (props) => {
  const { jobName, label, defaultMetric = 'MedianRunLength' } = props;
  const plotRef = useRef(null);

  const defaultOptionObj = SELECT_DISPLAY_OPTIONS.find(o => o.value === defaultMetric) ?? SELECT_DISPLAY_OPTIONS[0];

  const [regionData, setRegionData] = useState({ NA: [], EU: [], AS: [], OC: [], SA: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(24 * 60 * 60 * 1000);
  const [customTimeRange, setCustomTimeRange] = useState(null);
  const [customTimeRangeObj, setCustomTimeRangeObj] = useState(null);
  const [displayOption, setDisplayOption] = useState(defaultOptionObj.value);
  const [displayOptionLabel, setDisplayOptionLabel] = useState(defaultOptionObj.label);

  useEffect(() => {
    let endDate = Date.now();
    let startDate = null;
    if (customTimeRangeObj != null) {
      startDate = customTimeRangeObj.min;
      endDate = customTimeRangeObj.max;
    } else {
      startDate = timeRange === Number.MAX_VALUE ? null : endDate - timeRange;
    }

    setIsLoading(true);
    setRegionData({ NA: [], EU: [], AS: [], OC: [], SA: [] });

    Promise.all(REGIONS.map(region => fetchRegionData(jobName, region, startDate, endDate, displayOption)))
      .then(results => {
        const data = {};
        REGIONS.forEach((region, i) => { data[region] = results[i]; });
        setRegionData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [timeRange, displayOption, customTimeRangeObj, jobName]);

  useEffect(() => {
    if (!plotRef.current) return;

    const isDark = isDarkMode();

    let xRange = null;
    if (customTimeRangeObj) {
      xRange = [new Date(customTimeRangeObj.min), new Date(customTimeRangeObj.max)];
    } else if (timeRange !== Number.MAX_VALUE) {
      const endDate = new Date();
      xRange = [new Date(endDate.getTime() - timeRange), endDate];
    }

    const traces = REGIONS.map(region => {
      const points = regionData[region] ?? [];
      const y = points.map(p => p.y);
      return {
        x: points.map(p => new Date(p.x)),
        y,
        type: 'scatter',
        mode: 'lines+markers',
        name: region,
        line: { shape: 'spline', width: 2, color: REGION_COLORS[region] },
        marker: { size: 4, color: REGION_COLORS[region] },
        connectgaps: true,
        hovertemplate: `<b>${region}</b><br>Time: %{x}<br>Duration: %{customdata}<extra></extra>`,
        customdata: y.map(v => formatTime(v)),
      };
    });

    // Determine y-axis units from all data combined
    const allY = REGIONS.flatMap(r => (regionData[r] ?? []).map(p => p.y)).filter(v => v > 0);
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
      title: {
        text: `${label} - By Region (${displayOptionLabel})`,
        font: { size: 16, color: themeColors(isDark).textStrong }
      },
      xaxis: axis(isDark, { title: 'Time', type: 'date', range: xRange }),
      yaxis: axis(isDark, {
        title: 'Duration',
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

    Plotly.newPlot(plotRef.current, traces, layout, config).then(() => {
      plotRef.current.on('plotly_relayout', (eventData) => {
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
  }, [regionData, displayOptionLabel, label, timeRange, customTimeRangeObj]);

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
        <select
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

        <select
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

      {isLoading && REGIONS.every(r => regionData[r].length === 0) ? (
        <div
          className="w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm"
          style={{ height: '450px' }}
        />
      ) : (
        <div
          ref={plotRef}
          style={{ height: '450px', width: '100%' }}
        />
      )}
    </div>
  );
};

export default RegionGraph;
