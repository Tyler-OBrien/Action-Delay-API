import { useState, useEffect, useCallback, useRef } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min'

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 Hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' }
];

const processRouteData = (points, primaryRegion) => {
  const regionMap = new Map();
  const regions = new Set();

  // Define consistent region ordering (for non-primary regions)
  const regionOrder = ['NA', 'EU', 'APAC', 'OC', 'ENAM', 'WNAM', 'EEUR', 'WEUR'];

  points.forEach(point => {
    const timestamp = new Date(point.timePeriod).getTime();
    regions.add(point.region);
    
    if (!regionMap.has(timestamp)) {
      regionMap.set(timestamp, new Map());
    }
    const timeRegions = regionMap.get(timestamp);
    timeRegions.set(point.region, (timeRegions.get(point.region) || 0) + point.eventCount);
  });

  // Separate primary region from others
  const otherRegions = Array.from(regions).filter(region => region.toUpperCase() !== primaryRegion.toUpperCase());
  
  // Sort other regions by predefined order, with unknown regions at the end
  const sortedOtherRegions = otherRegions.sort((a, b) => {
    const indexA = regionOrder.indexOf(a);
    const indexB = regionOrder.indexOf(b);
    
    // If both regions are in the predefined order, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only one is in the predefined order, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // If neither is in the predefined order, sort alphabetically
    return a.localeCompare(b);
  });

  // Primary region first (bottom of stack), then other regions
  const finalRegionOrder = [];
  
  // Add primary region first if it exists in the data
  const primaryRegionInData = Array.from(regions).find(region => region.toUpperCase() === primaryRegion.toUpperCase());
  if (primaryRegionInData) {
    finalRegionOrder.push(primaryRegionInData);
  }
  
  // Add other regions
  finalRegionOrder.push(...sortedOtherRegions);

  return finalRegionOrder.map(region => ({
    name: region,
    data: Array.from(regionMap.entries())
      .map(([timestamp, regions]) => ({
        x: timestamp,
        y: regions.get(region) || 0
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

const PlotlyChart = ({ data, timeRange, customRange, label, height, onZoom, regionName }) => {
  const chartRef = useRef(null);
  const [theme, setTheme] = useState(getTheme);

  const updateChart = useCallback(() => {
    if (!chartRef.current || !data.length) return;

    const endDate = Date.now();
    const startDate = customRange?.min ?? 
      (endDate - timeRange);

    // Define colors for each region
    const regionColors = {
      'NA': '#3B82F6',    // Blue
      'EU': '#10B981',    // Green  
      'APAC': '#F59E0B',  // Amber
      'OC': '#EF4444',    // Red
      'ENAM': '#8B5CF6',  // Violet
      'WNAM': '#06B6D4',  // Cyan
      'EEUR': '#84CC16',  // Lime
      'WEUR': '#F97316'   // Orange
    };

    const plotlyData = data.map((series, index) => {
      const total = series.data.reduce((sum, point) => sum + point.y, 0);
      const displayName = `${series.name} (${total.toLocaleString()})`;

      return {
        x: series.data.map(d => new Date(d.x)),
        y: series.data.map(d => d.y),
        type: 'bar',
        name: displayName,
        marker: {
          color: regionColors[series.name] || '#6B7280'
        },
        hovertemplate: `<b>%{fullData.name}</b><br>` +
                       `Date: %{x|%b %d, %Y %H:%M}<br>` +
                       `Requests: %{y:,}<br>` +
                       `<extra></extra>`
      };
    });

    const layout = {
      title: {
        text: `${label} - Request Count by Executing Region`,
        x: 0.5,
        font: { color: theme.font_color, size: 16 }
      },
      xaxis: {
        title: 'Time',
        type: 'date',
        range: [new Date(startDate), new Date(endDate)],
        color: theme.font_color,
        gridcolor: theme.grid_color
      },
      yaxis: {
        title: 'Request Count',
        color: theme.font_color,
        gridcolor: theme.grid_color,
        fixedrange: true
      },
      barmode: 'stack',
      paper_bgcolor: theme.paper_bgcolor,
      plot_bgcolor: theme.plot_bgcolor,
      font: { color: theme.font_color },
      height: height,
      showlegend: true,
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
  }, [data, timeRange, customRange, label, height, theme, regionName]);

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
          No routing data available in selected time frame
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
      )}
    </div>
  );
};

const RouteGraph = ({ endpoint, label = 'Route Graph', height = 400, regionName, timeRange, customRange, customLabel, onTimeRangeChange, onZoom }) => {
  const [data, setData] = useState([]);
  const lastFetchRef = useRef(null);

  const fetchData = useCallback(async () => {
    const fetchId = Date.now();
    lastFetchRef.current = fetchId;

    try {
      const endDateFetch = Date.now();
      const startDateFetch = customRange?.min ?? 
        (endDateFetch - timeRange);

      const response = await fetch(
        `https://delay.cloudflare.chaika.me/${endpoint}?` +
        `StartDateTime=${new Date(startDateFetch).toISOString()}&` +
        `EndDateTime=${new Date(Math.min(endDateFetch, Date.now())).toISOString()}&` +
        `Metrics=MedianEdgeResponseLatency`
      );

      const responseJson = await response.json();

      // Only update if this is still the latest fetch
      if (lastFetchRef.current === fetchId) {
        // Handle different possible response structures
        const points = responseJson?.data?.points || responseJson?.points || [];
        const processedData = processRouteData(points, regionName);
        setData(processedData);
      }
    } catch (error) {
      console.error('Error fetching routing data:', error);
      console.log('Response status:', response?.status);
      console.log('Response text:', await response?.text?.().catch(() => 'Unable to get response text'));
      if (lastFetchRef.current === fetchId) {
        setData([]);
      }
    }
  }, [endpoint, timeRange, customRange]);

  const handleTimeRangeChange = (event) => {
    const value = Number(event.target.value);
    setTimeRange(value);
    setCustomRange(null);
    setCustomLabel(null);
  };

  const handleZoomed = (range) => {
    onZoom(range);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full">
      <div className="w-full">
        <PlotlyChart 
          data={data}
          timeRange={timeRange}
          customRange={customRange}
          label={label}
          height={height}
          onZoom={handleZoomed}
          regionName={regionName}
        />
      </div>
    </div>
  );
};

export default RouteGraph;