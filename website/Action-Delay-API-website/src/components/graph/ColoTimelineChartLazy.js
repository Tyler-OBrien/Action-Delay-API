import { useState, useEffect, useRef } from 'preact/hooks';

const ColoTimelineChartLazy = ({ detailsId, locationName }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ColoTimelineChart, setColoTimelineChart] = useState(null);
  const loadStarted = useRef(false);

  useEffect(() => {
    const detailsElement = document.getElementById(detailsId);

    if (!detailsElement) {
      console.error(`Could not find details element with ID: ${detailsId}`);
      return;
    }

    const handleDetailsToggle = () => {
      if (detailsElement.open && !loadStarted.current) {
        loadStarted.current = true;
        import('./ColoTimelineChart').then(module => {
          setColoTimelineChart(() => module.default);
          setIsLoaded(true);
        }).catch(error => {
          console.error('Failed to load ColoTimelineChart component:', error);
          loadStarted.current = false;
        });
      }
    };

    if (detailsElement.open) {
      handleDetailsToggle();
    }

    detailsElement.addEventListener('toggle', handleDetailsToggle);
    return () => {
      detailsElement.removeEventListener('toggle', handleDetailsToggle);
    };
  }, [detailsId]);

  if (loadStarted.current && !isLoaded) {
    return (
      <div class="h-full w-full flex items-center justify-center">
        <div class="animate-pulse text-gray-600">Loading graph...</div>
      </div>
    );
  }

  if (isLoaded && ColoTimelineChart) {
    return <ColoTimelineChart locationName={locationName} />;
  }

  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="text-gray-400">Loading graph...</div>
    </div>
  );
};

export default ColoTimelineChartLazy;
