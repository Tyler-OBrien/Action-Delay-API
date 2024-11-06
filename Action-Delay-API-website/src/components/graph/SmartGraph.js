import { useEffect, useState } from 'preact/compat';
/** @jsxImportSource preact */
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
]

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
  

const ApexGraph = (props) => {
  const endpoint = props.endpoint;
  const label = props.label;
  let options = props.options;
  const defaultOption = props.defaultOption;
  const defaultOptionObj = null;
  if (!options)
    options = SELECT_DISPLAY_OPTIONS;
  else {
    options = SELECT_DISPLAY_OPTIONS.filter(option => options.includes(option.value))
  }

  if (defaultOption)
  {
    defaultOptionObj = options.find(option => option.value == defaultOption);
  }

  const [dataPoints, setDataPoints] = useState([]);
  const [timeRange, setTimeRange] = useState(30 * 24 * 60 * 60 * 1000); // Default to the last month (30d)
  const [customTimeRange, setCustomTimeRange] = useState(null); 
  const [customTimeRangeObj, setCustomTimeRangeObj] = useState(null); 
  const [oldZoomObj, setOldZoomObj] = useState({}); 
  const [displayOption, setDisplayOption] = useState((defaultOptionObj ?? options[0]).value);
  const [displayOptionLabel, setDisplayOptionLabel] = useState((defaultOptionObj ?? options[0]).label);







  
  useEffect(() => {
    let endDate = Date.now();
    let startDate = null;
    if (customTimeRangeObj != null) {
      startDate = customTimeRangeObj.min;
      endDate = customTimeRangeObj.max;
    }
    else {
    if (timeRange == Number.MAX_VALUE)
      startDate = null;
    else
      startDate = endDate - timeRange;
    }

    fetchData(endpoint, startDate, endDate, displayOption).then(response => setDataPoints(response));
  }, [timeRange, displayOption, customTimeRangeObj]);

 
  const htmlElement = document.documentElement; // Get the <html> element
  const hasDarkClass = htmlElement.classList.contains('dark');

  const chartUuid = crypto.randomUUID();

   const initChartOptions = {
    theme: {
      mode: hasDarkClass ? "dark": "light",
    },
    title: {
      text: `${label} - ${displayOptionLabel}`,
      align: 'center'
    },
    chart: {
      id: chartUuid,
      type: 'line',
      height: 400,
      background: hasDarkClass ? '#171717' : '#fffff',
      zoom: {
        autoScaleYaxis: true,
        type: 'x', // Or 'y' for vertical zoom, 'xy' for both
        enabled: true,
      },
      events: {
        zoomed: function(chartContext, { xaxis, yaxis }) {
          var minDate = new Date(xaxis.min);
          var maxDate = new Date(xaxis.max);

          var timeDiff = Math.abs(maxDate.getTime() - minDate.getTime()); 
          var timeDiffInSecond = Math.ceil(timeDiff / 1000); 


          if (timeDiffInSecond < 5 * 60) {
            console.log("zoom too small, cancelling...")
            chartContext.updateOptions({
              xaxis: {
                min: oldZoomObj.min,
                max: oldZoomObj.max
              }
            }, true, false, false)
            return;
          }

          setOldZoomObj({ min: xaxis.min, max: xaxis.max })

          setDataPoints([])
          //fetchData(xaxis.min, xaxis.max, displayOption).then(response => setDataPoints(response));
          setCustomTimeRangeObj({ min: xaxis.min, max: xaxis.max})
       
          const customTimeString = `${minDate.toLocaleString("default", {month: 'short'})} ${minDate.toLocaleDateString('default', { day: "numeric"})} ${minDate.toLocaleTimeString('default', { hour: "2-digit", minute: "2-digit"})} -> ${maxDate.toLocaleString("default", {month: 'short'})}  ${maxDate.toLocaleDateString('default', { day: "numeric"})} ${maxDate.toLocaleTimeString('default', { hour: "2-digit", minute: "2-digit"})}`
          setTimeRange("custom")
          setCustomTimeRange(customTimeString)
        },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
        /*
        formatter: function (value, timestamp) {
          return new Date(timestamp).toLocaleString();
        }
          */
      },
      title: {
        text: displayOptionLabel
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatTime(value);
        },
      },
      title: {
        text: 'Job Duration'
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return formatTime(value);
        },
      },
    },
  };

  useEffect(() => {
    function handleThemeChange(event) {
      console.log("got event!")
      const htmlElement = document.documentElement; // Get the <html> element
      const hasDarkClass = htmlElement.classList.contains('dark');
      const tryGetChart = ApexCharts.getChartByID(chartUuid);
      console.log(tryGetChart);
      console.log(chartUuid);
    if (tryGetChart) {
      tryGetChart.updateOptions(
        {
          theme: {
            mode: hasDarkClass ? "dark": "light",
          },
          chart: {
            background: hasDarkClass ? '#171717' : '#fffff',
          }
        }
      ); 
    }

    }

    window.addEventListener('themeChange', handleThemeChange);
    console.log("listening...")


    // Cleanup on component unmount
    return () => {
      console.log("removing...")
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []); // Empty dependency array ensures this runs once on mount



  const series = [
    {
      name: displayOptionLabel,
      data: dataPoints,
    },
  ];

  return <div>
          <select value={timeRange} onChange={event => { 
            setCustomTimeRange(null)
            setCustomTimeRangeObj(null)
            setTimeRange(Number(event.target.value))
            }} class="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {SELECT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
        {customTimeRange == null ? null : (<option key="custom" value="custom">{customTimeRange}</option>)}
      </select>
      <select value={displayOption} onChange={event =>{
         setDisplayOption(event.target.value)
         setDisplayOptionLabel(options.find(option => option.value == event.target.value).label)
         } }  class="bg-gray-50 dark:bg-slate-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        )) }
      </select>
    <Chart options={initChartOptions} series={series} type="line" height='100%'  />
    </div>;
};

export default ApexGraph;

async function fetchData(endpoint, start, end, displayOption) {
  var datetimeNow = new Date(Date.now());
  const startParam = start ? new Date(start).toISOString() : new Date(2020, 0).toISOString();
  let endParam = end ? new Date(end).toISOString() : datetimeNow.toISOString();
  if (new Date(end) > datetimeNow)
    endParam = datetimeNow.toISOString();

  console.log(`fetching anew`)
  const response = await fetch(`https://delay.cloudflare.chaika.me/${endpoint}?StartDateTime=${startParam}&EndDateTime=${endParam}&Metrics=${displayOption}`);
  const json = await response.json();
  const pointsList = [];
  // hacky :(
  console.log(`points: ${json.data.points.length}`)
  for (let pointIdx in json.data.points) {
    const point = json.data.points[pointIdx];
    let x = new Date(point.timePeriod);
    let y = 0;
    for (const property in point) {
      if (property != "timePeriod")
      {
        y = point[property];
        break;
      }
    }
    pointsList.push({ x: x, y: y })
  }
  return pointsList;
}