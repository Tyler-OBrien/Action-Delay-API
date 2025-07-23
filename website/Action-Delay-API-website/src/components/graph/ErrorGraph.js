import { useState, useEffect, useCallback, useRef } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min'

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 Hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' },
  { value: Number.MAX_VALUE, label: 'All Data' }
];

const processErrorData = (points) => {
  const errorMap = new Map();
  const errorTypes = new Set();

  points.forEach(point => {
    const timestamp = new Date(point.timePeriod).getTime();
    errorTypes.add(point.error);
    
    if (!errorMap.has(timestamp)) {
      errorMap.set(timestamp, new Map());
    }
    const timeErrors = errorMap.get(timestamp);
    timeErrors.set(point.error, (timeErrors.get(point.error) || 0) + point.count);
  });

  return Array.from(errorTypes).map(errorType => ({
    name: errorType,
    data: Array.from(errorMap.entries())
      .map(([timestamp, errors]) => ({
        x: timestamp,
        y: errors.get(errorType) || 0
      }))
      .sort((a, b) => a.x - b.x)
  }));
};

const getTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    mode: isDark ? "dark" : "light",
    paper_bgcolor: isDark ? '#171717' : '#ffffff',
    plot_bgcolor: isDark ? '#262626' : '#fafafa',
    font_color: isDark ? '#ffffff' : '#000000',
    grid_color: isDark ? '#404040' : '#e5e5e5'
  };
};

const TimeRangeSelector = ({ value, onChange, customLabel }) => {
  return (
    <select 
      value={value} 
      onChange={onChange}
      className="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      {SELECT_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {customLabel && (
        <option value="custom">{customLabel}</option>
      )}
    </select>
  );
};

const PlotlyChart = ({ data, timeRange, customRange, label, height, onZoom }) => {
  const chartRef = useRef(null);
  const [theme, setTheme] = useState(getTheme);

  const updateChart = useCallback(() => {
    if (!chartRef.current || !data.length) return;

    const endDate = Date.now();
    const startDate = customRange?.min ?? 
      (timeRange === Number.MAX_VALUE ? new Date(2023, 8).getTime() : endDate - timeRange);


    const plotlyData = data.map((series, index) => {
      const [, errorCode = ''] = series.name.match(/\[(.*?)\]/) || [];
      const errorMessage = series.name.split(']:')[1]?.trim().split('.')[0] || series.name;
      const total = series.data.reduce((sum, point) => sum + point.y, 0);
      const displayName = `[${errorCode}] ${errorMessage.substring(0, 50)}${errorMessage.length > 50 ? '...' : ''} (${total})`;

      return {
        x: series.data.map(d => new Date(d.x)),
        y: series.data.map(d => d.y),
        type: 'bar',
        name: displayName,
        hovertemplate: `<b>%{fullData.name}</b><br>` +
                       `Date: %{x|%b %d, %Y}<br>` +
                       `Count: %{y}<br>` +
                       `<extra></extra>`
      };
    });

    const layout = {
      title: {
        text: `${label} - Error Occurrences`,
        x: 0.5,
        font: { color: theme.font_color, size: 16 }
      },
      xaxis: {
        title: 'Date',
        type: 'date',
        range: [new Date(startDate), new Date(endDate)],
        color: theme.font_color,
        gridcolor: theme.grid_color
      },
      yaxis: {
        title: 'Error Count',
        color: theme.font_color,
        gridcolor: theme.grid_color,
        fixedrange: true
      },
      barmode: 'stack',
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: { color: theme.font_color },
      height: height,
      legend: {
        orientation: 'h',
        y: -0.2,
        font: { color: theme.font_color, size: 12 }
      },
      margin: { l: 60, r: 40, t: 60, b: 120 }
    };

    const config = {
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d'],
      displaylogo: false,
      responsive: true
    };

    Plotly.newPlot(chartRef.current, plotlyData, layout, config).then(() => {
      const handleRelayout = (eventData) => {
        if (eventData['xaxis.range[0]'] && eventData['xaxis.range[1]']) {
          const minDate = new Date(eventData['xaxis.range[0]']);
          const maxDate = new Date(eventData['xaxis.range[1]']);
          const timeDiff = maxDate.getTime() - minDate.getTime();

          if (timeDiff >= 5 * 60 * 1000) {
            onZoom({
              min: minDate.getTime(),
              max: maxDate.getTime()
            });
          }
        }
      };

      chartRef.current.on('plotly_relayout', handleRelayout);
    });
  }, [data, timeRange, customRange, label, height, theme]);

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.removeAllListeners) {
        chartRef.current.removeAllListeners('plotly_relayout');
      }
    };
  }, []);

  // Update chart when dependencies change
  useEffect(() => {
    updateChart();
  }, [updateChart]);

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-gray-500">
          No error data available in selected time frame
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
      )}
    </div>
  );
};

const ErrorGraph = ({ endpoint = 'api/errors', label = 'Error Graph', fullscreen = false }) => {
  const [timeRange, setTimeRange] = useState(24 * 60 * 60 * 1000);
  const [customRange, setCustomRange] = useState(null);
  const [customLabel, setCustomLabel] = useState(null);
  const [data, setData] = useState([]);
  const lastFetchRef = useRef(null);

  const fetchData = useCallback(async () => {
    const fetchId = Date.now();
    lastFetchRef.current = fetchId;

    try {
      const endDateFetch = Date.now();
      const startDateFetch = customRange?.min ?? 
        (timeRange === Number.MAX_VALUE ? new Date(2023, 8).getTime() : endDateFetch - timeRange);

      const response = await fetch(
        `https://delay.cloudflare.chaika.me/${endpoint}?` +
        `StartDateTime=${new Date(startDateFetch).toISOString()}&` +
        `EndDateTime=${new Date(Math.min(endDateFetch, Date.now())).toISOString()}&` +
        `Metrics=AvgRunLength`
      );

      const { data: responseData } = await response.json();

      // Only update if this is still the latest fetch
      if (lastFetchRef.current === fetchId) {
        const processedData = processErrorData(responseData.points);
        setData(processedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [endpoint, timeRange, customRange]);

  const handleTimeRangeChange = (event) => {
    const value = Number(event.target.value);
    setTimeRange(value);
    setCustomRange(null);
    setCustomLabel(null);
  };

  const handleZoomed = (range) => {
    const minDate = new Date(range.min);
    const maxDate = new Date(range.max);
    const monthDay = new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric' });
    
    setTimeRange('custom');
    setCustomRange({ min: range.min, max: range.max });
    setCustomLabel(`${monthDay.format(minDate)} -> ${monthDay.format(maxDate)}`);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <TimeRangeSelector 
          value={timeRange}
          onChange={handleTimeRangeChange}
          customLabel={customLabel}
        />
      </div>

      <div className="w-full">
        <PlotlyChart 
          data={data}
          timeRange={timeRange}
          customRange={customRange}
          label={label}
          height={fullscreen ? 800 : 700}
          onZoom={handleZoomed}
        />
      </div>
    </div>
  );
};

export default ErrorGraph;