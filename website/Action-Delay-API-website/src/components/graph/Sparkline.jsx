import { useEffect, useRef, useState } from "react";
import { completeBuckets, seriesFromResponse } from "./analytics";

// A tiny, dependency-free inline-SVG sparkline for the job cards. Deliberately
// NOT Plotly (one Plotly instance per card would be far too heavy). Mounted with
// Astro's `client:visible`, so it only hydrates + fetches when scrolled into view.
//
// Props:
//   endpoint       e.g. "v2/jobs/<encodedName>/analytics"
//   metric         analytics metric key (default "MedianRunLength")
//   health         "good" | "elevated" | "bad"  -> stroke color (theme-aware via CSS var)
//   days           history window in days (default 7)
//   errorEndpoint  optional e.g. "v2/jobs/<encodedName>/erroranalytics" — when set,
//                  faint error-occurrence bars are overlaid behind the latency line
//                  (used on AI cards). Absent => behaves exactly like before.

const W = 100;
const H = 32;
const PAD = 3; // keep the line off the very top/bottom edges

// Read a concrete status color for the current theme from a CSS variable.
function cssStatusColor(health) {
  if (typeof document === "undefined") return "#10b981";
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--status-" + health)
    .trim();
  return v || "#10b981";
}

// Map a series of {x,y} to a smoothed line + matching area path, normalized to the viewbox.
function buildPaths(points, xMin, xSpan) {
  const ys = points.map((p) => p.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const n = points.length;
  const pts = points.map((p, i) => {
    const px = xSpan > 0 ? ((p.x - xMin) / xSpan) * W : n === 1 ? W / 2 : (i / (n - 1)) * W;
    const py = H - PAD - ((p.y - min) / span) * (H - PAD * 2);
    return [px, py];
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(2)},${H} L${pts[0][0].toFixed(2)},${H} Z`;
  return { line, area };
}

async function fetchSeries(endpoint, metric, days) {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  const url =
    `https://delay.cloudflare.chaika.me/${endpoint}` +
    `?StartDateTime=${new Date(start).toISOString()}` +
    `&EndDateTime=${new Date(end).toISOString()}` +
    `&Metrics=${metric}`;
  const res = await fetch(url);
  const json = await res.json();
  return seriesFromResponse(json?.data, metric, start, end);
}

// Error occurrences: sum `count` across error types per timePeriod -> [{x, total}].
async function fetchErrors(errorEndpoint, days) {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  const url =
    `https://delay.cloudflare.chaika.me/${errorEndpoint}` +
    `?StartDateTime=${new Date(start).toISOString()}` +
    `&EndDateTime=${new Date(end).toISOString()}` +
    `&Metrics=AvgRunLength`;
  const res = await fetch(url);
  const json = await res.json();
  const byTime = new Map();
  for (const p of completeBuckets(json?.data, start, end)) {
    if (!p.timePeriod) continue;
    const x = new Date(p.timePeriod).getTime();
    byTime.set(x, (byTime.get(x) || 0) + (Number(p.count) || 0));
  }
  return [...byTime.entries()]
    .map(([x, total]) => ({ x, total }))
    .filter((p) => p.total > 0)
    .sort((a, b) => a.x - b.x);
}

const Sparkline = (props) => {
  const {
    endpoint,
    metric = "MedianRunLength",
    health = "good",
    days = 7,
    errorEndpoint = null,
  } = props;
  const [ys, setYs] = useState(null); // null = loading, [] = no data
  const [errors, setErrors] = useState([]);
  const [color, setColor] = useState(() => cssStatusColor(health));
  const [errColor, setErrColor] = useState(() => cssStatusColor("bad"));
  const id = useRef("spark-" + Math.random().toString(36).slice(2, 9)).current;

  useEffect(() => {
    let alive = true;
    fetchSeries(endpoint, metric, days)
      .then((vals) => alive && setYs(vals))
      .catch(() => alive && setYs([]));
    if (errorEndpoint) {
      fetchErrors(errorEndpoint, days)
        .then((vals) => alive && setErrors(vals))
        .catch(() => alive && setErrors([]));
    }
    return () => {
      alive = false;
    };
  }, [endpoint, metric, days, errorEndpoint]);

  // Re-read colors when the theme toggles.
  useEffect(() => {
    const onTheme = () => {
      setColor(cssStatusColor(health));
      setErrColor(cssStatusColor("bad"));
    };
    window.addEventListener("themeChange", onTheme);
    return () => window.removeEventListener("themeChange", onTheme);
  }, [health]);

  if (ys === null) {
    return (
      <div
        className="w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
        style={{ height: H + "px" }}
      />
    );
  }

  const hasLine = ys.length >= 2;
  const hasErrors = errors.length > 0;
  // Nothing meaningful to draw -> stay out of the way (keeps the card clean).
  if (!hasLine && !hasErrors) return null;

  // Shared x range across both series so bars and line align by timestamp.
  const allX = [...ys.map((p) => p.x), ...errors.map((p) => p.x)];
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  const xSpan = xMax - xMin;

  const paths = hasLine ? buildPaths(ys, xMin, xSpan) : null;

  let bars = null;
  if (hasErrors) {
    const maxTotal = Math.max(...errors.map((p) => p.total));
    const bw = 2;
    bars = errors.map((p, i) => {
      const px = xSpan > 0 ? ((p.x - xMin) / xSpan) * W : W / 2;
      const h = Math.max(1.5, (p.total / maxTotal) * (H - PAD));
      return <rect key={i} x={(px - bw / 2).toFixed(2)} y={(H - h).toFixed(2)} width={bw} height={h.toFixed(2)} fill={errColor} opacity="0.35" />;
    });
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: H + "px" }}
        role="img"
        aria-label={hasErrors ? "recent history with errors" : "recent history"}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths && <path d={paths.area} fill={`url(#${id})`} stroke="none" />}
        {bars}
        {paths && (
          <path
            d={paths.line}
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      <span className="text-gray text-xs whitespace-nowrap">·{days}d</span>
    </div>
  );
};

export default Sparkline;
