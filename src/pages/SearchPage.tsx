import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { saveSearchResult } from '@/services/searchResultService';

const SERP_API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

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

const SearchPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("Phoenix, AZ");
  const [selectedCareType, setSelectedCareType] = useState<string>("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    
    sessionStorage.setItem('facilitySearchParams', JSON.stringify({
      query,
      location,
      careType: selectedCareType,
      amenities: selectedAmenities,
    }));
    
    await saveSearchResult({
      query,
      location,
      facility_type: selectedCareType,
      amenities: selectedAmenities,
      results: []
    });
    
    navigate('/map');
  };

  return (
    <div className="container max-w-5xl mx-auto">
      <Helmet>
        <title>Search Facilities - HealthProAssist</title>
        <meta name="description" content="Search for senior care facilities based on location, care type, and amenities." />
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search Senior Care Facilities</h1>
          <p className="text-muted-foreground mt-2">
            Find the perfect facility by location, care type, and amenities
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
            <CardDescription>
              Enter details below to find suitable facilities for your clients
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-healthcare-700">Location</Label>
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="City, state or zip code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pr-8"
                  />
                  <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div>
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
            </div>
            
            <div>
              <Label className="text-healthcare-700 mb-3 block">Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full sm:w-auto bg-healthcare-600 hover:bg-healthcare-700 text-white"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Searching..." : "Search Facilities"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be specific with location (city, state, or zip code)</li>
              <li>Select a care type to narrow down results</li>
              <li>Choose amenities that are important to your client</li>
              <li>Results will be shown on an interactive map</li>
              <li>You can save facilities to your favorites list for future reference</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;
