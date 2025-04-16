import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import { MapPin, Search, Map } from "lucide-react";

const SERP_API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

declare global {
  interface Window {
    SP: any;
    selectedLocation: any;
  }
}

const careTypes = [
  { id: "any", label: "Any Care Type" },
  { id: "assisted_living", label: "Assisted Living" },
  { id: "memory_care", label: "Memory Care" },
  { id: "skilled_nursing", label: "Skilled Nursing" },
  { id: "independent_living", label: "Independent Living" },
];

const amenities = [
  { id: "dining", label: "Fine Dining" },
  { id: "transport", label: "Transportation" },
  { id: "activities", label: "Social Activities" },
  { id: "pets", label: "Pet Friendly" },
  { id: "medical", label: "24/7 Medical Staff" },
  { id: "rehab", label: "Rehabilitation Services" },
];

interface Facility {
  id: string;
  name: string;
  address: string;
  rating: number;
  description?: string;
  url?: string;
  latitude: number;
  longitude: number;
}

const MapPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  const [location, setLocation] = useState<string>("");
  const [selectedCareType, setSelectedCareType] = useState<string>("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Facility[]>([]);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((current) => {
      if (current.includes(amenityId)) {
        return current.filter((id) => id !== amenityId);
      } else {
        return [...current, amenityId];
      }
    });
  };

  const handleSearch = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      let query = location;
      
      if (selectedCareType !== "any") {
        const careTypeLabel = careTypes.find(type => type.id === selectedCareType)?.label;
        query += ` ${careTypeLabel}`;
      }
      
      if (selectedAmenities.length > 0) {
        const amenityLabels = selectedAmenities.map(id => 
          amenities.find(amenity => amenity.id === id)?.label
        ).join(" ");
        query += ` ${amenityLabels}`;
      }
      
      query += " senior care facility";
      
      console.log("Searching for:", query);
      
      const apiUrl = `https://www.searchapi.io/api/v1/search?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("SearchAPI response:", data);
      
      const results = data.local_results || data.places_results || [];
      
      if (results && results.length > 0) {
        const facilities = results.map((item: any) => ({
          id: item.place_id || Math.random().toString(36).substring(2),
          name: item.title,
          address: item.address || "",
          rating: parseFloat(item.rating || 0),
          description: item.description || item.type || "Senior care facility",
          url: item.website || "",
          latitude: item.gps_coordinates?.latitude || 0,
          longitude: item.gps_coordinates?.longitude || 0,
        }));
        
        setSearchResults(facilities);
        
        if (window.SP && isPro) {
          window.SP.map.clearMarkers();
          
          facilities.forEach((facility: Facility) => {
            if (facility.latitude && facility.longitude) {
              window.SP.map.addMarker({
                id: facility.id,
                lat: facility.latitude,
                lng: facility.longitude,
                title: facility.name,
                address: facility.address,
                description: facility.description || "",
                website: facility.url || "",
              });
            }
          });
          
          if (facilities.length > 0 && facilities[0].latitude && facilities[0].longitude) {
            window.SP.map.setCenter(facilities[0].latitude, facilities[0].longitude);
          } else {
            window.SP.map.setLocation(location);
          }
        } else {
          if (window.SP) {
            window.SP.map.setLocation(query);
          }
        }
        
        toast({
          title: "Search Complete",
          description: `Found ${facilities.length} facilities matching your criteria.`,
        });
      } else {
        setSearchResults([]);
        toast({
          title: "No Results",
          description: "No facilities found matching your criteria.",
        });
        
        if (window.SP) {
          window.SP.map.setLocation(location);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search facilities. Please try again later.",
        variant: "destructive",
      });
    }
    
    setIsSearching(false);
  };

  useEffect(() => {
    if (isPro) {
      const checkSP = setInterval(function() {
        if (typeof window.SP !== 'undefined') {
          clearInterval(checkSP);
          
          window.SP.options.maxLocations = 25;
          window.SP.options.defaultView = 'map';
          
          window.SP.on('markerClick', function(location: any) {
            console.log('Location selected:', location.name);
            window.selectedLocation = location;
          });
          
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

      return () => {
        clearInterval(checkSP);
      };
    }
  }, [isPro]);

  return (
    <div className="container py-10">
      <Helmet>
        <title>Interactive Care Facility Map - HealthProAssist</title>
        <meta name="description" content="Explore senior care facilities with our interactive map. Find assisted living, memory care, and more." />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Map className="h-6 w-6 text-healthcare-600" />
            <h1 className="text-3xl font-bold tracking-tight">Care Facility Map</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            View and explore locations of senior care facilities on our interactive map
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
            {isPro ? 'Pro' : 'Basic'} Feature
          </Badge>
          <Button asChild variant="outline">
            <Link to="/facility-search">Advanced Search</Link>
          </Button>
        </div>
      </div>
      
      <div className="bg-healthcare-50 p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="self-end">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-healthcare-600 hover:bg-healthcare-700"
            >
              {isSearching ? "Searching..." : "Update Map"}
            </Button>
          </div>
        </div>
        
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
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-healthcare-600" />
            Interactive Map
          </h2>
          {isPro ? (
            <Badge className="bg-healthcare-600">Pro Map Features Enabled</Badge>
          ) : (
            <Badge variant="outline" className="text-healthcare-600">
              <Link to="/profile" className="hover:underline">Upgrade to Pro</Link>
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Browse the map below to locate senior care facilities in your area. Click on a marker to view more details.
          For more advanced search options, use our <Link to="/facility-search" className="text-healthcare-600 hover:underline">dedicated search page</Link>.
        </p>
      </div>
      
      {isPro ? (
        <>
          <div id="storepoint-container" data-map-id="1645a775a8a422"></div>
          
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
          <div id="storepoint-container" data-tags="assisted living community,skilled nursing facility,behavioral residential facility,assisted living home (group home),veteran contracted facility,memory care community,adult day health care,adult foster care" data-map-id="1645a775a8a422"></div>
          
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

              #storepoint-tag-dropdown{
                display: none !important;
              }

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

      <div className="mt-8 bg-healthcare-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-healthcare-700 mb-3">Map Features</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Click on map markers to view facility details</li>
          <li>Use the search box to find facilities in specific locations</li>
          <li>Switch between map and list views</li>
          {isPro && (
            <>
              <li>Filter by facility type and amenities (Pro feature)</li>
              <li>Save favorite facilities for later reference (Pro feature)</li>
            </>
          )}
        </ul>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/facility-search">
              Go to Advanced Search
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
