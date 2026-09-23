import { useEffect, useState } from 'preact/hooks';

export default function ErrorGraphLazy({ detailsId, ...props }) {
  const [Chart, setChart] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const details = document.getElementById(detailsId);
    if (!details) return;
    let active = true, started = false;
    const load = () => {
      if (!details.open || started) return;
      started = true;
      setFailed(false);
      import('./ErrorGraph.js').then(module => {
        if (active) setChart(() => module.default);
      }).catch(() => {
        started = false;
        if (active) setFailed(true);
      });
    };
    details.addEventListener('toggle', load);
    load();
    return () => { active = false; details.removeEventListener('toggle', load); };
  }, [detailsId]);
  if (Chart) return <Chart {...props} />;
  return <p role="status" className="chart-state">{failed ? 'Chart unavailable. Close and reopen to retry.' : 'Loading chart…'}</p>;
}
