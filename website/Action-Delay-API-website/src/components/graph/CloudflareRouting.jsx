import { useState, useEffect } from 'react';
import RouteGraph from './RouteGraph';

const SELECT_OPTIONS = [
  { value: 30 * 60 * 1000, label: 'Last 30 Minutes' },
  { value: 6 * 60 * 60 * 1000, label: 'Last 6 Hours' },
  { value: 24 * 60 * 60 * 1000, label: 'Last 24 Hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Last 7 Days' },
  { value: 30 * 24 * 60 * 60 * 1000, label: 'Last 30 Days' },
  { value: 90 * 24 * 60 * 60 * 1000, label: 'Last 90 Days' },
  { value: 365 * 24 * 60 * 60 * 1000, label: 'Last Year' },

];

const JOB_OPTIONS = [
  { value: 'cloudflare-worker-uncached-10kb-free-plan', label: 'Free Plan' },
  { value: 'cloudflare-worker-uncached-10kb-pro-plan', label: 'Pro Plan' },
  { value: 'cloudflare-worker-uncached-10kb-business-plan', label: 'Business Plan' },
  { value: 'cloudflare-worker-uncached-10kb', label: 'Enterprise' },
  { value: 'cloudflare-worker-uncached-10kb-argo', label: 'Argo Addon' },
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

const ViewToggle = ({ showPercentage, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="view-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Display Mode:
      </label>
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="viewMode"
            value="percentage"
            checked={showPercentage}
            onChange={() => onChange(true)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Percentage</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="viewMode"
            value="count"
            checked={!showPercentage}
            onChange={() => onChange(false)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Request Count</span>
        </label>
      </div>
    </div>
  );
};

const FeatureBanner = ({ }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              New Feature
            </h3>
            <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              <p>Switch between seeing percentage routing or request counts. There is now 10x the requests used to sample routing from each region (2025-09-11).</p>
              <p>You can now see back to one full year of history. Please note monitoring for some plans started more recently.</p>
            </div>
          </div>
        </div>
      </div>
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
  const [showPercentage, setShowPercentage] = useState(true);

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
      <FeatureBanner />

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
        <ViewToggle
          showPercentage={showPercentage}
          onChange={setShowPercentage}
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
              {region.code == "eu" && selectedJob == "cloudflare-worker-uncached-10kb-free-plan" ?
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Some European ISPs (ex: DTAG) sometimes route Cloudflare free traffic to the US due to peering issues. We test from datacenters connecting to Cloudflare via peering/IXPs to avoid this. <br></br> This project measures Cloudflare's internal re-routing usually done for capacity reasons, not the complex routing decisions of Residential ISPs.
                  </p>

                </div> : null}
              {region.code == "as" && timeRange < (31 * 24 * 60 * 60 * 1000) && selectedJob == "cloudflare-worker-uncached-10kb-free-plan" ? (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Some Indian ISPs sometimes route Cloudflare free traffic to Europe due to peering issues. We test from datacenters connecting to Cloudflare via peering/IXPs to avoid this. <br></br> This project measures Cloudflare's internal re-routing usually done for capacity reasons, not the complex routing decisions of Residential ISPs.
                    </p>
                </div>
              ) : null}
              {region.code == "as" && timeRange >= (31 * 24 * 60 * 60 * 1000) && selectedJob == "cloudflare-worker-uncached-10kb-free-plan" ? (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Indian ISPs often route Cloudflare free traffic to Europe due to poor peering. One probe was affected until Sept 4, 2025 sending traffic to Europe, now switched. This Project measures CF internal rerouting, not ISP routing complexity. Asia Pacific tends to be one of the most complex regions for routing from ISPs.</p>
                </div>
              ) : null}
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
                showPercentage={showPercentage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudflareRouting;