
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// SerpAPI key
const SERP_API_KEY = "b9365d165843e4d74619d8d0cfbcb81dd8f493c26c8413010b8ba1c0ad9f6493";

// Facility type interface
interface Facility {
  id: string;
  name: string;
  address: string;
  rating: number;
  description: string;
  url: string;
  latitude: number;
  longitude: number;
}

// Care type options
const careTypes = [
  { id: "any", label: "Any Care Type" },
  { id: "assisted_living", label: "Assisted Living" },
  { id: "memory_care", label: "Memory Care" },
  { id: "home_health", label: "Home Health" },
  { id: "independent_living", label: "Independent Living" },
];

// Amenity options
const amenities = [
  { id: "pool", label: "Swimming Pool" },
  { id: "fitness", label: "Fitness Center" },
  { id: "dining", label: "Fine Dining" },
  { id: "transport", label: "Transportation" },
  { id: "activities", label: "Social Activities" },
  { id: "pets", label: "Pet Friendly" },
];

const FacilitySearchPage = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState<string>("");
  const [selectedCareType, setSelectedCareType] = useState<string>("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  const handleSearch = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Construct search query with care type and location
      let query = location;
      
      if (selectedCareType && selectedCareType !== "any") {
        const careTypeLabel = careTypes.find(type => type.id === selectedCareType)?.label;
        query += ` ${careTypeLabel}`;
      }
      
      // Add selected amenities to the query
      if (selectedAmenities.length > 0) {
        const amenityLabels = selectedAmenities.map(id => 
          amenities.find(amenity => amenity.id === id)?.label
        ).join(" ");
        query += ` ${amenityLabels}`;
      }
      
      // Add "senior care facility" to make search more relevant
      query += " senior care facility";
      
      console.log("Searching for:", query);

      // Call SerpAPI with Google Maps engine
      const apiUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("SerpAPI response:", data);
      
      // Process results
      if (data.local_results && data.local_results.length > 0) {
        const searchResults = data.local_results.map((item: any) => ({
          id: item.place_id || Math.random().toString(36).substring(2),
          name: item.title,
          address: item.address || "",
          rating: parseFloat(item.rating || 0),
          description: item.description || item.type || "Senior care facility",
          url: item.website || "#",
          latitude: item.gps_coordinates?.latitude || 0,
          longitude: item.gps_coordinates?.longitude || 0,
        }));
        
        setFacilities(searchResults);
        setIsLoading(false);
        
        toast({
          title: "Search Complete",
          description: `Found ${searchResults.length} facilities matching your criteria.`,
        });
      } else {
        setFacilities([]);
        setIsLoading(false);
        toast({
          title: "No Results",
          description: "No facilities found matching your criteria.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search facilities. Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-white">
      <Helmet>
        <title>Facility Search - HealthProAssist</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-healthcare-700">Search Senior Care Facilities</h1>
        
        <div className="bg-healthcare-50 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location Search */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-healthcare-700">Location</Label>
              <Input
                id="location"
                placeholder="City, state or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-healthcare-200 focus-visible:ring-healthcare-500"
              />
            </div>
            
            {/* Care Type */}
            <div className="space-y-2">
              <Label htmlFor="care-type" className="text-healthcare-700">Care Type</Label>
              <Select
                value={selectedCareType}
                onValueChange={setSelectedCareType}
              >
                <SelectTrigger id="care-type" className="border-healthcare-200">
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
            </div>
            
            {/* Search Button */}
            <div className="self-end">
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-healthcare-600 hover:bg-healthcare-700 text-white"
              >
                {isLoading ? "Searching..." : "Search Facilities"}
              </Button>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="mt-6">
            <Label className="text-healthcare-700 mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <label
                    htmlFor={`amenity-${amenity.id}`}
                    className="text-sm font-medium leading-none text-healthcare-700 cursor-pointer"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="mt-10">
          {facilities.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-healthcare-700">
                Search Results ({facilities.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility) => (
                  <div 
                    key={facility.id}
                    className="bg-healthcare-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <h3 className="text-xl font-bold text-healthcare-700 mb-2">{facility.name}</h3>
                    <p className="text-gray-600 mb-2">{facility.address}</p>
                    {facility.rating > 0 && (
                      <div className="flex items-center mb-3">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-healthcare-700">{facility.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <p className="text-gray-600 mb-4 line-clamp-3">{facility.description}</p>
                    <a 
                      href={facility.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-healthcare-600 hover:underline text-sm"
                    >
                      View Details
                    </a>
                  </div>
                ))}
              </div>
            </>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-healthcare-500 mx-auto"></div>
              <p className="text-healthcare-700 mt-4">Searching for facilities...</p>
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">
              Enter a location and search criteria to find senior care facilities.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilitySearchPage;
