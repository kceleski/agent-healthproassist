
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Map, Search, Heart, ArrowLeft } from "lucide-react";

const SERP_API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

// Define careTypes and amenities that were missing
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

declare global {
  interface Window {
    SP: any;
    selectedLocation: any;
  }
}

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
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Facility[]>([]);
  const [savedFacilities, setSavedFacilities] = useState<string[]>([]);

  // Initialize map and load search params
  useEffect(() => {
    // Load search parameters from session storage
    const params = sessionStorage.getItem('facilitySearchParams');
    if (params) {
      setSearchParams(JSON.parse(params));
    }
    
    // Load saved facilities from local storage
    const saved = localStorage.getItem('savedFacilities');
    if (saved) {
      setSavedFacilities(JSON.parse(saved));
    }

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
        }
      }, 100);

      return () => {
        clearInterval(checkSP);
      };
    }
  }, [isPro]);

  // Perform search when parameters are loaded
  useEffect(() => {
    if (searchParams && searchParams.query) {
      performSearch(searchParams.query);
    }
  }, [searchParams]);

  // Save/unsave facility
  const toggleSaveFacility = (facility: Facility) => {
    setSavedFacilities(prev => {
      let updated;
      
      if (prev.includes(facility.id)) {
        updated = prev.filter(id => id !== facility.id);
        toast.success(`Removed ${facility.name} from favorites`);
      } else {
        updated = [...prev, facility.id];
        toast.success(`Added ${facility.name} to favorites`);
        
        // Also save the facility details
        const savedDetails = localStorage.getItem('facilityDetails');
        const details = savedDetails ? JSON.parse(savedDetails) : {};
        details[facility.id] = facility;
        localStorage.setItem('facilityDetails', JSON.stringify(details));
      }
      
      localStorage.setItem('savedFacilities', JSON.stringify(updated));
      return updated;
    });
  };

  const performSearch = async (query: string) => {
    setIsLoading(true);
    
    try {
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
            window.SP.map.setLocation(searchParams.location);
          }
        } else {
          if (window.SP) {
            window.SP.map.setLocation(query);
          }
        }
        
        toast.success(`Found ${facilities.length} facilities matching your criteria.`);
      } else {
        setSearchResults([]);
        toast.error("No facilities found matching your criteria.");
        
        if (window.SP) {
          window.SP.map.setLocation(searchParams.location);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Unable to search facilities. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveFacilityDetails = (facility: Facility) => {
    // Save to session storage for viewing details
    sessionStorage.setItem('currentFacility', JSON.stringify(facility));
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>Facility Map Results - HealthProAssist</title>
        <meta name="description" content="View search results of senior care facilities on our interactive map." />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Map className="h-6 w-6 text-healthcare-600" />
            <h1 className="text-3xl font-bold tracking-tight">Facility Map</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            View search results on our interactive map
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
            {isPro ? 'Pro' : 'Basic'} Feature
          </Badge>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link to="/search">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>
      
      {searchParams && (
        <Alert className="mb-6 bg-healthcare-50">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium">Search Query:</span> 
            <span className="text-healthcare-700">{searchParams.location}</span>
            
            {searchParams.careType !== "any" && (
              <Badge variant="outline" className="bg-healthcare-100">
                {careTypes.find(type => type.id === searchParams.careType)?.label}
              </Badge>
            )}
            
            {searchParams.amenities && searchParams.amenities.map((amenityId: string) => (
              <Badge key={amenityId} variant="outline" className="bg-healthcare-100">
                {amenities.find(a => a.id === amenityId)?.label}
              </Badge>
            ))}
          </div>
          <AlertDescription>
            <div className="flex mt-2 gap-2">
              <Button 
                asChild 
                variant="outline" 
                size="sm"
              >
                <Link to="/search">Modify Search</Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => searchParams && performSearch(searchParams.query)}
                disabled={isLoading}
              >
                Refresh Results
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {!searchParams && (
        <Alert className="mb-6">
          <AlertDescription>
            No search criteria found. Please return to the search page to start a new search.
            <div className="mt-2">
              <Button 
                asChild 
                variant="default" 
                size="sm"
              >
                <Link to="/search">Go to Search</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-healthcare-50 p-4 rounded-lg mb-4">
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
          </div>
          
          <div id="storepoint-container" data-map-id="1645a775a8a422"></div>
          
          <style>
            {`
              #storepoint-container {
                height: 650px;
                width: 100%;
                border-radius: 10px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.15);
                margin-bottom: 20px;
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

              #storepoint-tag-dropdown {
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
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-healthcare-600"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults.map((facility) => (
                    <div key={facility.id} className="py-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{facility.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={savedFacilities.includes(facility.id) ? 'text-red-500' : ''}
                          onClick={() => toggleSaveFacility(facility)}
                        >
                          <Heart className="h-4 w-4" fill={savedFacilities.includes(facility.id) ? 'currentColor' : 'none'} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{facility.address}</p>
                      {facility.rating > 0 && (
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm">{facility.rating.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button
                          asChild 
                          variant="outline"
                          size="sm"
                          onClick={() => saveFacilityDetails(facility)}
                        >
                          <Link to={`/facilities/${facility.id}`}>View Details</Link>
                        </Button>
                        {facility.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a 
                              href={facility.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No results found. Try modifying your search criteria.
                </p>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                >
                  <Link to="/favorites">
                    <Heart className="h-4 w-4 mr-2" />
                    View Saved Facilities
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
