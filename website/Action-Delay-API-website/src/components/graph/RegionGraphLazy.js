import { useEffect, useState } from 'react';

const RegionGraphLazy = ({ detailsId, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [RegionGraph, setRegionGraph] = useState(null);

  useEffect(() => {
    const details = document.getElementById(detailsId);
    if (!details) return;
    const handler = () => {
      if (details.open && !loaded) {
        import('./RegionGraph.js').then(m => {
          setRegionGraph(() => m.default);
          setLoaded(true);
        });
      }
    };
    details.addEventListener('toggle', handler);
    return () => details.removeEventListener('toggle', handler);
  }, [detailsId, loaded]);

  return loaded && RegionGraph ? <RegionGraph {...props} /> : (
    <div className="text-gray-500 text-sm p-4">Open to load regional breakdown...</div>
  );
};

export default RegionGraphLazy;
