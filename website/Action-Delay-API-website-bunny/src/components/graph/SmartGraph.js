import  { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min'
import { isDarkMode, themeColors, baseLayout, axis, seriesColor, themeRelayout } from './chartTheme';

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
  { value: "AvgRunLength", label: "Average Job Time"},
  { value: "MedianRunLength", label: "Median Job Time"},
  { value: "MinRunLength", label: "Min Job Time"},
  { value: "MaxRunLength", label: "Max Job Time"},
  { value: "MedianApiResponseLatency", label: "Median API Response Time"},
  { value: "AvgApiResponseLatency", label: "Average API Response Time"},
  { value: "MinApiResponseLatency", label: "Min API Response Time"},
  { value: "MaxApiResponseLatency", label: "Max API Response Time"},
  { value: "MedianEdgeResponseLatency", label: "Median Edge Response Time"},
  { value: "AvgEdgeResponseLatency", label: "Average Edge Response Time"},
  { value: "MinEdgeResponseLatency", label: "Min Edge Response Time"},
  { value: "MaxEdgeResponseLatency", label: "Max Edge Response Time"},
];

function formatTime(ms) {
   if (typeof ms !== 'number' || !isFinite(ms)) {
    return ms;
  }
  if (ms < 1000) {
    return ms.toFixed(0) + ' ms';
  }
  
  let seconds = ms / 1000;
  if (seconds < 60) {
    return seconds.toFixed(2) + ' s';
  }
  
  let minutes = seconds / 60;
  if (minutes < 60) {
    return minutes.toFixed(2) + ' min';
  }
  
  let hours = minutes / 60;
  return hours.toFixed(2) + ' h';
}

const SmartGraph = (props) => {
  const { endpoint, label, options: propOptions, fullscreen, defaultOption } = props;
  const plotRef = useRef(null);
  
  const options = propOptions 
    ? SELECT_DISPLAY_OPTIONS.filter(option => propOptions.includes(option.value))
    : SELECT_DISPLAY_OPTIONS;

  const defaultOptionObj = defaultOption 
    ? options.find(option => option.value === defaultOption)
    : options[0];

  const [dataPoints, setDataPoints] = useState([]);
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
      if (timeRange === Number.MAX_VALUE) {
        startDate = null;
      } else {
        startDate = endDate - timeRange;
      }
    }

    setIsLoading(true);
    setDataPoints([]); 
    fetchData(endpoint, startDate, endDate, displayOption)
      .then(response => {
        setIsLoading(false); 
        setDataPoints(response); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        setDataPoints([]); 
      });
  }, [timeRange, displayOption, customTimeRangeObj, endpoint]);

  useEffect(() => {
    if (!plotRef.current) return;

    const isDark = isDarkMode();
    const lineColor = seriesColor(displayOption);

    const x = dataPoints.map(point => new Date(point.x));
    const y = dataPoints.map(point => point.y);

    let xRange = null;
    if (customTimeRangeObj) {
      xRange = [new Date(customTimeRangeObj.min), new Date(customTimeRangeObj.max)];
    } else if (timeRange !== Number.MAX_VALUE) {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - timeRange);
      xRange = [startDate, endDate];
    }

    const data = [{
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines+markers',
      name: displayOptionLabel,
      line: {
        shape: 'spline',
        width: 2,
        color: lineColor
      },
      marker: {
        size: 4,
        color: lineColor
      },
      connectgaps: true
    }];

    const layout = {
      ...baseLayout(isDark),
      title: {
        text: `${label} - ${displayOptionLabel}`,
        font: { size: 16, color: themeColors(isDark).textStrong }
      },
      xaxis: axis(isDark, { title: 'Time', type: 'date', range: xRange }),
      yaxis: axis(isDark, { title: 'Duration', tickmode: 'array', fixedrange: true }),
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'resetScale2d', 'zoom2d'],
      displaylogo: false
    };

    // Custom hover template with time formatting
    data[0].hovertemplate = '<b>%{fullData.name}</b><br>' +
                           'Time: %{x}<br>' +
                           'Duration: %{customdata}<br>' +
                           '<extra></extra>';
    data[0].customdata = y.map(val => formatTime(val));

    // Custom y-axis tick formatting with appropriate units
    if (y.length > 0) {
      const minY = Math.min(...y);
      const maxY = Math.max(...y);
      const range = maxY - minY;
      const numTicks = 8;
      
      // Determine appropriate unit based on data range
      let unit = 'ms';
      let divisor = 1;
      if (maxY >= 3600000) { // >= 1 hour
        unit = 'h';
        divisor = 3600000;
      } else if (maxY >= 60000) { // >= 1 minute
        unit = 'min';
        divisor = 60000;
      } else if (maxY >= 1000) { // >= 1 second
        unit = 's';
        divisor = 1000;
      }
      
      layout.yaxis.tickvals = [];
      layout.yaxis.ticktext = [];
      for (let i = 0; i <= numTicks; i++) {
        const val = minY + (range * i / numTicks);
        layout.yaxis.tickvals.push(val);
        const displayVal = (val / divisor).toFixed(divisor === 1 ? 0 : 2);
        layout.yaxis.ticktext.push(`${displayVal} ${unit}`);
      }
    }

    Plotly.newPlot(plotRef.current, data, layout, config).then(() => {
      plotRef.current.on('plotly_relayout', (eventData) => {
        if (eventData['xaxis.range[0]'] && eventData['xaxis.range[1]']) {
          const minDate = new Date(eventData['xaxis.range[0]']);
          const maxDate = new Date(eventData['xaxis.range[1]']);
          const timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
          const timeDiffInSecond = Math.ceil(timeDiff / 1000);

          if (timeDiffInSecond < 5 * 60) {
            return;
          }

          setCustomTimeRangeObj({ min: minDate.getTime(), max: maxDate.getTime()});
          
          const customTimeString = `${minDate.toLocaleString("default", {month: 'short'})} ${minDate.getDate()} ${minDate.toLocaleTimeString('default', { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: navigator.language === 'en-US' || Intl.DateTimeFormat().resolvedOptions().hour12
          })} → ${maxDate.toLocaleString("default", {month: 'short'})} ${maxDate.getDate()} ${maxDate.toLocaleTimeString('default', { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: navigator.language === 'en-US' || Intl.DateTimeFormat().resolvedOptions().hour12
          })}`;
          
          setTimeRange("custom");
          setCustomTimeRange(customTimeString);
        }
      });
    });

  }, [dataPoints, displayOptionLabel, label, timeRange, customTimeRangeObj]);

  useEffect(() => {
    function handleThemeChange() {
      if (!plotRef.current) return;
      // Series color is metric-based (not theme-based), so only relayout chrome.
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
            setDisplayOptionLabel(options.find(option => option.value === event.target.value).label);
          }}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <a 
          href={`/graph?endpoint=${encodeURIComponent(endpoint)}&label=${encodeURIComponent(label)}&options=${encodeURIComponent(propOptions)}`}
          className="inline-flex items-center justify-center ml-2"
        >
          <img
            src="/expand.svg"
            alt="Expand"
            className="w-4 h-6 object-contain"
          />
        </a>
      </div>

      {isLoading && dataPoints.length === 0 ? (
        <div
          className="w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm"
          style={{ height: fullscreen ? '700px' : '450px' }}
        />
      ) : (
        <div
          ref={plotRef}
          style={{
            height: fullscreen ? '700px' : '450px',
            width: '100%'
          }}
        />
      )}
    </div>
  );
};

async function fetchData(endpoint, start, end, displayOption) {
  const datetimeNow = new Date(Date.now());
  const startParam = start ? new Date(start).toISOString() : new Date(2023, 8).toISOString();
  let endParam = end ? new Date(end).toISOString() : datetimeNow.toISOString();
  
  if (new Date(end) > datetimeNow) {
    endParam = datetimeNow.toISOString();
  }

  const response = await fetch(`https://api.bunny.chaika.me/${endpoint}?StartDateTime=${startParam}&EndDateTime=${endParam}&Metrics=${displayOption}`);
  const json = await response.json();
  
  return json.data.points.map(point => {
    let y = 0;
    for (const property in point) {
      if (property !== "timePeriod") {
        y = point[property];
        break;
      }
    }
    return { 
      x: new Date(point.timePeriod).getTime(),
      y 
    };
  });
}

export default SmartGraph;