import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Remove or replace the import for shell which doesn't exist
// import { Shell } from "@/components/ui/shell";
import { FacilityFilters } from "@/components/facilities/FacilityFilters";
import { FacilityCard } from "@/components/facilities/FacilityCard";
import { FacilityMapOverview } from "@/components/facilities/FacilityMapOverview";
import { useFacilitySearch } from "@/hooks/use-facility-search";

const FacilitiesPage = () => {
  const { 
    filters, 
    setFilters, 
    facilities, 
    isLoading, 
    error 
  } = useFacilitySearch();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Senior Care Facilities</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <FacilityFilters filters={filters} setFilters={setFilters} />
          </div>
          <div className="md:col-span-3 grid gap-4">
            {isLoading && <div>Loading facilities...</div>}
            {error && <div>Error: {error.message}</div>}
            {facilities && facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Map Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <FacilityMapOverview facilities={facilities} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesPage;
