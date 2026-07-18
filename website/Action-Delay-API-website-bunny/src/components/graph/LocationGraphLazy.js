import { useEffect, useState } from 'react';

const LocationGraphLazy = ({ detailsId, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [LocationGraph, setLocationGraph] = useState(null);

  useEffect(() => {
    const details = document.getElementById(detailsId);
    if (!details) return;
    const handler = () => {
      if (details.open && !loaded) {
        import('./LocationGraph.js').then(m => {
          setLocationGraph(() => m.default);
          setLoaded(true);
        });
      }
    };
    // Load immediately if it's already open (e.g. `<details open>`), otherwise wait for toggle.
    handler();
    details.addEventListener('toggle', handler);
    return () => details.removeEventListener('toggle', handler);
  }, [detailsId, loaded]);

  return loaded && LocationGraph ? <LocationGraph {...props} /> : (
    <div className="text-gray-500 text-sm p-4">Open to load per-location latency...</div>
  );
};

export default LocationGraphLazy;
