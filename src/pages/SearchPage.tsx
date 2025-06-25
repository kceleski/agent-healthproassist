
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Bot, Sparkles, ArrowRight, Clock, Users, Star } from "lucide-react";
import { saveSearchResult } from '@/services/searchResultService';
import { useAISearch } from '@/hooks/useAISearch';

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
  const [aiQuery, setAIQuery] = useState<string>("");
  
  const { sendMessage, isLoading: aiLoading } = useAISearch((filters: any) => {
    if (filters.location) setLocation(filters.location);
    if (filters.facilityType) setSelectedCareType(filters.facilityType);
    if (filters.amenities) setSelectedAmenities(filters.amenities);
  });

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

  // Handle search submission
  const handleSearch = async () => {
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

  const handleAISearch = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter what you're looking for",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMessage(aiQuery);
      setAIQuery("");
    } catch (error) {
      console.error('AI Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-white to-blue-50">
      <Helmet>
        <title>Search Facilities - HealthProAssist</title>
        <meta name="description" content="Search for senior care facilities based on location, care type, and amenities." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-healthcare-500/5 to-blue-500/5" />
        <div className="relative container max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find the Perfect
              <span className="text-healthcare-600 block">Senior Care Facility</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover quality care facilities that match your specific needs with our intelligent search platform
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-healthcare-100 rounded-full mx-auto mb-3">
                <Users className="h-6 w-6 text-healthcare-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Verified Facilities</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">< 24hrs</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Traditional Search */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-healthcare-100 rounded-full mx-auto mb-4">
                <Search className="h-6 w-6 text-healthcare-600" />
              </div>
              <CardTitle className="text-2xl">Detailed Search</CardTitle>
              <CardDescription className="text-base">
                Use our advanced filters to find facilities that match your specific criteria
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="location" className="text-base font-medium">Location</Label>
                <div className="relative mt-2">
                  <Input
                    id="location"
                    placeholder="Enter city, state, or zip code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="care-type" className="text-base font-medium">Care Type</Label>
                <Select value={selectedCareType} onValueChange={setSelectedCareType}>
                  <SelectTrigger className="mt-2 h-12 text-base">
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
              
              <div>
                <Label className="text-base font-medium mb-4 block">Amenities & Services</Label>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <label
                        htmlFor={`amenity-${amenity.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedAmenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map(amenityId => {
                    const amenity = amenities.find(a => a.id === amenityId);
                    return (
                      <Badge key={amenityId} variant="secondary" className="px-3 py-1">
                        {amenity?.label}
                      </Badge>
                    );
                  })}
                </div>
              )}
              
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                size="lg"
                className="w-full h-12 text-base bg-healthcare-600 hover:bg-healthcare-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    Search Facilities
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Search */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                AI-Powered Search
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </CardTitle>
              <CardDescription className="text-base">
                Describe what you're looking for in natural language and let our AI find the perfect match
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="ai-query" className="text-base font-medium">Tell us what you need</Label>
                <div className="mt-2">
                  <Input
                    id="ai-query"
                    placeholder="E.g., 'Looking for memory care facilities in Phoenix with activities for seniors'"
                    value={aiQuery}
                    onChange={(e) => setAIQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAISearch();
                      }
                    }}
                    className="h-12 text-base"
                  />
                </div>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Try queries like:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Find memory care facilities in Phoenix with transportation services"</li>
                  <li>• "Show me assisted living options with pet-friendly amenities"</li>
                  <li>• "Nursing facilities with 24/7 medical staff near Scottsdale"</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleAISearch}
                disabled={aiLoading}
                size="lg"
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-5 w-5" />
                    Ask AI Assistant
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
