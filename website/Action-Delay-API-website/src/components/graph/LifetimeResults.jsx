import CompareTooltip from './CompareTooltip';
import { formatLifetimeDuration, lifetimePercentage } from '../../lib/compare/lifetime';
import { rawValue } from '../../lib/compare/scale';
import { compareColor } from './chartTheme';

const thresholds = [['atLeast1HourCount', '≥1 h'], ['atLeast6HoursCount', '≥6 h'], ['atLeast24HoursCount', '≥24 h']];
function Duration({ value }) {
  return <CompareTooltip label={`${formatLifetimeDuration(value)}; base value ${rawValue(value, 'ms')}`}>{formatLifetimeDuration(value)}</CompareTooltip>;
}
function Percentage({ count, total, color }) {
  const percent = lifetimePercentage(count, total);
  if (percent === null) return <span aria-label="No percentage available">—</span>;
  return <CompareTooltip label={`${count.toLocaleString()} of ${total.toLocaleString()} reports`}>
    <span className="relative inline-block min-w-16 py-1">
      <span aria-hidden="true" className="absolute left-0 bottom-0 h-1 rounded opacity-40" style={{ width: `${percent}%`, backgroundColor: color }} />
      {Number(percent.toFixed(1))}%
    </span>
  </CompareTooltip>;
}
function Source({ row, color }) {
  return <span><span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: color }} /><CompareTooltip label={row.sourceId}>{row.label}</CompareTooltip></span>;
}
function Reports({ count }) {
  return <span>{count.toLocaleString()}{count > 0 && count < 5 && <small className="block text-gray-500 dark:text-gray-400">Limited reports</small>}</span>;
}
export default function LifetimeResults({ result }) {
  if (result.lifetimeSummaryUnavailable) return <p role="status">Lifetime summary unavailable. See Changes over time for available reports.</p>;
  const rows = result.lifetimeSummary ?? [];
  if (!rows.length) return <p>No reports in this window.</p>;
  const color = (row, index) => {
    const chartIndex = result.series.findIndex(s => s.sourceId === row.sourceId);
    return compareColor(row.label, chartIndex < 0 ? index : chartIndex);
  };
  const ranges = rows.filter(r => r.count > 0 && [r.p10Duration, r.medianDuration, r.p90Duration].every(v => typeof v === 'number' && Number.isFinite(v)) && r.p10Duration <= r.medianDuration && r.medianDuration <= r.p90Duration);
  const maximum = Math.max(1, ...ranges.map(r => r.p90Duration));
  return <section className="my-4" aria-label="Reported connection lifetimes">
    <h3 className="font-medium mb-3">Duration thresholds</h3>
    {result.lifetimeThresholdsUnavailable && <p role="status" className="text-sm mb-3">Duration percentages unavailable.</p>}
    <div className="hidden md:block">
      <table className="w-full text-sm text-left">
        <thead><tr className="border-b border-gray-200 dark:border-gray-700">
          {['Source', 'Median lifetime', ...thresholds.map(t => t[1]), 'Reports'].map(t => <th key={t} scope="col" className="py-2 pr-4 font-medium">{t}</th>)}
        </tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row.sourceId} className="border-b border-gray-100 dark:border-gray-800">
          <th scope="row" className="py-2.5 pr-4 font-medium"><Source row={row} color={color(row,index)} /></th>
          <td className="pr-4"><Duration value={row.medianDuration} /></td>
          {thresholds.map(([key]) => <td key={key} className="pr-4"><Percentage count={row[key]} total={row.count} color={color(row,index)} /></td>)}
          <td><Reports count={row.count} /></td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="md:hidden grid gap-2 items-stretch">{rows.map((row,index) => <article key={row.sourceId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2.5">
      <h4 className="font-medium text-sm"><Source row={row} color={color(row,index)} /></h4>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
        <div className="col-span-2"><dt className="text-xs text-gray-500 dark:text-gray-400">Median lifetime</dt><dd><Duration value={row.medianDuration} /></dd></div>
        <div><dt className="text-xs text-gray-500 dark:text-gray-400">Reports</dt><dd><Reports count={row.count} /></dd></div>
        {thresholds.map(([key,label]) => <div key={key}><dt>{label}</dt><dd><Percentage count={row[key]} total={row.count} color={color(row,index)} /></dd></div>)}
      </dl>
    </article>)}</div>
    {ranges.length > 0 && <details className="mt-5">
      <summary className="cursor-pointer font-medium text-sm">Lifetime range</summary>
      <p className="text-xs text-gray-500 dark:text-gray-400 my-3">Middle 80% of reported lifetimes. The marker shows the median; all rows share the same scale.</p>
      <div className="flex justify-between text-xs mb-3"><span>0 s</span><span>{formatLifetimeDuration(maximum)}</span></div>
      {ranges.map(row => <div key={row.sourceId} className="mb-4">
        <div className="text-sm mb-2"><Source row={row} color={color(row,rows.indexOf(row))} /></div>
        <div role="img" aria-label={`${row.label}: middle 80% ${formatLifetimeDuration(row.p10Duration)} to ${formatLifetimeDuration(row.p90Duration)}, median ${formatLifetimeDuration(row.medianDuration)}`} className="relative h-5 bg-gray-100 dark:bg-slate-800 rounded">
          <span className="absolute h-3 top-1 rounded opacity-40" style={{ left: `${row.p10Duration/maximum*100}%`, width: `${(row.p90Duration-row.p10Duration)/maximum*100}%`, backgroundColor: color(row,rows.indexOf(row)) }} />
          <span className="absolute h-5 w-1 -translate-x-1/2 rounded" style={{ left: `${row.medianDuration/maximum*100}%`, backgroundColor: color(row,rows.indexOf(row)) }} />
        </div>
        <p className="text-xs mt-1"><Duration value={row.p10Duration} /> – <Duration value={row.p90Duration} /> · Median <Duration value={row.medianDuration} />{row.count < 5 && ' · Limited reports'}</p>
      </div>)}
    </details>}
    <details className="mt-4 text-sm"><summary className="cursor-pointer">Source details</summary>
      {rows.map(row => <p key={row.sourceId} className="mt-3 break-words"><strong>{row.label}</strong> · {row.sourceId}<br />
        {row.lastReportedAt ? <>Latest report: <time dateTime={row.lastReportedAt}>{new Date(row.lastReportedAt).toLocaleString()}</time></> : 'No reports in this window.'}
      </p>)}
    </details>
  </section>;
}
