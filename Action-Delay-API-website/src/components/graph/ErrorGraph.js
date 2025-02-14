import { useEffect, useMemo, useCallback, memo, useReducer, useRef } from 'react';
import Chart from 'react-apexcharts';

const FORMATTERS = {
  date: new Intl.DateTimeFormat('default'),
  monthDay: new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric' }),
  fullDate: new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
};

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 Hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' },
  { value: Number.MAX_VALUE, label: 'All Data' }
];

const ACTIONS = {
  SET_TIME_RANGE: 'SET_TIME_RANGE',
  SET_CUSTOM_RANGE: 'SET_CUSTOM_RANGE',
  SET_DATA: 'SET_DATA'
};

const createInitialState = () => ({
  timeRange: 24 * 60 * 60 * 1000,
  customRange: null,
  customLabel: null,
  data: []
});

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TIME_RANGE:
      return {
        ...state,
        timeRange: action.payload,
        customRange: null,
        customLabel: null,
        data: state.data
      };
    case ACTIONS.SET_CUSTOM_RANGE:
      return {
        ...state,
        timeRange: 'custom',
        customRange: action.payload.range,
        customLabel: action.payload.label,
        data: state.data
      };
    case ACTIONS.SET_DATA:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}

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

const useTheme = () => {
  return useMemo(() => {
    console.log('Theme recalculated');
    const isDark = document.documentElement.classList.contains('dark');
    return {
      mode: isDark ? "dark" : "light",
      background: isDark ? '#171717' : '#ffffff'
    };
  }, []);
};

const useFetchData = (endpoint, timeRange, customRange) => {
  const lastFetchRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(async (dispatch) => {
    console.log('Fetching data');
    const fetchId = Date.now();
    lastFetchRef.current = fetchId;

    try {
      const endDate = Date.now();
      const startDate = customRange?.min ?? 
        (timeRange === Number.MAX_VALUE ? new Date(2020, 0).getTime() : endDate - timeRange);

      const response = await fetch(
        `https://delay.cloudflare.chaika.me/${endpoint}?` +
        `StartDateTime=${new Date(startDate).toISOString()}&` +
        `EndDateTime=${new Date(Math.min(endDate, Date.now())).toISOString()}&` +
        `Metrics=AvgRunLength`
      );

      const { data: responseData } = await response.json();
      
      if (lastFetchRef.current === fetchId && isMountedRef.current) {
        console.log('Processing error data');
        const processedData = processErrorData(responseData.points);
        dispatch({ type: ACTIONS.SET_DATA, payload: processedData });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [endpoint, timeRange, customRange]);
};

const TimeRangeSelector = memo(({ value, onChange, customLabel }) => {
  console.log('TimeRangeSelector render');
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
});

TimeRangeSelector.displayName = 'TimeRangeSelector';

const createChartOptions = (themeState, label, chartId, onZoom) => {
  const legendFormatter = (seriesName, opts) => {
    const total = opts.w.globals.series[opts.seriesIndex].reduce((a, b) => a + b, 0);
    const [, errorCode = ''] = seriesName.match(/\[(.*?)\]/) || [];
    const errorMessage = seriesName.split(']:')[1]?.trim().split('.')[0] || seriesName;
    return `[${errorCode}] ${errorMessage.substring(0, 50)}${errorMessage.length > 50 ? '...' : ''} (${total})`;
  };

  const tooltipCustom = ({ series, dataPointIndex, w }) => {
    const timestamp = new Date(w.globals.seriesX[0][dataPointIndex]);
    const dateStr = FORMATTERS.fullDate.format(timestamp);

    const activeErrors = series
      .map((s, index) => ({
        name: w.globals.seriesNames[index],
        value: s[dataPointIndex]
      }))
      .filter(error => error.value > 0);

    if (!activeErrors.length) return '';

    return `
      <div class="p-2">
        <div class="font-bold mb-2">${dateStr}</div>
        ${activeErrors.map(error => {
          const [, errorCode = ''] = error.name.match(/\[(.*?)\]/) || [];
          const errorMessage = error.name.split(']:')[1]?.trim() || error.name;
          return `
            <div class="mb-1">
              <span class="font-semibold">[${errorCode}]:</span> 
              ${errorMessage}
              <span class="ml-1 font-semibold">(${error.value})</span>
            </div>`;
        }).join('')}
      </div>`;
  };

  return {
    theme: { mode: themeState.mode },
    title: {
      text: `${label} - Error Occurrences`,
      align: 'center'
    },
    chart: {
      id: chartId,
      type: 'bar',
      stacked: true,
      height: 500,
      background: themeState.background,
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      events: { zoomed: onZoom },
      animations: { enabled: false }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        formatter: value => FORMATTERS.date.format(new Date(value))
      }
    },
    yaxis: {
      title: { text: 'Error Count' }
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: { format: 'MMM dd, yyyy' },
      custom: tooltipCustom
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'left',
      height: 150,
      formatter: legendFormatter,
      itemMargin: {
        horizontal: 15,
        vertical: 5
      }
    },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle'
    }
  };
};

const ChartComponent = memo(({ data, options, height }) => {
  console.log('Chart render');
  return (
    <Chart 
      options={options}
      series={data}
      type="bar"
      height={height}
    />
  );
});

ChartComponent.displayName = 'ChartComponent';

const ErrorGraph = memo(({ endpoint, label, fullscreen = false }) => {
  console.log('ErrorGraph render');
  
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const themeState = useTheme();
  const chartId = useMemo(() => crypto.randomUUID(), []);
  const fetchData = useFetchData(endpoint, state.timeRange, state.customRange);

  const handleTimeRangeChange = useCallback((event) => {
    console.log('Time range changed');
    dispatch({
      type: ACTIONS.SET_TIME_RANGE,
      payload: Number(event.target.value)
    });
  }, []);

  const handleCustomRange = useCallback((range, label) => {
    dispatch({
      type: ACTIONS.SET_CUSTOM_RANGE,
      payload: { range, label }
    });
  }, []);

  const handleZoomed = useCallback((chartContext, { xaxis }) => {
    console.log('Zoom handled');
    const minDate = new Date(xaxis.min);
    const maxDate = new Date(xaxis.max);
    const timeDiff = maxDate.getTime() - minDate.getTime();

    if (timeDiff < 5 * 60 * 1000) return;

    handleCustomRange(
      { min: xaxis.min, max: xaxis.max },
      `${FORMATTERS.monthDay.format(minDate)} -> ${FORMATTERS.monthDay.format(maxDate)}`
    );
  }, [handleCustomRange]);

  const chartOptions = useMemo(() => 
    createChartOptions(themeState, label, chartId, handleZoomed),
    [themeState, label, chartId, handleZoomed]
  );

  useEffect(() => {
    fetchData(dispatch);
  }, [fetchData]);

  useEffect(() => {
    console.log('Setting up theme change listener');
    const handleThemeChange = () => {
      console.log('Theme changed');
      const chart = window.ApexCharts?.getChartByID(chartId);
      if (chart) {
        chart.updateOptions({
          theme: { mode: document.documentElement.classList.contains('dark') ? "dark" : "light" },
          chart: { background: document.documentElement.classList.contains('dark') ? '#171717' : '#ffffff' }
        });
      }
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, [chartId]);

  return (
    <div>
      <div className="mb-4">
        <TimeRangeSelector 
          value={state.timeRange}
          onChange={handleTimeRangeChange}
          customLabel={state.customLabel}
        />
      </div>

      <div className="w-full">
        <ChartComponent 
          data={state.data}
          options={chartOptions}
          height={fullscreen ? 800 : 700}
        />
      </div>
    </div>
  );
});

ErrorGraph.displayName = 'ErrorGraph';

export default ErrorGraph;