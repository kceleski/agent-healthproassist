
import { useState } from "react";
import { 
  Building, 
  ChevronDown, 
  Filter, 
  Globe, 
  MoveHorizontal, 
  Plus, 
  RefreshCw, 
  Search, 
  Star,
  SlidersHorizontal,
  Map as MapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";

// Facility Types
type FacilityType = "Assisted Living" | "Memory Care" | "Skilled Nursing" | "Independent Living";

// Location Types
type Location = "San Francisco, CA" | "Oakland, CA" | "San Jose, CA" | "Palo Alto, CA" | "Los Angeles, CA";

// Sample Facility Data
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
const recentlyViewedFacilities = [
  facilitiesData[0],
  facilitiesData[2],
  facilitiesData[3],
];

const FacilitiesPage = () => {
  const { user } = useAuth();
  const demoTier = user?.demoTier || user?.subscription || 'basic';
  const isPro = demoTier === 'premium';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState(
    isPro ? facilitiesData : recentlyViewedFacilities
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter facilities based on search and filters
  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = isPro ? facilitiesData : recentlyViewedFacilities;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          facility => 
            facility.name.toLowerCase().includes(query) ||
            facility.description.toLowerCase().includes(query) ||
            facility.type.toLowerCase().includes(query)
        );
      }
      
      // Apply type filter
      if (selectedTypes.length > 0) {
        results = results.filter(facility => 
          selectedTypes.includes(facility.type as FacilityType)
        );
      }
      
      // Apply location filter
      if (selectedLocations.length > 0) {
        results = results.filter(facility => 
          selectedLocations.includes(facility.location as Location)
        );
      }
      
      setFilteredFacilities(results);
      setIsLoading(false);
    }, 500);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Toggle facility type selection
  const toggleTypeSelection = (type: FacilityType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Toggle location selection
  const toggleLocationSelection = (location: Location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  // Apply filters when selections change
  const handleFilterApply = () => {
    applyFilters();
    setFilterOpen(false);
  };

  // Reset all filters
  const handleFilterReset = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSearchQuery("");
    setFilteredFacilities(isPro ? facilitiesData : recentlyViewedFacilities);
  };

  // Get star rating display
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-healthcare-400 text-healthcare-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-healthcare-400" />
            <Star className="w-4 h-4 fill-healthcare-400 text-healthcare-400 absolute top-0 left-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
          </div>
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-healthcare-400" />
        ))}
        <span className="ml-1 text-sm">{rating}</span>
      </div>
    );
  };

  const renderFacilityMap = () => (
    <Card className="glass-card overflow-hidden mb-8 animate-zoom-in">
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-[400px] bg-muted rounded-t-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100939.98555098464!2d-122.44761267845324!3d37.75781499602548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1625234961372!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Facility Map"
            ></iframe>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button className="bg-white text-healthcare-700 hover:bg-white/90">
              <MapIcon className="h-4 w-4 mr-2" />
              Open Full Map
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <h3 className="font-medium mb-2">Find Facilities Near You</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isPro 
              ? "Use the interactive map to explore senior care facilities in your area. Click on a marker to see details." 
              : "Search for facilities near you. Upgrade to Pro for full interactive mapping capabilities."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-healthcare-50">San Francisco, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Oakland, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">San Jose, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Palo Alto, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Los Angeles, CA</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facilities Directory</h1>
        <p className="text-muted-foreground">
          {isPro 
            ? "Browse and search for senior care facilities in our comprehensive database." 
            : "View recently accessed facilities and find new ones."}
          {!isPro && (
            <span className="ml-2 text-healthcare-600">
              <Link to="/profile" className="hover:underline">Upgrade to Pro</Link> for advanced features.
            </span>
          )}
        </p>
      </div>

      {/* Facility Map (for both tiers) */}
      {renderFacilityMap()}

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Mobile Filter Button */}
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

        {/* Search Form */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search facilities by name, type, or description..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-healthcare-600 hover:bg-healthcare-700">
              Search
            </Button>
          </form>
        </div>

        {/* Desktop Filter Dropdown */}
        {isPro && (
          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                  {(selectedTypes.length > 0 || selectedLocations.length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTypes.length + selectedLocations.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[220px]">
                <DropdownMenuLabel>Facility Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[200px]">
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("Assisted Living")}
                    onCheckedChange={() => toggleTypeSelection("Assisted Living")}
                  >
                    Assisted Living
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("Memory Care")}
                    onCheckedChange={() => toggleTypeSelection("Memory Care")}
                  >
                    Memory Care
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("Skilled Nursing")}
                    onCheckedChange={() => toggleTypeSelection("Skilled Nursing")}
                  >
                    Skilled Nursing
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("Independent Living")}
                    onCheckedChange={() => toggleTypeSelection("Independent Living")}
                  >
                    Independent Living
                  </DropdownMenuCheckboxItem>
                </ScrollArea>

                <DropdownMenuLabel className="mt-2">Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[200px]">
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("San Francisco, CA")}
                    onCheckedChange={() => toggleLocationSelection("San Francisco, CA")}
                  >
                    San Francisco, CA
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Oakland, CA")}
                    onCheckedChange={() => toggleLocationSelection("Oakland, CA")}
                  >
                    Oakland, CA
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("San Jose, CA")}
                    onCheckedChange={() => toggleLocationSelection("San Jose, CA")}
                  >
                    San Jose, CA
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Palo Alto, CA")}
                    onCheckedChange={() => toggleLocationSelection("Palo Alto, CA")}
                  >
                    Palo Alto, CA
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Los Angeles, CA")}
                    onCheckedChange={() => toggleLocationSelection("Los Angeles, CA")}
                  >
                    Los Angeles, CA
                  </DropdownMenuCheckboxItem>
                </ScrollArea>

                <div className="flex items-center justify-between pt-2 mt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={handleFilterReset}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                  <Button size="sm" className="text-xs" onClick={handleFilterApply}>
                    Apply Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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

      {/* Filter Dialog (Mobile) */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Facilities</DialogTitle>
            <DialogDescription>
              Refine results by facility type and location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Facility Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Assisted Living", "Memory Care", "Skilled Nursing", "Independent Living"].map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypes.includes(type as FacilityType) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTypeSelection(type as FacilityType)}
                    className={selectedTypes.includes(type as FacilityType) ? "bg-healthcare-600" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Location</h3>
              <div className="grid grid-cols-1 gap-2">
                {["San Francisco, CA", "Oakland, CA", "San Jose, CA", "Palo Alto, CA", "Los Angeles, CA"].map((location) => (
                  <Button
                    key={location}
                    variant={selectedLocations.includes(location as Location) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLocationSelection(location as Location)}
                    className={selectedLocations.includes(location as Location) ? "bg-healthcare-600" : ""}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleFilterReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleFilterApply} className="bg-healthcare-600">
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Filters Display */}
      {isPro && (selectedTypes.length > 0 || selectedLocations.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Active Filters:</span>
          {selectedTypes.map(type => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1">
              {type}
              <button 
                onClick={() => toggleTypeSelection(type)}
                className="ml-1 rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedLocations.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3 mr-1" />
              {location}
              <button 
                onClick={() => toggleLocationSelection(location)}
                className="ml-1 rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={handleFilterReset} className="h-7 px-2">
            Clear All
          </Button>
        </div>
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
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-48 bg-muted rounded-t-lg" />
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-muted rounded-md w-3/4" />
                  <div className="h-4 bg-muted rounded-md w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-20" />
                    <div className="h-6 bg-muted rounded-full w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
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
        // Facilities Grid/List View
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {filteredFacilities.map((facility, index) => (
            viewMode === "grid" ? (
              <Card key={facility.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={facility.image} 
                      alt={facility.name} 
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
                        {facility.type}
                      </Badge>
                      {isPro && (
                        <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
                          {facility.price}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/facilities/${facility.id}`}>
                      <h3 className="font-medium text-lg hover:text-healthcare-600 transition-colors">{facility.name}</h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 my-2">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{facility.location}</span>
                    </div>
                    
                    {isPro && (
                      <div className="my-2">
                        {getRatingStars(facility.rating)}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{facility.description}</p>
                    
                    {isPro && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {facility.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="bg-healthcare-50 text-xs font-normal">
                            {amenity}
                          </Badge>
                        ))}
                        {facility.amenities.length > 3 && (
                          <Badge variant="outline" className="bg-healthcare-50 text-xs font-normal">
                            +{facility.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t pt-3">
                      {isPro ? (
                        <span className="text-sm">
                          <span className="font-medium">{facility.availableBeds}</span> beds available
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Last viewed recently
                        </span>
                      )}
                      <Button asChild size="sm" className="bg-healthcare-600">
                        <Link to={`/facilities/${facility.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={facility.id} className="glass-card overflow-hidden animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 shrink-0">
                      <img 
                        src={facility.image} 
                        alt={facility.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <Link to={`/facilities/${facility.id}`}>
                            <h3 className="font-medium text-lg hover:text-healthcare-600 transition-colors">{facility.name}</h3>
                          </Link>
                          
                          <div className="flex items-center gap-1 my-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{facility.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-healthcare-100 text-healthcare-700">
                            {facility.type}
                          </Badge>
                          {isPro && (
                            <Badge className="bg-healthcare-100 text-healthcare-700">
                              {facility.price}
                            </Badge>
                          )}
                          {isPro && (
                            <div className="ml-2">
                              {getRatingStars(facility.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground my-2">{facility.description}</p>
                      
                      {isPro && (
                        <div className="flex flex-wrap gap-2 mb-3 mt-3">
                          {facility.amenities.map((amenity, i) => (
                            <Badge key={i} variant="outline" className="bg-healthcare-50 text-xs font-normal">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between border-t pt-3 mt-2">
                        {isPro ? (
                          <span className="text-sm">
                            <span className="font-medium">{facility.availableBeds}</span> beds available
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Last viewed recently
                          </span>
                        )}
                        <Button asChild size="sm" className="bg-healthcare-600">
                          <Link to={`/facilities/${facility.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
