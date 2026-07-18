import { useEffect, useState } from 'react';

const SuccessRateGraphLazy = ({ detailsId, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [SuccessRateGraph, setSuccessRateGraph] = useState(null);

  useEffect(() => {
    const details = document.getElementById(detailsId);
    if (!details) return;
    const handler = () => {
      if (details.open && !loaded) {
        import('./SuccessRateGraph.js').then(m => {
          setSuccessRateGraph(() => m.default);
          setLoaded(true);
        });
      }
    };
    // Load immediately if it's already open (e.g. `<details open>`), otherwise wait for toggle.
    handler();
    details.addEventListener('toggle', handler);
    return () => details.removeEventListener('toggle', handler);
  }, [detailsId, loaded]);

  return loaded && SuccessRateGraph ? <SuccessRateGraph {...props} /> : (
    <div className="text-gray-500 text-sm p-4">Open to load success rate...</div>
  );
};

export default SuccessRateGraphLazy;
