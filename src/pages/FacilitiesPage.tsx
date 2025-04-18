
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityFilters } from "@/components/facilities/FacilityFilters";
import { FacilityCard } from "@/components/facilities/FacilityCard";
import { FacilityMapOverview } from "@/components/facilities/FacilityMapOverview";
import { FacilityType, Location, Facility } from "@/types/facility";

// Mock facilities data
const mockFacilities: Facility[] = [
  {
    id: "1",
    name: "Sunshine Senior Living",
    type: "Assisted Living",
    rating: 4.5,
    location: "San Francisco, CA",
    price: "$3,500 - $5,000",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80",
    amenities: ["Pool", "Fitness Center", "Dining", "Transportation"],
    availableBeds: 5,
    description: "A comfortable assisted living facility with professional staff and various amenities."
  },
  {
    id: "2",
    name: "Golden Years Memory Care",
    type: "Memory Care",
    rating: 4.8,
    location: "Oakland, CA",
    price: "$4,500 - $6,500",
    image: "https://images.unsplash.com/photo-1539922631499-5afe6e306ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80",
    amenities: ["24/7 Care", "Secured Environment", "Therapy Programs", "Private Rooms"],
    availableBeds: 3,
    description: "Specialized care for seniors with memory conditions in a safe and nurturing environment."
  },
  {
    id: "3",
    name: "Bay Area Skilled Nursing",
    type: "Skilled Nursing",
    rating: 4.2,
    location: "San Jose, CA",
    price: "$5,500 - $7,500",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80",
    amenities: ["Rehabilitation", "Medical Staff", "Post-Surgery Care", "Physical Therapy"],
    availableBeds: 8,
    description: "Professional nursing care with rehabilitation services for seniors with medical needs."
  }
];

const FacilitiesPage = () => {
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
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
    setFilteredFacilities(mockFacilities);
  };

  const handleFilterApply = () => {
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        let results = mockFacilities;
        
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Senior Care Facilities</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <FacilityFilters 
              selectedTypes={selectedTypes}
              selectedLocations={selectedLocations}
              toggleTypeSelection={toggleTypeSelection}
              toggleLocationSelection={toggleLocationSelection}
              handleFilterReset={handleFilterReset}
              handleFilterApply={handleFilterApply}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
          </div>
          <div className="md:col-span-3 grid gap-4">
            {isLoading && <div>Loading facilities...</div>}
            {error && <div>Error: {error.message}</div>}
            {filteredFacilities && filteredFacilities.map((facility, index) => (
              <FacilityCard 
                key={facility.id} 
                facility={facility}
                index={index}
                isPro={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Map Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <FacilityMapOverview isPro={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesPage;
