import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { getUserTier } from '@/utils/subscription';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Heart, ArrowLeft, Filter } from "lucide-react";
import GoogleMapsView from "@/components/maps/GoogleMapsView";
import { saveSearchResult } from '@/services/searchResultService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const isMobile = useIsMobile();
  
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Facility[]>([]);
  const [savedFacilities, setSavedFacilities] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchSaved, setSearchSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('map');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = sessionStorage.getItem('facilitySearchParams');
    if (params) {
      setSearchParams(JSON.parse(params));
      setHasSearched(true); // Set to true if search params exist in session storage
    }
    
    const saved = localStorage.getItem('savedFacilities');
    if (saved) {
      setSavedFacilities(JSON.parse(saved));
    }
    
    const searches = localStorage.getItem('savedSearches');
    if (searches) {
      setSavedSearches(JSON.parse(searches));
    }
  }, []);

  useEffect(() => {
    const checkUserTier = async () => {
      if (user) {
        const tier = await getUserTier(user);
        setIsPro(tier === 'premium');
      }
    };
    
    checkUserTier();
  }, [user]);

  const toggleSaveFacility = (facility: Facility) => {
    setSavedFacilities(prev => {
      let updated;
      
      if (prev.includes(facility.id)) {
        updated = prev.filter(id => id !== facility.id);
        toast.success(`Removed ${facility.name} from favorites`);
      } else {
        updated = [...prev, facility.id];
        toast.success(`Added ${facility.name} to favorites`);
        
        const savedDetails = localStorage.getItem('facilityDetails');
        const details = savedDetails ? JSON.parse(savedDetails) : {};
        details[facility.id] = facility;
        localStorage.setItem('facilityDetails', JSON.stringify(details));
      }
      
      localStorage.setItem('savedFacilities', JSON.stringify(updated));
      return updated;
    });
  };

  const saveFacilityDetails = (facility: Facility) => {
    sessionStorage.setItem('currentFacility', JSON.stringify(facility));
  };

  const handleRefreshSearch = async () => {
    if (searchParams) {
      setIsLoading(true);
      try {
        const query = searchParams.query;
        await saveSearchResult({
          query,
          location: searchParams.location,
          facility_type: searchParams.careType,
          amenities: searchParams.amenities,
          results: []
        });
        setHasSearched(true); // Set to true when search is refreshed
        setIsLoading(false);
      } catch (error) {
        console.error('Error refreshing search:', error);
        toast.error('Failed to refresh search');
        setIsLoading(false);
      }
    }
  };
  
  const handleSaveSearch = () => {
    if (searchParams && searchResults.length > 0) {
      const newSavedSearch = {
        id: Date.now().toString(),
        query: searchParams.query,
        location: searchParams.location,
        careType: searchParams.careType,
        amenities: searchParams.amenities,
        results: searchResults,
        date: new Date().toISOString()
      };
      
      const updatedSearches = [...savedSearches, newSavedSearch];
      setSavedSearches(updatedSearches);
      localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
      
      setSearchSaved(true);
      toast.success('Search saved successfully');
    } else {
      toast.error('No search results to save');
    }
  };
  
  const loadSavedSearch = (savedSearch: any) => {
    setSearchParams(savedSearch);
    sessionStorage.setItem('facilitySearchParams', JSON.stringify(savedSearch));
    
    setSearchResults(savedSearch.results || []);
    setHasSearched(true); // Set to true when a saved search is loaded
    
    toast.success('Saved search loaded successfully');
  };

  return (
    <div className="container py-6 pt-20">
      <Helmet>
        <title>Facility Map Results - HealthProAssist</title>
        <meta name="description" content="View search results of senior care facilities on our interactive map." />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-healthcare-600" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Facility Map</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            View and explore senior care facilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1 hidden sm:flex">
            {isPro ? 'Pro' : 'Basic'} Feature
          </Badge>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link to="/search">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Search</span>
            </Link>
          </Button>
        </div>
      </div>

      {searchParams && (
        <Alert className="mb-6 bg-healthcare-50">
          <div className="flex flex-wrap gap-2 items-center text-sm md:text-base">
            <span className="font-medium">Search:</span> 
            <span className="text-healthcare-700">{searchParams.location}</span>
            
            {searchParams.careType !== "any" && (
              <Badge variant="outline" className="bg-healthcare-100">
                {careTypes.find(type => type.id === searchParams.careType)?.label}
              </Badge>
            )}
            
            {searchParams.amenities && searchParams.amenities.length > 0 && (
              <Badge variant="outline" className="bg-healthcare-100">
                {searchParams.amenities.length} amenities
              </Badge>
            )}
          </div>
          <AlertDescription>
            <div className="flex mt-2 gap-2">
              <Button 
                asChild 
                variant="outline" 
                size="sm"
              >
                <Link to="/search">Modify</Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSearch}
                disabled={isLoading}
              >
                Refresh
              </Button>

              {!searchSaved && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveSearch}
                  disabled={isLoading || !searchResults.length}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Mobile Tabs View */}
      {isMobile && (
        <Tabs 
          defaultValue="map" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="list">Results</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="mt-0">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Interactive Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <GoogleMapsView hasSearched={hasSearched} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Search Results</CardTitle>
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
                                Website
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
          </TabsContent>
          
          <TabsContent value="filters" className="mt-0">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center text-lg">
                  <Filter className="h-5 w-5 mr-2" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {careTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`care-type-mobile-${type.id}`}
                        name="careType"
                        className="mr-2"
                        checked={searchParams?.careType === type.id}
                        onChange={() => {
                          if (searchParams) {
                            const updatedParams = { ...searchParams, careType: type.id };
                            setSearchParams(updatedParams);
                          }
                        }}
                      />
                      <label htmlFor={`care-type-mobile-${type.id}`} className="text-sm">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-mobile-${amenity.id}`}
                          className="mr-2"
                          checked={searchParams?.amenities?.includes(amenity.id) || false}
                          onChange={() => {
                            if (searchParams) {
                              const updatedAmenities = searchParams.amenities?.includes(amenity.id)
                                ? searchParams.amenities.filter((id: string) => id !== amenity.id)
                                : [...(searchParams.amenities || []), amenity.id];
                              
                              const updatedParams = { 
                                ...searchParams, 
                                amenities: updatedAmenities 
                              };
                              setSearchParams(updatedParams);
                            }
                          }}
                        />
                        <label htmlFor={`amenity-mobile-${amenity.id}`} className="text-sm">
                          {amenity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="default" 
                  className="w-full mt-4"
                  onClick={() => {
                    handleRefreshSearch();
                    setActiveTab('map');
                  }}
                >
                  Apply Filters
                </Button>

                {savedSearches.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-medium mb-2">Saved Searches</h3>
                    <div className="space-y-2">
                      {savedSearches.slice(0, 3).map((search) => (
                        <div 
                          key={search.id} 
                          className="p-2 border rounded hover:bg-muted cursor-pointer"
                          onClick={() => {
                            loadSavedSearch(search);
                            setActiveTab('map');
                          }}
                        >
                          <div className="font-medium">{search.location}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(search.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="mb-6">
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

            {savedSearches.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Saved Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedSearches.map((search) => (
                      <div 
                        key={search.id} 
                        className="p-2 border rounded hover:bg-muted cursor-pointer"
                        onClick={() => loadSavedSearch(search)}
                      >
                        <div className="font-medium">{search.location}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(search.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!searchSaved && searchResults.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Save Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleSaveSearch}
                  >
                    Save This Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Interactive Facility Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <GoogleMapsView hasSearched={hasSearched} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {careTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`care-type-${type.id}`}
                        name="careType"
                        className="mr-2"
                        checked={searchParams?.careType === type.id}
                        onChange={() => {
                          if (searchParams) {
                            const updatedParams = { ...searchParams, careType: type.id };
                            setSearchParams(updatedParams);
                          }
                        }}
                      />
                      <label htmlFor={`care-type-${type.id}`} className="text-sm">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Amenities</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity.id}`}
                          className="mr-2"
                          checked={searchParams?.amenities?.includes(amenity.id) || false}
                          onChange={() => {
                            if (searchParams) {
                              const updatedAmenities = searchParams.amenities?.includes(amenity.id)
                                ? searchParams.amenities.filter((id: string) => id !== amenity.id)
                                : [...(searchParams.amenities || []), amenity.id];
                              
                              const updatedParams = { 
                                ...searchParams, 
                                amenities: updatedAmenities 
                              };
                              setSearchParams(updatedParams);
                            }
                          }}
                        />
                        <label htmlFor={`amenity-${amenity.id}`} className="text-sm">
                          {amenity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={handleRefreshSearch}
                >
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
