import { useState, useEffect, useRef } from 'preact/hooks';

/**
 * SmartGraphLazy - A wrapper component that lazily loads the SmartGraph component
 * when the parent details element is opened
 * 
 * @param {Object} props - Component props
 * @param {string} props.detailsId - ID of the details element to watch
 * @param {string} props.endpoint - API endpoint to pass to SmartGraph
 * @param {string} props.label - Label to pass to SmartGraph
 * @param {Array} props.options - Options to pass to SmartGraph
 * @param {Object} props.additionalProps - Any additional props to pass to SmartGraph
 */
const SmartGraphLazy = ({ detailsId, endpoint, label, options, ...additionalProps }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [SmartGraph, setSmartGraph] = useState(null);
  const loadStarted = useRef(false);

  useEffect(() => {
    // Find the details element we need to watch
    const detailsElement = document.getElementById(detailsId);
    
    if (!detailsElement) {
      console.error(`Could not find details element with ID: ${detailsId}`);
      return;
    }

    // Set up the event listener for the details element being opened
    const handleDetailsToggle = () => {
      if (detailsElement.open && !loadStarted.current) {
        loadStarted.current = true;
        
        // Dynamically import the SmartGraph component
        import('./SmartGraph').then(module => {
          setSmartGraph(() => module.default);
          setIsLoaded(true);
        }).catch(error => {
          console.error('Failed to load SmartGraph component:', error);
          loadStarted.current = false;
        });
      }
    };

    // Initial check in case the details is already open
    if (detailsElement.open) {
      handleDetailsToggle();
    }

    detailsElement.addEventListener('toggle', handleDetailsToggle);
    
    // Clean up the event listener
    return () => {
      detailsElement.removeEventListener('toggle', handleDetailsToggle);
    };
  }, [detailsId]);

  // Show loading state if the component is being loaded
  if (loadStarted.current && !isLoaded) {
    return (
      <div class="h-full w-full flex items-center justify-center">
        <div class="animate-pulse text-gray-600">Loading graph...</div>
      </div>
    );
  }

  // Render SmartGraph if it's loaded
  if (isLoaded && SmartGraph) {
    return <SmartGraph 
      endpoint={endpoint} 
      label={label} 
      options={options} 
      {...additionalProps} 
    />;
  }

  // Render placeholder before details is opened
  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="text-gray-400">Loading graph...</div>
    </div>
  );
};

export default SmartGraphLazy;