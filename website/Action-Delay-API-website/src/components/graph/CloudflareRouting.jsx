import { useState, useEffect } from 'react';
import RouteGraph from './RouteGraph';

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 Hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' }
];

const JOB_OPTIONS = [
  { value: 'cloudflare-worker-uncached-10kb-free-plan', label: 'Free Plan' },
  { value: 'cloudflare-worker-uncached-10kb-pro-plan', label: 'Pro Plan' },
  { value: 'cloudflare-worker-uncached-10kb-business-plan', label: 'Business Plan' },
  { value: 'cloudflare-worker-uncached-10kb', label: 'Enterprise' },
  { value: 'cloudflare-worker-uncached-10kb-argo', label: 'Argo' },
  { value: 'cloudflare-worker-uncached-10kb-spectrum', label: 'Enterprise Spectrum HTTP' }
];

const TimeRangeSelector = ({ value, onChange, customLabel }) => {
  return (
    <div className="mb-6">
      <label htmlFor="time-range-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Time Range:
      </label>
      <select 
        id="time-range-select"
        value={value} 
        onChange={onChange}
        className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 w-64 mr-4"
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
    </div>
  );
};

const REGIONS = [
  { code: 'na', name: 'North America', friendlyName: 'NA' },
  { code: 'sa', name: 'South America', friendlyName: 'SA' },
  { code: 'eu', name: 'Europe', friendlyName: 'EU' },
  { code: 'as', name: 'Asia Pacific', friendlyName: 'AS' },
  { code: 'oc', name: 'Oceania', friendlyName: 'OC' },
];

const JobSelector = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="job-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Cloudflare Plan:
      </label>
      <select 
        id="job-select"
        value={value} 
        onChange={onChange}
        className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 w-64"
      >
        {JOB_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const CloudflareRouting = ({ fullscreen = false }) => {
  const [selectedJob, setSelectedJob] = useState('cloudflare-worker-uncached-10kb-free-plan');
  const [timeRange, setTimeRange] = useState(24 * 60 * 60 * 1000);
  const [customRange, setCustomRange] = useState(null);
  const [customLabel, setCustomLabel] = useState(null);
  const [locationsByRegion, setLocationsByRegion] = useState({});
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://delay.cloudflare.chaika.me/v2/locations');
        const data = await response.json();
        
        // Group enabled locations by friendlyRegionName
        const grouped = {};
        data.data
          .filter(location => location.enabled)
          .forEach(location => {
            const regionName = location.friendlyRegionName;
            if (!grouped[regionName]) {
              grouped[regionName] = [];
            }
            grouped[regionName].push(location.locationName);
          });
        
        // Sort IATA codes for each region
        Object.keys(grouped).forEach(region => {
          grouped[region].sort();
        });
        
        setLocationsByRegion(grouped);
      } catch (error) {
        // Silently ignore errors as requested
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    const value = Number(event.target.value);
    setTimeRange(value);
    setCustomRange(null);
    setCustomLabel(null);
  };

  const handleZoom = (range) => {
    const minDate = new Date(range.min);
    const maxDate = new Date(range.max);
    const monthDay = new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric' });
    
    setTimeRange('custom');
    setCustomRange({ min: range.min, max: range.max });
    setCustomLabel(`${monthDay.format(minDate)} -> ${monthDay.format(maxDate)}`);
  };

  const selectedJobLabel = JOB_OPTIONS.find(job => job.value === selectedJob)?.label || 'Unknown Plan';

  return (
    <div className="w-full p-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <JobSelector 
          value={selectedJob}
          onChange={handleJobChange}
        />
        <TimeRangeSelector 
          value={timeRange}
          onChange={handleTimeRangeChange}
          customLabel={customLabel}
        />
      </div>
      
      <div className="space-y-8">
        {REGIONS.map(region => {
          const iataList = locationsByRegion[region.friendlyName] || [];
          
          return (
            <div key={region.code} className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {region.name} ({region.code.toUpperCase()})
                </h3>
                {!loadingLocations && iataList.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{iataList.length} testing locations: </span>
                    <span className="font-mono text-xs">
                      {iataList.join(', ')}
                    </span>
                  </div>
                )}
                {loadingLocations && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Loading locations...
                  </div>
                )}
              </div>
              <RouteGraph 
                endpoint={`v2/jobs/${selectedJob}/locations/region/${region.code}/requestRoutingRegionAnalytics`}
                label={`${selectedJobLabel} - Requests From ${region.name}`}
                height={fullscreen ? 600 : 400}
                regionName={region.code}
                timeRange={timeRange}
                customRange={customRange}
                customLabel={customLabel}
                onTimeRangeChange={handleTimeRangeChange}
                onZoom={handleZoom}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudflareRouting;