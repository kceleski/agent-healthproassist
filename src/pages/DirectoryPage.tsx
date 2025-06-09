
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/directory/HeroSection";
import { BusinessDirectoryCard } from "@/components/directory/BusinessDirectoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { FacilityData } from "@/types/facility";

// Initial facility data as specified in requirements
const initialFacilities: FacilityData[] = [
  {
    id: "olivegrove",
    name: "Olive Grove Assisted Living",
    type: "Assisted Living & Memory Care",
    address: "3014 East Indian School Road",
    city: "Phoenix",
    state: "AZ",
    zip: "85016",
    phone: "(425)343-4418",
    website: "https://www.carepartnersliving.com/contact/",
    description: "Assisted Living & Memory Care Community with pet-friendly environment, fitness center, awake staff, and on-site/on-call nursing.",
    services: ["Assisted Living", "Memory Care", "Awake Staff", "On-site Nursing", "On-call Nursing"],
    amenities: ["Pet-Friendly", "Fitness Center", "Social Activities"],
    images: ["/placeholder.svg"],
    ctaText: "Explore care options at Olive Grove today.",
    ctaButtons: [{"text": "Visit Website", "link": "https://www.carepartnersliving.com/contact/"}]
  },
  {
    id: "ocotilloplace",
    name: "Ocotillo Place",
    type: "Assisted Living & Memory Care",
    address: "3327 North Civic Center Plaza",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
    phone: "(425)343-4418",
    website: "https://www.carepartnersliving.com/contact/",
    description: "Full-service Assisted Living & Memory Care with pet-friendly access and wellness options.",
    services: ["Assisted Living", "Memory Care", "Awake Staff", "On-site Nursing", "On-call Nursing"],
    amenities: ["Pet-Friendly", "Fitness Center", "Social Activities"],
    images: ["/placeholder.svg"],
    ctaText: "Find out more about Ocotillo Place.",
    ctaButtons: [{"text": "Visit Website", "link": "https://www.carepartnersliving.com/contact/"}]
  }
];

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<FacilityData[]>(initialFacilities);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const handleVeteranJourney = () => {
    // TODO: Launch Ranger AI assistant
    navigate("/map/ava"); // Temporary redirect to existing Ava for now
  };

  const handleGeneralJourney = () => {
    navigate("/map/ava");
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || facility.type.toLowerCase().includes(selectedType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

  const uniqueTypes = ["all", ...Array.from(new Set(facilities.map(f => f.type)))];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Find Senior Care - HealthProAssist Directory</title>
        <meta name="description" content="Find the perfect senior care community with our comprehensive directory and AI-powered assistance." />
      </Helmet>

      <HeroSection 
        onVeteranJourney={handleVeteranJourney}
        onGeneralJourney={handleGeneralJourney}
      />

      <div className="container max-w-7xl mx-auto py-12 px-4">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {uniqueTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="text-xs"
                  >
                    {type === "all" ? "All Types" : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredFacilities.length} facilities found
            </p>
            <Badge variant="outline" className="bg-healthcare-50">
              Dev Mode Active - devtest@healthproassist.com
            </Badge>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <BusinessDirectoryCard key={facility.id} facility={facility} />
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No facilities found matching your criteria
            </p>
            <Button onClick={() => { setSearchTerm(""); setSelectedType("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;
