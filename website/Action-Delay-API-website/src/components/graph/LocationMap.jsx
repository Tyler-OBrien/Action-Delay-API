import { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-geo-dist-min';
import { isDarkMode } from './chartTheme';

// Distinct palette for coloring by destination colo
const PALETTE = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4',
  '#42d4f4', '#f032e6', '#bfef45', '#469990', '#dcbeff',
  '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1',
  '#000075', '#a9a9a9', '#e6beff', '#fabebe', '#008080',
];

function getColoColor(coloId, coloIds) {
  const idx = coloIds.indexOf(coloId);
  return idx === -1 ? '#6b7280' : PALETTE[idx % PALETTE.length];
}

function buildTraces(locations, isDark) {
  const bgColor = 'rgba(0,0,0,0)';

  // Build sorted list of unique coloIds for stable color assignment
  const coloIds = [...new Set(locations.map(l => l.coloId).filter(id => id != null && id > 0))].sort((a, b) => a - b);
  const color = (id) => getColoColor(id, coloIds);

  const traces = [];

  // CF colo markers first (lowest z-order); diamonds are visual-only — no hover so agent
  // circles always take hover priority (circle tooltip already shows "CF PoP: X")
  const coloSeen = new Set();
  const coloLats = [], coloLons = [], coloColors = [];
  for (const loc of locations) {
    if (!coloSeen.has(loc.coloId) && loc.coloLatitude != null) {
      coloSeen.add(loc.coloId);
      coloLats.push(loc.coloLatitude);
      coloLons.push(loc.coloLongitude);
      coloColors.push(color(loc.coloId));
    }
  }

  traces.push({
    type: 'scattergeo',
    lat: coloLats,
    lon: coloLons,
    mode: 'markers',
    name: 'CF PoP',
    marker: {
      size: 10,
      symbol: 'diamond',
      color: coloColors,
      line: { width: 1.5, color: isDark ? '#111' : '#fff' },
    },
    hoverinfo: 'skip',
    showlegend: false,
  });

  // Line traces (one per colo, above diamonds)
  const byColoId = {};
  for (const loc of locations) {
    if (loc.coloLatitude != null && loc.coloLongitude != null) {
      if (!byColoId[loc.coloId]) byColoId[loc.coloId] = [];
      byColoId[loc.coloId].push(loc);
    }
  }

  for (const [coloIdStr, locs] of Object.entries(byColoId)) {
    const coloId = Number(coloIdStr);
    const lat = [], lon = [];
    for (const loc of locs) {
      lat.push(loc.locationLatitude, loc.coloLatitude, null);
      lon.push(loc.locationLongitude, loc.coloLongitude, null);
    }
    traces.push({
      type: 'scattergeo',
      lat,
      lon,
      mode: 'lines',
      name: locs[0].coloFriendlyLocationName,
      line: { width: 1.5, color: color(coloId) },
      hoverinfo: 'none',
      showlegend: false,
    });
  }

  // Agent markers last (highest z-order: always on top of diamonds and lines)
  // Size 9 ensures the circle fully covers the diamond center when co-located
  traces.push({
    type: 'scattergeo',
    lat: locations.map(l => l.locationLatitude),
    lon: locations.map(l => l.locationLongitude),
    mode: 'markers',
    name: 'Testing Location',
    marker: {
      size: 9,
      color: locations.map(l => color(l.coloId)),
      line: { width: 1, color: isDark ? '#111' : '#fff' },
    },
    text: locations.map(l => {
      const status = l.lastRunStatus ?? null;
      const ms = l.lastRunLengthMs != null ? `${l.lastRunLengthMs} ms` : null;
      const statusLine = status
        ? `Request Status: ${status}${ms ? ` (${ms})` : ''}<br>`
        : '';
      return (
        `<b>${l.friendlyLocationName ?? l.locationName}</b><br>` +
        `Provider: ${l.provider}<br>` +
        `Path to CF: ${l.pathToCf}<br>` +
        `ICMP Latency: ${l.cfLatency != null ? l.cfLatency.toFixed(2) + ' ms' : '—'}<br>` +
        statusLine +
        `CF PoP: ${l.coloFriendlyLocationName ?? '—'}`
      );
    }),
    hovertemplate: '%{text}<extra></extra>',
    showlegend: false,
  });

  const layout = {
    height: 480,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: bgColor,
    geo: {
      showframe: false,
      showcoastlines: true,
      coastlinecolor: isDark ? '#555' : '#999',
      showland: true,
      landcolor: isDark ? '#2a2a2a' : '#e4e4e4',
      showocean: true,
      oceancolor: isDark ? '#1a1f2e' : '#d0e8f5',
      showlakes: false,
      showcountries: true,
      countrycolor: isDark ? '#383838' : '#c8c8c8',
      bgcolor: bgColor,
      projection: { type: 'natural earth' },
    },
    showlegend: false,
  };

  return { traces, layout };
}

const LocationMap = ({ locations, planLabel }) => {
  const plotRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
    const handler = () => setIsDark(isDarkMode());
    window.addEventListener('themeChange', handler);
    return () => window.removeEventListener('themeChange', handler);
  }, []);

  useEffect(() => {
    if (!plotRef.current || !locations?.length) return;
    const { traces, layout } = buildTraces(locations, isDark);
    Plotly.newPlot(plotRef.current, traces, layout, { responsive: true, displayModeBar: false });
  }, [locations, isDark]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div ref={plotRef} style={{ width: '100%', height: '480px' }} />
    </div>
  );
};

export default LocationMap;
