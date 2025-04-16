
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import FacilityMapbox from "@/components/maps/FacilityMapbox";
import { Facility, careTypes, amenities } from "@/types/facilities";

// API key for search service
const API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

const MapPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
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
      // Construct search query
      let query = location;
      
      if (selectedCareType && selectedCareType !== "any") {
        const careTypeLabel = careTypes.find(type => type.id === selectedCareType)?.label;
        query += ` ${careTypeLabel}`;
      }
      
      if (selectedAmenities.length > 0) {
        const amenityLabels = selectedAmenities.map(id => 
          amenities.find(amenity => amenity.id === id)?.label
        ).join(", ");
        query += ` ${amenityLabels}`;
      }

      const apiUrl = `https://www.searchapi.io/api/v1/search?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${API_KEY}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const results = data.local_results || data.organic_results || [];
      
      if (!results || results.length === 0) {
        setFacilities([]);
        toast({
          title: "No Results",
          description: "No facilities found matching your criteria.",
          variant: "destructive",
        });
        return;
      }
      
      const searchResults = results.map((result: any) => ({
        id: result.place_id || result.data_id || Math.random().toString(36).substring(2),
        name: result.title,
        address: result.address || "",
        rating: result.rating || 0,
        description: result.description || result.review_text || "No description available.",
        url: result.website || result.link || "#",
        latitude: parseFloat(result.gps_coordinates?.latitude || result.latitude || 0),
        longitude: parseFloat(result.gps_coordinates?.longitude || result.longitude || 0),
      }));
      
      setFacilities(searchResults);
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} facilities matching your criteria.`,
      });
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search facilities. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Senior Care Facilities</h1>
        <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
          {isPro ? 'Pro' : 'Basic'} Feature
        </Badge>
      </div>

      <div className="bg-healthcare-50 p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location Search */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, state or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          {/* Care Type */}
          <div className="space-y-2">
            <Label htmlFor="care-type">Care Type</Label>
            <Select
              value={selectedCareType}
              onValueChange={setSelectedCareType}
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
          </div>
          
          {/* Search Button */}
          <div className="self-end">
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-healthcare-600 hover:bg-healthcare-700"
            >
              {isLoading ? "Searching..." : "Search Facilities"}
            </Button>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mt-6">
          <Label className="mb-3 block">Amenities</Label>
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
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {amenity.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Component */}
      <FacilityMapbox />
      
      {/* Include necessary scripts */}
      <Helmet>
        <script src="https://unpkg.com/@turf/turf@6.5.0/turf.min.js"></script>
      </Helmet>
    </div>
  );
};

export default MapPage;
