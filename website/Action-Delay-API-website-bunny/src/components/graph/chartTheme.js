// Shared Plotly theme + semantic color palette for all charts.
// Goals: a clean modern look (super-faint grid, transparent background so the
// chart blends into its card) and consistent, meaningful series colors:
//   - API latency  -> amber
//   - edge latency -> orange
//   - run length / duration -> emerald/green
//   - errors -> red
//   - regions -> a single harmonized palette
//
// The site marks dark mode with BOTH `theme-dark` and `dark` on <html>
// (see ThemeToggle.astro); we accept either.

export function isDarkMode() {
  if (typeof document === "undefined") return false;
  const c = document.documentElement.classList;
  return c.contains("theme-dark") || c.contains("dark");
}

const FONT_FAMILY = "'Public Sans', system-ui, -apple-system, sans-serif";

// Concrete colors (Plotly draws to canvas, so CSS vars can't be used directly).
export function themeColors(isDark) {
  return {
    text: isDark ? "#c3cadb" : "#3d4663",
    textStrong: isDark ? "#e3e6ee" : "#283044",
    grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(9,11,17,0.05)",
    transparent: "rgba(0,0,0,0)",
  };
}

// A modern, near-borderless axis. Pass overrides (title/type/range/etc).
export function axis(isDark, overrides = {}) {
  const c = themeColors(isDark);
  return {
    gridcolor: c.grid,
    zeroline: false,
    showline: false,
    linecolor: c.grid,
    ticks: "",
    tickfont: { size: 12, color: c.text },
    titlefont: { size: 13, color: c.text },
    ...overrides,
  };
}

// Shared layout fragment (everything except the per-chart title + axes).
export function baseLayout(isDark) {
  const c = themeColors(isDark);
  return {
    paper_bgcolor: c.transparent,
    plot_bgcolor: c.transparent,
    font: { color: c.text, family: FONT_FAMILY },
    margin: { l: 70, r: 30, t: 60, b: 70 },
    hovermode: "x unified",
    // Transparent paper means Plotly can't infer the toolbar color, so set it
    // explicitly to follow the active theme.
    modebar: {
      bgcolor: "rgba(0,0,0,0)",
      color: c.text,
      activecolor: c.textStrong,
    },
    legend: {
      orientation: "h",
      x: 0,
      y: -0.2,
      font: { size: 13, color: c.text },
    },
  };
}

// Layout-only properties that should be reapplied on a live theme toggle.
export function themeRelayout(isDark) {
  const c = themeColors(isDark);
  return {
    "font.color": c.text,
    "xaxis.gridcolor": c.grid,
    "yaxis.gridcolor": c.grid,
    "xaxis.linecolor": c.grid,
    "yaxis.linecolor": c.grid,
    "xaxis.tickfont.color": c.text,
    "yaxis.tickfont.color": c.text,
    "xaxis.titlefont.color": c.text,
    "yaxis.titlefont.color": c.text,
    "title.font.color": c.textStrong,
    "legend.font.color": c.text,
    "modebar.color": c.text,
    "modebar.activecolor": c.textStrong,
    "modebar.bgcolor": "rgba(0,0,0,0)",
  };
}

// --- Semantic series colors -------------------------------------------------

// Shade families ordered light -> dark; index chosen by the stat (Min/Median/Avg/Max).
const FAMILY = {
  duration: ["#34d399", "#10b981", "#059669", "#047857"], // emerald
  latency: ["#fbbf24", "#f59e0b", "#d97706", "#b45309"], // amber
  edge: ["#fdba74", "#fb923c", "#f97316", "#ea580c"], // orange
};

function statIndex(key) {
  if (/Min/i.test(key)) return 0;
  if (/Median/i.test(key)) return 1;
  if (/Avg|Average/i.test(key)) return 2;
  if (/Max/i.test(key)) return 3;
  return 1;
}

// Signature color for a metric key (e.g. "MedianApiResponseLatency").
export function seriesColor(metricKey) {
  const k = metricKey || "";
  let fam = FAMILY.duration;
  if (/EdgeResponseLatency/i.test(k)) fam = FAMILY.edge;
  else if (/ApiResponseLatency|Latency/i.test(k)) fam = FAMILY.latency;
  else if (/RunLength|Duration/i.test(k)) fam = FAMILY.duration;
  return fam[statIndex(k)];
}

// Red shades for stacked error-type bars.
export const ERROR_COLORS = [
  "#ef4444",
  "#f87171",
  "#dc2626",
  "#fca5a5",
  "#b91c1c",
  "#fecaca",
  "#991b1b",
  "#7f1d1d",
];

// Harmonized region palette (keyed by common region codes; falls back by index).
export const REGION_COLORS = {
  NA: "#3b82f6",
  EU: "#8b5cf6",
  AS: "#10b981",
  OC: "#f59e0b",
  SA: "#ef4444",
  AF: "#14b8a6",
  ME: "#ec4899",
};

const REGION_FALLBACK = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#ec4899",
];

export function regionColor(region, index = 0) {
  if (region && REGION_COLORS[region.toUpperCase?.() ?? region]) {
    return REGION_COLORS[region.toUpperCase()];
  }
  return REGION_FALLBACK[index % REGION_FALLBACK.length];
}
