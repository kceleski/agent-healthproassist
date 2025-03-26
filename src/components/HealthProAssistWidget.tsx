
import { useEffect, useRef } from 'react';

const HealthProAssistWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the script
    const script = document.createElement('script');
    script.src = 'https://tuna-primrose-r48r.squarespace.com/health-pro-assist.umd.js';
    script.async = true;
    script.onload = () => {
      // Create and append the custom element after the script loads
      if (containerRef.current) {
        const widgetElement = document.createElement('healthproassist');
        containerRef.current.appendChild(widgetElement);
      }
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="health-pro-assist-container"></div>;
};

export default HealthProAssistWidget;
