import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Filter, MoveHorizontal, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FacilityCard } from "@/components/facilities/FacilityCard";
import { FacilityMapOverview } from "@/components/facilities/FacilityMapOverview";
import { FacilityFilters } from "@/components/facilities/FacilityFilters";
import { useFacilitySearch } from "@/hooks/use-facility-search";
import type { Facility } from "@/types/facility";

// Sample facility data - in a real app this would come from an API
const facilitiesData = [
  {
    id: "1",
    name: "Sunset Senior Living",
    type: "Assisted Living",
    rating: 4.5,
    location: "San Francisco, CA",
    price: "$$$",
    image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    amenities: ["24/7 Care", "Medication Management", "Transportation", "Dining"],
    availableBeds: 5,
    description: "Luxury senior living community with personalized care services and beautiful surroundings."
  },
  {
    id: "2",
    name: "Golden Years Home",
    type: "Memory Care",
    rating: 4.2,
    location: "Oakland, CA",
    price: "$$",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    amenities: ["Memory Programs", "Secured Environment", "Therapy Services", "Family Support"],
    availableBeds: 3,
    description: "Specialized memory care facility with compassionate staff and engaging activities."
  },
  {
    id: "3",
    name: "Serenity Care Center",
    type: "Skilled Nursing",
    rating: 4.7,
    location: "San Jose, CA",
    price: "$$$$",
    image: "https://images.unsplash.com/photo-1595773650024-ded0b394542f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    amenities: ["Rehabilitation", "Post-Surgery Care", "Long-term Care", "Wound Care"],
    availableBeds: 8,
    description: "Top-rated skilled nursing facility offering comprehensive medical care and rehabilitation services."
  },
  {
    id: "4",
    name: "Riverside Retirement",
    type: "Independent Living",
    rating: 4.4,
    location: "Palo Alto, CA",
    price: "$$$",
    image: "https://images.unsplash.com/photo-1584132905271-512c958d674a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    amenities: ["Fitness Center", "Social Activities", "Housekeeping", "Dining Options"],
    availableBeds: 12,
    description: "Active community for independent seniors with luxury amenities and engaging lifestyle programs."
  },
  {
    id: "5",
    name: "Oakwood Senior Community",
    type: "Assisted Living",
    rating: 4.1,
    location: "San Francisco, CA",
    price: "$$",
    image: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    amenities: ["24/7 Staff", "Wellness Programs", "Transportation", "Pet Friendly"],
    availableBeds: 7,
    description: "Comfortable and affordable assisted living community with personalized care plans."
  },
  {
    id: "6",
    name: "Harmony Health Center",
    type: "Skilled Nursing",
    rating: 4.3,
    location: "Los Angeles, CA",
    price: "$$$",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    amenities: ["Advanced Medical Care", "Physical Therapy", "Respiratory Care", "Nutrition Services"],
    availableBeds: 4,
    description: "Comprehensive skilled nursing facility specializing in complex medical needs and rehabilitation."
  },
];

// Recently viewed facilities for basic tier
const recentlyViewedFacilities = facilitiesData.slice(0, 3);

const FacilitiesPage = () => {
  const { user } = useAuth();
  const demoTier = user?.demoTier || user?.subscription || 'basic';
  const isPro = demoTier === 'premium';
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
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
  } = useFacilitySearch({
    initialFacilities: isPro ? facilitiesData : recentlyViewedFacilities
  });

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Handle filter apply
  const handleFilterApply = () => {
    applyFilters();
    setFilterOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facilities Directory</h1>
        <p className="text-muted-foreground">
          {isPro 
            ? "Browse and search for senior care facilities in our comprehensive database." 
            : "View recently accessed facilities."}
          {!isPro && (
            <span className="ml-2 text-healthcare-600">
              <Link to="/profile" className="hover:underline">Upgrade to Pro</Link> for advanced features.
            </span>
          )}
        </p>
      </div>

      <FacilityMapOverview isPro={isPro} />

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Mobile Filter Button - PRO ONLY */}
        {isPro && (
          <Button
            variant="outline"
            onClick={() => setFilterOpen(true)}
            className="w-full lg:hidden flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {(selectedTypes.length > 0 || selectedLocations.length > 0) && (
              <Badge variant="secondary" className="ml-2">
                {selectedTypes.length + selectedLocations.length}
              </Badge>
            )}
          </Button>
        )}

        {/* Search Form */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={isPro 
                  ? "Search facilities by name, type, or description..." 
                  : "Search recently viewed facilities..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-healthcare-600 hover:bg-healthcare-700">
              Search
            </Button>
          </form>
        </div>

        {/* Desktop View Mode Toggle - PRO ONLY */}
        {isPro && (
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="rounded-full"
            >
              <MoveHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Filters - PRO ONLY */}
      {isPro && (
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
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isPro 
            ? `Showing ${filteredFacilities.length} facilities` 
            : `Showing ${filteredFacilities.length} recently viewed facilities`}
        </p>
        {isPro && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Facility</DialogTitle>
                <DialogDescription>
                  This feature will be available in a future update.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <div className="p-4 space-y-4">
                <div className="h-6 bg-muted rounded-md w-3/4" />
                <div className="h-4 bg-muted rounded-md w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded-full w-20" />
                  <div className="h-6 bg-muted rounded-full w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-xl">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Facilities Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={handleFilterReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === "grid" && isPro
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : isPro ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          {filteredFacilities.map((facility, index) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              index={index}
              isPro={isPro}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
