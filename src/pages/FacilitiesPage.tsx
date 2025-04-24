import { useState, useEffect } from "react";
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
  MapIcon
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
import { useToast } from "@/hooks/use-toast";
import { getUserTier } from '@/utils/subscription';

const SERP_API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

type FacilityType = "Assisted Living" | "Memory Care" | "Skilled Nursing" | "Independent Living";

type Location = "Phoenix, AZ" | "Scottsdale, AZ" | "Tempe, AZ" | "Mesa, AZ" | "Glendale, AZ";

interface Facility {
  id: string;
  name: string;
  type: string;
  rating: number;
  location: string;
  price?: string;
  image?: string;
  amenities: string[];
  availableBeds?: number;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  url?: string;
}

const DEFAULT_LOCATION = "Phoenix, Arizona";

const FacilitiesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const userTier = getUserTier(user);
  const isPro = userTier === 'premium';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [recentlyViewedFacilities, setRecentlyViewedFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacilities();
  }, [isPro]);

  const fetchFacilities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = `${DEFAULT_LOCATION} senior care facilities`;
      
      console.log("Fetching facilities with query:", query);
      
      const apiUrl = `https://www.searchapi.io/api/v1/search?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("SearchAPI response:", data);
      
      const results = data.local_results || data.places_results || [];
      
      if (results && results.length > 0) {
        const facilitiesData: Facility[] = results.map((item: any, index: number) => {
          const description = item.description || item.type || "";
          const lowerDesc = description.toLowerCase();
          let facilityType = "Assisted Living";
          
          if (lowerDesc.includes("memory")) {
            facilityType = "Memory Care";
          } else if (lowerDesc.includes("nursing") || lowerDesc.includes("skilled")) {
            facilityType = "Skilled Nursing";
          } else if (lowerDesc.includes("independent")) {
            facilityType = "Independent Living";
          }
          
          let priceLevel = "$$";
          if (item.price_level) {
            priceLevel = "$".repeat(item.price_level);
          } else if (index % 3 === 0) {
            priceLevel = "$$$";
          } else if (index % 5 === 0) {
            priceLevel = "$$$$";
          }
          
          const amenitiesList = [
            "24/7 Staff", 
            "Dining Services", 
            "Transportation", 
            "Activities", 
            "Wellness Programs", 
            "Medication Management",
            "Housekeeping",
            "Physical Therapy",
            "Pet Friendly"
          ];
          
          const amenities = amenitiesList
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 3) + 3);
          
          const imageIndex = (index % 5) + 1;
          const imageUrl = `https://images.unsplash.com/photo-${1550000000000 + imageIndex * 10000}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80`;
          
          const actualImage = item.thumbnail || null;
          
          return {
            id: item.place_id || `facility-${index}`,
            name: item.title,
            type: facilityType as FacilityType,
            rating: parseFloat(item.rating || 0),
            location: item.address?.split(",").slice(-2).join(",").trim() || "Phoenix, AZ",
            price: priceLevel,
            image: actualImage || imageUrl,
            amenities,
            availableBeds: Math.floor(Math.random() * 10) + 1,
            description: description || "Senior care facility offering personalized care services.",
            address: item.address,
            latitude: item.gps_coordinates?.latitude || 0,
            longitude: item.gps_coordinates?.longitude || 0,
            url: item.website || "#"
          };
        });
        
        setAllFacilities(facilitiesData);
        
        setFilteredFacilities(facilitiesData);
        
        setRecentlyViewedFacilities(facilitiesData.slice(0, 3));
        
        toast({
          title: "Facilities Loaded",
          description: `Found ${facilitiesData.length} facilities in the Phoenix area.`
        });
      } else {
        throw new Error("No facilities found in the response");
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setError("Failed to load facilities. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load facilities data. Please try again later.",
        variant: "destructive"
      });
      
      setAllFacilities([]);
      setFilteredFacilities([]);
      setRecentlyViewedFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let results = isPro ? allFacilities : recentlyViewedFacilities;
      
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
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

  const handleFilterApply = () => {
    applyFilters();
    setFilterOpen(false);
  };

  const handleFilterReset = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSearchQuery("");
    setFilteredFacilities(isPro ? allFacilities : recentlyViewedFacilities);
  };

  const handleRefreshData = () => {
    fetchFacilities();
  };

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
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d207374.08813779785!2d-112.1489429766229!3d33.53536998966758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Facility Map"
            ></iframe>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button asChild className="bg-white text-healthcare-700 hover:bg-white/90">
              <Link to="/map">
                <MapIcon className="h-4 w-4 mr-2" />
                Open Full Map
              </Link>
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
            <Badge variant="outline" className="bg-healthcare-50">Phoenix, AZ</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Scottsdale, AZ</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Tempe, AZ</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Mesa, AZ</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Glendale, AZ</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBasicFacilityCard = (facility: Facility, index: number) => (
    <Card key={facility.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={facility.image || "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"} 
            alt={facility.name} 
            className="h-48 w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"; 
            }}
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
              {facility.type}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg">{facility.name}</h3>
          
          <div className="flex items-center gap-1 my-2">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{facility.location}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">Recently viewed</p>
          
          <div className="border-t pt-3 mt-2">
            <span className="text-sm text-muted-foreground">
              Last viewed recently
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProFacilityCard = (facility: Facility, index: number) => (
    viewMode === "grid" ? (
      <Card key={facility.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={facility.image || "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"} 
              alt={facility.name} 
              className="h-48 w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"; 
              }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
                {facility.type}
              </Badge>
              {facility.price && (
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
            
            <div className="my-2">
              {getRatingStars(facility.rating)}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{facility.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {facility.amenities.slice(0, 3).map((amenity: string, i: number) => (
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
            
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm">
                <span className="font-medium">{facility.availableBeds}</span> beds available
              </span>
              <Button 
                size="sm" 
                className="bg-healthcare-600"
                onClick={() => handleViewDetails(facility)}
                asChild
              >
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
                src={facility.image || "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"} 
                alt={facility.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"; 
                }}
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
                  {facility.price && (
                    <Badge className="bg-healthcare-100 text-healthcare-700">
                      {facility.price}
                    </Badge>
                  )}
                  <div className="ml-2">
                    {getRatingStars(facility.rating)}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground my-2">{facility.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3 mt-3">
                {facility.amenities.map((amenity: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-healthcare-50 text-xs font-normal">
                    {amenity}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <span className="text-sm">
                  <span className="font-medium">{facility.availableBeds}</span> beds available
                </span>
                <Button 
                  size="sm" 
                  className="bg-healthcare-600"
                  onClick={() => handleViewDetails(facility)}
                  asChild
                >
                  <Link to={`/facilities/${facility.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );

  const handleViewDetails = (facility: Facility) => {
    sessionStorage.setItem('selectedFacility', JSON.stringify(facility));
    console.log(`Navigating to facility detail: ${facility.id}`);
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

      {renderFacilityMap()}

      <div className="flex flex-col lg:flex-row gap-4 items-start">
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

        <div className="flex-1 w-full">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isPro 
                  ? "Search facilities by name, type, or description..." 
                  : "Search recently viewed facilities..."}
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
                    checked={selectedLocations.includes("Phoenix, AZ")}
                    onCheckedChange={() => toggleLocationSelection("Phoenix, AZ")}
                  >
                    Phoenix, AZ
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Scottsdale, AZ")}
                    onCheckedChange={() => toggleLocationSelection("Scottsdale, AZ")}
                  >
                    Scottsdale, AZ
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Tempe, AZ")}
                    onCheckedChange={() => toggleLocationSelection("Tempe, AZ")}
                  >
                    Tempe, AZ
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Mesa, AZ")}
                    onCheckedChange={() => toggleLocationSelection("Mesa, AZ")}
                  >
                    Mesa, AZ
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedLocations.includes("Glendale, AZ")}
                    onCheckedChange={() => toggleLocationSelection("Glendale, AZ")}
                  >
                    Glendale, AZ
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

      {isPro && (
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
                  {["Phoenix, AZ", "Scottsdale, AZ", "Tempe, AZ", "Mesa, AZ", "Glendale, AZ"].map((location) => (
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
      )}

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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {isPro 
              ? `Showing ${filteredFacilities.length} facilities` 
              : `Showing ${filteredFacilities.length} recently viewed facilities`}
          </p>
          {isLoading && <div className="h-4 w-4 rounded-full border-2 border-t-healthcare-600 animate-spin"></div>}
          {!isLoading && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshData} 
              className="h-7 px-2"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
        
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

      {error && !isLoading && (
        <div className="text-center py-12 glass-card rounded-xl">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Error Loading Facilities</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

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
      ) : filteredFacilities.length === 0 && !error ? (
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
            isPro 
              ? renderProFacilityCard(facility, index)
              : renderBasicFacilityCard(facility, index)
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
