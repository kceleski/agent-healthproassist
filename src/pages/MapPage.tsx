
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

// Declare the global SP object that StorePoint provides
declare global {
  interface Window {
    SP: any;
    selectedLocation: any;
  }
}

// Care type options
const careTypes = [
  { id: "any", label: "Any Care Type" },
  { id: "assisted_living", label: "Assisted Living" },
  { id: "memory_care", label: "Memory Care" },
  { id: "skilled_nursing", label: "Skilled Nursing" },
  { id: "independent_living", label: "Independent Living" },
];

// Amenity options
const amenities = [
  { id: "dining", label: "Fine Dining" },
  { id: "transport", label: "Transportation" },
  { id: "activities", label: "Social Activities" },
  { id: "pets", label: "Pet Friendly" },
  { id: "medical", label: "24/7 Medical Staff" },
  { id: "rehab", label: "Rehabilitation Services" },
];

const MapPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  // Search state
  const [location, setLocation] = useState<string>("");
  const [selectedCareType, setSelectedCareType] = useState<string>("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Toggle amenity selection
  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((current) => {
      if (current.includes(amenityId)) {
        return current.filter((id) => id !== amenityId);
      } else {
        return [...current, amenityId];
      }
    });
  };
  
  // Handle search submission
  const handleSearch = () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Construct the search query for StorePoint
    let searchQuery = location;
    
    // Reset search after brief delay to simulate loading
    setTimeout(() => {
      // If we have access to the StorePoint API object
      if (window.SP) {
        // Set the location search
        window.SP.map.setLocation(searchQuery);
        
        // Apply filters if they exist in the SP API
        if (selectedCareType !== "any") {
          // This would need to be adapted to how StorePoint filtering works
          console.log("Filtering by care type:", selectedCareType);
        }
        
        if (selectedAmenities.length > 0) {
          console.log("Filtering by amenities:", selectedAmenities);
        }
      }
      
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: "Map updated with your search criteria.",
      });
    }, 1000);
  };
  
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
        <h1 className="text-3xl font-bold tracking-tight">Senior Care Facility Map</h1>
        <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
          {isPro ? 'Pro' : 'Basic'} Feature
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6">
        Find and explore senior care facilities across the country with our interactive map. Search by location and filter by facility type.
        {!isPro && (
          <span className="ml-2 text-healthcare-600">
            Note: Basic tier has limited search options. <a href="/profile" className="underline">Upgrade to Pro</a> for advanced features.
          </span>
        )}
      </p>
      
      {/* Search Controls */}
      <div className="bg-healthcare-50 p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Search */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-healthcare-700">Location</Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="City, state or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Care Type */}
          <div className="space-y-2">
            <Label htmlFor="care-type" className="text-healthcare-700">Care Type</Label>
            <Select
              value={selectedCareType}
              onValueChange={setSelectedCareType}
              disabled={!isPro}
            >
              <SelectTrigger id="care-type">
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent>
                {careTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isPro && (
              <p className="text-xs text-healthcare-600">Advanced filtering requires Pro tier</p>
            )}
          </div>
          
          {/* Search Button */}
          <div className="self-end">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-healthcare-600 hover:bg-healthcare-700"
            >
              {isSearching ? "Searching..." : "Search Map"}
            </Button>
          </div>
        </div>
        
        {/* Amenities - Pro only */}
        {isPro && (
          <div className="mt-4 pt-4 border-t border-healthcare-200">
            <Label className="text-healthcare-700 mb-3 block">Amenities (Pro Feature)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <label
                    htmlFor={`amenity-${amenity.id}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
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
