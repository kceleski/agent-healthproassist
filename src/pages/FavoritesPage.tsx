
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Building, MapPin, Star, Trash2, ExternalLink } from "lucide-react";

interface Facility {
  id: string;
  name: string;
  address: string;
  rating: number;
  description?: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

const FavoritesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityType, setFacilityType] = useState("all");
  const [facilityNotes, setFacilityNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSavedFacilities();
    loadNotes();
  }, []);

  const loadSavedFacilities = () => {
    const savedIds = localStorage.getItem('savedFacilities');
    const facilityDetails = localStorage.getItem('facilityDetails');
    
    if (savedIds && facilityDetails) {
      const ids = JSON.parse(savedIds) as string[];
      const details = JSON.parse(facilityDetails) as Record<string, Facility>;
      
      const savedFacilities = ids
        .filter(id => details[id])
        .map(id => details[id]);
      
      setFacilities(savedFacilities);
    }
  };

  const loadNotes = () => {
    const notes = localStorage.getItem('facilityNotes');
    if (notes) {
      setFacilityNotes(JSON.parse(notes));
    }
  };

  const saveNotes = (facilityId: string, notes: string) => {
    const updatedNotes = { ...facilityNotes, [facilityId]: notes };
    setFacilityNotes(updatedNotes);
    localStorage.setItem('facilityNotes', JSON.stringify(updatedNotes));
    toast.success("Notes saved successfully");
  };

  const removeFacility = (facilityId: string) => {
    const savedIds = localStorage.getItem('savedFacilities');
    if (savedIds) {
      const ids = JSON.parse(savedIds) as string[];
      const updatedIds = ids.filter(id => id !== facilityId);
      localStorage.setItem('savedFacilities', JSON.stringify(updatedIds));
    }
    
    setFacilities(current => current.filter(f => f.id !== facilityId));
    toast.success("Facility removed from favorites");
  };

  const handleUpdateNotes = (facilityId: string, notes: string) => {
    saveNotes(facilityId, notes);
  };

  const saveFacilityDetails = (facility: Facility) => {
    sessionStorage.setItem('currentFacility', JSON.stringify(facility));
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      facility.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (facilityType === "all") return matchesSearch;
    if (facilityType === "assisted" && facility.description?.toLowerCase().includes("assisted")) return matchesSearch;
    if (facilityType === "memory" && facility.description?.toLowerCase().includes("memory")) return matchesSearch;
    if (facilityType === "skilled" && facility.description?.toLowerCase().includes("skilled")) return matchesSearch;
    
    return false;
  });

  return (
    <div className="container py-6">
      <Helmet>
        <title>Saved Facilities - HealthProAssist</title>
        <meta name="description" content="View and manage your saved senior care facilities." />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-healthcare-600" />
            <h1 className="text-3xl font-bold tracking-tight">Saved Facilities</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            View and manage your saved senior care facilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/search">
              <Search className="h-4 w-4 mr-2" />
              Find More Facilities
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Your Saved Facilities</CardTitle>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>
              <div className="flex items-center">
                <Label className="mr-2 whitespace-nowrap">Facility Type:</Label>
                <Select 
                  value={facilityType} 
                  onValueChange={setFacilityType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={0} className="bg-white dark:bg-slate-900 border-white/30 dark:border-slate-700/30 z-50">
                    <SelectItem value="all">All Facilities</SelectItem>
                    <SelectItem value="assisted">Assisted Living</SelectItem>
                    <SelectItem value="memory">Memory Care</SelectItem>
                    <SelectItem value="skilled">Skilled Nursing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Card key={facility.id} className="overflow-hidden">
                  <div className="bg-healthcare-50 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium line-clamp-1">{facility.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFacility(facility.id)}
                        className="text-red-500 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{facility.address}</span>
                    </div>
                    
                    {facility.rating > 0 && (
                      <div className="flex items-center mt-2">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-sm">{facility.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {facility.description && (
                      <p className="mt-2 text-sm line-clamp-2">{facility.description}</p>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <Label htmlFor={`notes-${facility.id}`} className="text-sm mb-1 block">
                      Notes
                    </Label>
                    <textarea
                      id={`notes-${facility.id}`}
                      className="w-full h-20 p-2 text-sm border rounded-md resize-none"
                      placeholder="Add notes about this facility..."
                      value={facilityNotes[facility.id] || ""}
                      onChange={(e) => handleUpdateNotes(facility.id, e.target.value)}
                    />
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => saveFacilityDetails(facility)}
                      >
                        <Link to={`/facilities/${facility.id}`}>
                          View Details
                        </Link>
                      </Button>
                      
                      {facility.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <a 
                            href={facility.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved facilities</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "No facilities match your search criteria." : "You haven't saved any facilities yet."}
              </p>
              <Button asChild>
                <Link to="/search">Search for Facilities</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Facility Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            <li>Add personal notes to each facility to help remember important details</li>
            <li>Use the search and filter options to quickly find specific facilities</li>
            <li>Remove facilities you're no longer interested in</li>
            <li>Click "View Details" for comprehensive facility information</li>
            <li>Visit the facility's website for the most up-to-date information</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesPage;
