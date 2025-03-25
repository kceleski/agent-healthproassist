
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

// Declare the global SP object that StorePoint provides
declare global {
  interface Window {
    SP: any;
    selectedLocation: any;
  }
}

const MapPage = () => {
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  useEffect(() => {
    if (isPro) {
      // This will run after the StorePoint script has loaded for premium users
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
    }
  }, [isPro]);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Senior Care Facilities</h1>
        <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
          {isPro ? 'Pro' : 'Basic'} Feature
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6">
        Use the interactive map below to explore senior care facilities in your area. Click on a marker to see details about each location.
        {!isPro && (
          <span className="ml-2 text-healthcare-600">
            Note: Basic tier has limited filtering options. <a href="/profile" className="underline">Upgrade to Pro</a> for advanced features.
          </span>
        )}
      </p>
      
      {isPro ? (
        <>
          {/* StorePoint Container for Pro users - full functionality */}
          <div id="storepoint-container" data-map-id="1645a775a8a422"></div>
          
          {/* StorePoint Custom Styles */}
          <style>
            {`
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
            `}
          </style>
          
          {/* StorePoint Script for Pro users */}
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
        </>
      ) : (
        <>
          {/* Basic tier limited map with restricted filters */}
          <div id="storepoint-container" data-tags="assisted living community,skilled nursing facility,behavioral residential facility,assisted living home (group home),veteran contracted facility,memory care community,adult day health care,adult foster care" data-map-id="1645a775a8a422"></div>
          
          {/* StorePoint Custom Styles for Basic tier */}
          <style>
            {`
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

              /* Hide the tag dropdown for basic tier */
              #storepoint-tag-dropdown{
                display: none !important;
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
            `}
          </style>
          
          {/* StorePoint Script for Basic tier */}
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
        </>
      )}
    </div>
  );
};

export default MapPage;
