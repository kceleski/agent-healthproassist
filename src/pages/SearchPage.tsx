import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AISearchCard } from "@/components/search/AISearchCard";
import { SearchCriteriaCard } from "@/components/search/SearchCriteriaCard";
import { SearchTipsCard } from "@/components/search/SearchTipsCard";
import { AvaButton } from "@/components/search/AvaButton";
import { saveSearchResult } from "@/services/searchResultService";

const SERP_API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

// Define care types and amenities
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

  // Handle AI filter updates
  const handleFiltersUpdate = (filters: any) => {
    if (filters.location) {
      setLocation(filters.location);
    }
    if (filters.facilityType) {
      setSelectedCareType(filters.facilityType);
    }
    if (filters.amenities) {
      setSelectedAmenities(filters.amenities);
    }
  };

  // Handle search submission
  const handleSearch = async (filters?: any) => {
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
      
      console.log("Search query:", query);
      
      // Store search parameters in session storage for the map page
      sessionStorage.setItem('facilitySearchParams', JSON.stringify({
        query,
        location,
        careType: selectedCareType,
        amenities: selectedAmenities,
      }));
      
      // Save search result to database
      try {
        await saveSearchResult({
          query,
          location,
          facility_type: selectedCareType,
          amenities: selectedAmenities,
          results: []
        });
      } catch (error) {
        console.error('Error saving search result:', error);
      }
      
      // Navigate to map page
      navigate('/map');
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <Helmet>
        <title>Search Facilities - HealthProAssist</title>
        <meta name="description" content="Search for senior care facilities based on location, care type, and amenities." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Search Senior Care Facilities</h1>
            <p className="text-muted-foreground mt-2">
              Find the perfect facility by location, care type, and amenities
            </p>
          </div>
          <AvaButton onFiltersUpdate={handleFiltersUpdate} handleSearch={handleSearch} />
        </div>
        
        <SearchTipsCard />
        
        <SearchCriteriaCard 
          location={location}
          setLocation={setLocation}
          selectedCareType={selectedCareType}
          setSelectedCareType={setSelectedCareType}
          selectedAmenities={selectedAmenities}
          toggleAmenity={toggleAmenity}
          handleSearch={handleSearch}
          isLoading={isLoading}
          careTypes={careTypes}
          amenities={amenities}
        />

        <AISearchCard onFiltersUpdate={handleFiltersUpdate} />
      </div>
    </div>
  );
};

export default SearchPage;
