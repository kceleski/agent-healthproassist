import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';

const HealthProAssistWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We'll create and append the custom element after ensuring the script is loaded
    if (containerRef.current) {
      // Check if the script has been loaded
      const scriptLoaded = () => {
        if (containerRef.current && !containerRef.current.querySelector('healthproassist')) {
          const widgetElement = document.createElement('healthproassist');
          containerRef.current.appendChild(widgetElement);
        }
      };

      // Try to create element if window.customElements exists
      if (window.customElements && window.customElements.get('healthproassist')) {
        scriptLoaded();
      } else {
        // Otherwise wait for the script to load
        const checkInterval = setInterval(() => {
          if (window.customElements && window.customElements.get('healthproassist')) {
            scriptLoaded();
            clearInterval(checkInterval);
          }
        }, 100);

        // Clear interval after 10 seconds as a failsafe
        setTimeout(() => clearInterval(checkInterval), 10000);
        return () => clearInterval(checkInterval);
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <script src="https://tuna-primrose-r48r.squarespace.com/health-pro-assist.umd.js" async />
      </Helmet>
      <div ref={containerRef} className="health-pro-assist-container"></div>
    </>
  );
};

export default HealthProAssistWidget;
