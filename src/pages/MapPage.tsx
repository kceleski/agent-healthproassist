
import { useEffect } from "react";
import { Helmet } from "react-helmet";

// Declare the global SP object that StorePoint provides
declare global {
  interface Window {
    SP: any;
    selectedLocation: any;
  }
}

const MapPage = () => {
  useEffect(() => {
    // This will run after the StorePoint script has loaded
    const checkSP = setInterval(function() {
      if (typeof window.SP !== 'undefined') {
        clearInterval(checkSP);
        
        // Configure map display
        window.SP.options.maxLocations = 25; // Show 25 locations at a time
        window.SP.options.defaultView = 'map'; // Start with map view
        
        // Set up event listeners for future Ava integration
        window.SP.on('markerClick', function(location: any) {
          console.log('Location selected:', location.name);
          // This will connect to our Ava AI in the future
          window.selectedLocation = location;
        });
        
        // Optional: Add custom controls to the map
        const mapControls = document.querySelector('.storepoint-map-controls');
        if (mapControls) {
          const helpButton = document.createElement('button');
          helpButton.className = 'storepoint-custom-control';
          helpButton.innerHTML = 'Get Help';
          helpButton.onclick = function() {
            alert('Ava will assist you here soon');
          };
          mapControls.appendChild(helpButton);
        }
      }
    }, 100);

    // Clean up interval on component unmount
    return () => {
      clearInterval(checkSP);
    };
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Find Senior Care Facilities</h1>
      <p className="text-muted-foreground mb-6">
        Use the interactive map below to explore senior care facilities in your area. Click on a marker to see details about each location.
      </p>
      
      {/* StorePoint Container */}
      <div id="storepoint-container" data-map-id="1645a775a8a422"></div>
      
      {/* StorePoint Custom Styles */}
      <style jsx global>{`
        #storepoint-container {
          height: 650px;
          width: 100%;
          border-radius: 10px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
          margin: 20px auto;
        }

        .storepoint-map .marker {
          transform: scale(1.2);
        }

        .gm-style-iw {
          max-width: 350px !important;
          padding: 16px !important;
        }

        .storepoint-list-item {
          padding: 14px;
          border-bottom: 1px solid #eee;
          transition: background 0.2s ease;
        }

        .storepoint-list-item:hover {
          background: #f7f7f7;
        }

        .storepoint-custom-control {
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 6px 12px;
          margin: 5px;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          #storepoint-container {
            height: 500px;
          }
        }

        @media (max-width: 480px) {
          #storepoint-container {
            height: 400px;
          }
        }
      `}</style>
      
      {/* StorePoint Script */}
      <Helmet>
        <script>
          {`
            (function(){
              var a=document.createElement("script");
              a.type="text/javascript";
              a.async=!0;
              a.src="https://cdn.storepoint.co/api/v1/js/1645a775a8a422.js";
              var b=document.getElementsByTagName("script")[0];
              b.parentNode.insertBefore(a,b);
            }());
          `}
        </script>
      </Helmet>
    </div>
  );
};

export default MapPage;
