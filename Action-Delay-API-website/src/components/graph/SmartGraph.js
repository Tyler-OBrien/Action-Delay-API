import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

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
];

function formatTime(ms) {
  let seconds = ms / 1000;
  if (seconds < 60) {
    return seconds.toFixed(2) + ' second(s)';
  }
  
  let minutes = seconds / 60;
  if (minutes < 60) {
    return minutes.toFixed(2) + ' minute(s)';
  }
  
  let hours = minutes / 60;
  return hours.toFixed(2) + ' hour(s)';
}

const EnhancedTimeGraph = (props) => {
  const { endpoint, label, options: propOptions, fullscreen, defaultOption } = props;
  
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
  const [oldZoomObj, setOldZoomObj] = useState({});
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

  const htmlElement = document.documentElement;
  const hasDarkClass = htmlElement.classList.contains('dark');
  const chartUuid = crypto.randomUUID();

  const chartOptions = {
    theme: {
      mode: hasDarkClass ? "dark" : "light",
    },
    title: {
      text: `${label} - ${displayOptionLabel}`,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600
      }
    },
    chart: {
      id: chartUuid,
      type: 'line',
      height: 500,
      background: hasDarkClass ? '#171717' : '#ffffff',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
        allowMouseWheelZoom: false
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 450
        }
      },
      foreColor: hasDarkClass ? '#e5e5e5' : '#333',
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      events: {
        zoomed: function(chartContext, { xaxis }) {
          const minDate = new Date(xaxis.min);
          const maxDate = new Date(xaxis.max);
          const timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
          const timeDiffInSecond = Math.ceil(timeDiff / 1000);

          if (timeDiffInSecond < 5 * 60) {
            chartContext.updateOptions({
              xaxis: {
                min: oldZoomObj.min,
                max: oldZoomObj.max
              }
            }, true, false, false);
            return;
          }

          setOldZoomObj({ min: xaxis.min, max: xaxis.max });
          setCustomTimeRangeObj({ min: xaxis.min, max: xaxis.max});
          const customTimeString = `${minDate.toLocaleString("default", {month: 'short'})} ${minDate.getDate()} ${minDate.toLocaleTimeString('default', { hour: "2-digit", minute: "2-digit"})} → ${maxDate.toLocaleString("default", {month: 'short'})} ${maxDate.getDate()} ${maxDate.toLocaleTimeString('default', { hour: "2-digit", minute: "2-digit"})}`;
          setTimeRange("custom");
          setCustomTimeRange(customTimeString);
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'round',
      colors: undefined,
      dashArray: 0,
      connectNulls: true
    },
    markers: {
      size: 0,
      strokeWidth: 2,
      strokeOpacity: 1,
      strokeColors: undefined,
      fillOpacity: 1,
      shape: "circle",
      radius: 2,
      hover: {
        size: 5,
        sizeOffset: 3
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        style: {
          fontSize: '12px'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      labels: {
        formatter: formatTime,
        style: {
          fontSize: '12px'
        }
      },
      title: {
        text: 'Duration',
        style: {
          fontSize: '13px'
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: 'MMM dd, HH:mm:ss'
      },
      y: {
        formatter: formatTime
      },
      style: {
        fontSize: '12px'
      }
    },
    grid: {
      borderColor: hasDarkClass ? '#333' : '#e5e5e5',
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'left',
      fontSize: '13px',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    noData: {
      text: isLoading ? 'Loading...' : 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '14px'
      }
    }
  };

  useEffect(() => {
    function handleThemeChange() {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      const chart = ApexCharts.getChartByID(chartUuid);
      
      if (chart) {
        chart.updateOptions({
          theme: {
            mode: hasDarkClass ? "dark": "light",
          },
          chart: {
            background: hasDarkClass ? '#171717' : '#ffffff',
          },
          grid: {
            borderColor: hasDarkClass ? '#333' : '#e5e5e5',
          }
        }); 
      }
    }

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, [chartUuid]);

  const series = [{
    name: displayOptionLabel,
    data: isLoading ? [] : dataPoints
  }];

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

      <Chart 
        options={chartOptions} 
        series={series} 
        type="line" 
        height={fullscreen ? 700 : 500} 
      />
    </div>
  );
};

async function fetchData(endpoint, start, end, displayOption) {
  const datetimeNow = new Date(Date.now());
  const startParam = start ? new Date(start).toISOString() : new Date(2020, 0).toISOString();
  let endParam = end ? new Date(end).toISOString() : datetimeNow.toISOString();
  
  if (new Date(end) > datetimeNow) {
    endParam = datetimeNow.toISOString();
  }

  const response = await fetch(`https://delay.cloudflare.chaika.me/${endpoint}?StartDateTime=${startParam}&EndDateTime=${endParam}&Metrics=${displayOption}`);
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

export default EnhancedTimeGraph;