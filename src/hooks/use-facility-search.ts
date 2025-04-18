
import { useState } from "react";
import type { Facility, FacilityType, Location } from "@/types/facility";
import { useToast } from "@/hooks/use-toast";

interface UseFacilitySearchProps {
  initialFacilities: Facility[];
}

export function useFacilitySearch({ initialFacilities }: UseFacilitySearchProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState(initialFacilities);
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let results = initialFacilities;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          facility => 
            facility.name.toLowerCase().includes(query) ||
            facility.description.toLowerCase().includes(query) ||
            facility.type.toLowerCase().includes(query)
        );
      }
      
      if (selectedTypes.length > 0) {
        results = results.filter(facility => 
          selectedTypes.includes(facility.type as FacilityType)
        );
      }
      
      if (selectedLocations.length > 0) {
        results = results.filter(facility => 
          selectedLocations.includes(facility.location as Location)
        );
      }
      
      setFilteredFacilities(results);
      setIsLoading(false);
    }, 500);
  };

  const toggleTypeSelection = (type: FacilityType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleLocationSelection = (location: Location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleFilterReset = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSearchQuery("");
    setFilteredFacilities(initialFacilities);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedTypes,
    selectedLocations,
    filteredFacilities,
    isLoading,
    toggleTypeSelection,
    toggleLocationSelection,
    applyFilters,
    handleFilterReset
  };
}
