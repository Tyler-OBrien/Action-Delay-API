import { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import { isDarkMode, themeColors, baseLayout, axis, themeRelayout, compareColor } from './chartTheme';
import { LOG_SPREAD_THRESHOLD, formatValue, rawValue, useLogScale } from '../../lib/compare/scale';

// Multi-series comparison chart.
//
// Deliberately dumb: it renders whatever series it is handed. Fetching, the
// spec, and the time range live in CompareExplorer, because a comparison is one
// request for all of its lines and the chart is not the thing that knows how to
// build it.
//
// Modeled on RegionGraph.js, which is the site's existing multi-series chart —
// same theme helpers, same modebar trimming, same zoom-to-refine gesture.

// Pick one scale for the y-axis. Series can in principle carry different units
// (comparing a latency against a benchmark score), which is a legitimate thing
// to ask for and a misleading thing to plot on one axis — so the axis follows
// the majority unit and the hover text stays per-series and exact.
function dominantUnit(series) {
  const counts = new Map();
  for (const s of series) counts.set(s.unit, (counts.get(s.unit) ?? 0) + 1);
  let best = 'ms';
  let bestCount = -1;
  for (const [unit, n] of counts) {
    if (n > bestCount) {
      best = unit;
      bestCount = n;
    }
  }
  return best;
}

function axisScale(allY, unit) {
  if (unit !== 'ms' || allY.length === 0) return { unit: '', divisor: 1 };
  const maxY = Math.max(...allY);
  if (maxY >= 3600000) return { unit: 'h', divisor: 3600000 };
  if (maxY >= 60000) return { unit: 'min', divisor: 60000 };
  if (maxY >= 1000) return { unit: 's', divisor: 1000 };
  return { unit: 'ms', divisor: 1 };
}

const CompareGraph = (props) => {
  const { series = [], title, isLoading, fullscreen, onZoom, lifetime = false, errorCounts = false } = props;
  const plotRef = useRef(null);
  const [compact,setCompact]=useState(false);
  const [hidden,setHidden]=useState(new Set());
  useEffect(()=>setHidden(current=>current.size?new Set():current),[series]);
  useEffect(()=>{
    const node=plotRef.current;
    if(!node || typeof ResizeObserver==='undefined')return;
    let frame;
    const observer=new ResizeObserver(()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        setCompact(node.clientWidth<600);
        if(node._fullLayout) Plotly.Plots.resize(node);
      });
    });
    observer.observe(node);
    return ()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[]);

  useEffect(() => {
    if (!plotRef.current || isLoading) return;

    let disposed=false;
    const isDark = isDarkMode();
    const unit = dominantUnit(series);

    const traces = series.map((s, i) => {
      const color = s.color ?? compareColor(s.label, i);
      const y = s.points.map((p) => p.y);
      return {
        x: s.points.map((p) => new Date(p.x)),
        y,
        type: errorCounts ? 'bar' : 'scatter',
        mode: lifetime ? 'markers' : 'lines+markers',
        name: s.label,
        visible:hidden.has(s.key??i)?'legendonly':true,
        line: { shape: lifetime ? 'linear' : 'spline', width: 2, color },
        marker: { size: 4, color },
        connectgaps: !lifetime,
        hovertemplate: `<b>${s.label}</b><br>Time: %{x}<br>Value: %{customdata[0]}<br>Base value: %{customdata[1]}<br>Source: %{customdata[2]}${lifetime ? '<br>Reports: %{customdata[3]}' : ''}<extra></extra>`,
        customdata: y.map((v, index) => [formatValue(v, s.unit), rawValue(v, s.unit), s.sourceId, s.points[index].reports ?? "unavailable"]),
      };
    });

    const allY = series.flatMap((s) => s.points.map((p) => p.y)).filter((v) => isFinite(v));
    const scale = axisScale(allY, unit);
    const logScale = !errorCounts && useLogScale(series);

    // The manual ticks below are linear values. On a log axis Plotly reads
    // tickvals as exponents, so 60000 would be placed at 10^60000 — let it
    // auto-tick instead. The hover text is per-series customdata either way, so
    // exact values are never lost.
    const yTicks = !logScale && allY.length > 0 ? (() => {
      const minY = Math.min(...allY);
      const maxY = Math.max(...allY);
      const range = maxY - minY;
      const numTicks = compact ? 4 : 8;
      const tickvals = [];
      const ticktext = [];
      for (let i = 0; i <= numTicks; i++) {
        const val = minY + (range * i) / numTicks;
        tickvals.push(val);
        const shown = scale.divisor === 1 ? val : val / scale.divisor;
        const digits = scale.divisor === 1 && Math.abs(shown) >= 100 ? 0 : 2;
        // axisScale only rescales milliseconds; for every other unit defer to
        // the shared formatter so KB becomes GiB rather than seven digits.
        ticktext.push(
          scale.divisor === 1 ? formatValue(val, unit) : `${shown.toFixed(digits)} ${scale.unit}`
        );
      }
      return { tickvals, ticktext };
    })() : {};

    const layout = {
      ...baseLayout(isDark),
      autosize:true,
      showlegend:!compact,
      margin:compact?{l:55,r:12,t:32,b:45}:{l:70,r:20,t:35,b:70},
      title: title
        ? { text: title, font: { size: 16, color: themeColors(isDark).textStrong } }
        : undefined,
      xaxis: axis(isDark, { title: 'Time', type: 'date' }),
      yaxis: axis(isDark, {
        title: unit === 'count' ? 'Occurrences' : 'Value',
        type: logScale ? 'log' : 'linear',
        tickmode: !logScale && allY.length > 0 ? 'array' : 'auto',
        fixedrange: true,
        ...yTicks,
      }),
    };

    if (logScale) {
      // Say so on the chart. A log axis that looks linear is worse than no log
      // axis — a reader will compare heights and be wrong by an order of
      // magnitude.
      const note = 'log scale — series span more than ' + LOG_SPREAD_THRESHOLD + '\u00d7';
      layout.annotations = [{
        text: note,
        showarrow: false,
        xref: 'paper', yref: 'paper',
        x: 1, y: 1.04, xanchor: 'right', yanchor: 'bottom',
        font: { size: 11, color: themeColors(isDark).text },
      }];
    }

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'resetScale2d', 'zoom2d'],
      displaylogo: false,
    };

    Plotly.newPlot(plotRef.current, traces, layout, config).then(() => {
      if (disposed || !onZoom || !plotRef.current) return;
      plotRef.current.on('plotly_relayout', (eventData) => {
        const lo = eventData['xaxis.range[0]'];
        const hi = eventData['xaxis.range[1]'];
        if (!lo || !hi) return;
        const min = new Date(lo).getTime();
        const max = new Date(hi).getTime();
        // Below five minutes there is nothing finer to fetch; refusing here also
        // stops an accidental double-click from firing a request.
        if (Math.abs(max - min) < 5 * 60 * 1000) return;
        onZoom({ min, max });
      });
    });

    // Plotly attaches canvases and listeners outside React's tree, so unmounting
    // the div is not enough to release them. This page re-plots on every series
    // change, far more often than the job-detail charts, so the leak compounds
    // here in a way it does not there.
    const node = plotRef.current;
    return () => {
      disposed=true;
      if (node) Plotly.purge(node);
    };
  }, [series, errorCounts, title, onZoom, lifetime, isLoading, compact, hidden]);

  useEffect(() => {
    function handleThemeChange() {
      if (!plotRef.current) return;
      Plotly.relayout(plotRef.current, themeRelayout(isDarkMode()));
    }
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  return <div className="min-w-0">
    <div className="relative">
      <div ref={plotRef} className={`compare-chart ${fullscreen?'compare-chart-fullscreen':''} ${isLoading?'animate-pulse bg-gray-100 dark:bg-gray-800 rounded':''}`} aria-label={title??(errorCounts?'Error occurrences chart':'Comparison chart')} aria-busy={isLoading}/>
      {!isLoading && !series.some(s=>s.points.length) && <p role="status" className="absolute top-1/2 left-0 right-0 text-center text-sm text-gray-500">No readings in this window.</p>}
    </div>
    {compact && !isLoading && series.length>0 && <ul aria-label="Chart legend" className="max-h-28 overflow-y-auto text-xs space-y-1 px-1 pb-2">{series.map((s,i)=><li key={s.key??i} className="break-words"><button type="button" className={`text-left ${hidden.has(s.key??i)?'line-through opacity-60':''}`} aria-pressed={!hidden.has(s.key??i)} onClick={()=>setHidden(current=>{const next=new Set(current);const key=s.key??i;next.has(key)?next.delete(key):next.add(key);return next;})}><span className="inline-block w-2 h-2 rounded-sm mr-2" style={{backgroundColor:s.color??compareColor(s.label,i)}}/>{s.label}</button></li>)}</ul>}
  </div>;
};

export default CompareGraph;
