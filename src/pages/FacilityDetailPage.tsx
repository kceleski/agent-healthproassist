
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  ChevronRight, 
  Globe, 
  Heart, 
  MapPin, 
  Phone, 
  Share,
  Star,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

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
  phone?: string;
}

const FacilityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  useEffect(() => {
    const loadFacilityData = async () => {
      setIsLoading(true);
      
      try {
        // First try to get data from session storage
        const storedFacility = sessionStorage.getItem('selectedFacility');
        
        if (storedFacility) {
          const parsedFacility = JSON.parse(storedFacility);
          if (parsedFacility.id === id) {
            setFacility(parsedFacility);
            setIsLoading(false);
            return;
          }
        }
        
        // If we don't have the data in session storage, or it's for a different facility,
        // we could fetch it from an API here
        console.log("Facility data not found in session storage, would fetch from API with ID:", id);
        
        // For now, let's create some dummy data to display
        setFacility({
          id: id || "unknown",
          name: "Sample Facility",
          type: "Assisted Living",
          rating: 4.5,
          location: "Phoenix, AZ",
          price: "$$$",
          image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be",
          amenities: ["24/7 Staff", "Dining Services", "Transportation", "Activities"],
          availableBeds: 5,
          description: "This is a sample facility description. In a real application, this would be loaded from an API based on the facility ID.",
          address: "123 Main Street, Phoenix, AZ 85001",
          phone: "(623) 300-2065"
        });
        
      } catch (error) {
        console.error("Error loading facility data:", error);
        toast({
          title: "Error",
          description: "Failed to load facility details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFacilityData();
  }, [id, toast]);
  
  // Function to handle saving facility as favorite
  const handleSaveFavorite = () => {
    toast({
      title: "Facility Saved",
      description: "This facility has been added to your favorites."
    });
  };
  
  // Function to handle sharing facility
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Facility link copied to clipboard."
    });
  };
  
  // Function to handle booking a tour
  const handleBookTour = () => {
    toast({
      title: "Request Sent",
      description: "Your tour request has been sent. We'll contact you shortly to confirm."
    });
  };
  
  // Function to display star rating
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

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 text-center">
        <Building className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold mt-4">Facility Not Found</h2>
        <p className="text-muted-foreground mt-2">The facility you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6 bg-healthcare-600">
          <Link to="/facilities">Back to Facilities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      <Helmet>
        <title>{facility.name} | HealthProAssist</title>
      </Helmet>
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link to="/facilities" className="hover:text-healthcare-600">Facilities</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{facility.name}</span>
      </div>
      
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/facilities" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Facilities
          </Link>
        </Button>
      </div>
      
      {/* Facility Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{facility.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <Badge className="bg-healthcare-100 text-healthcare-700">
            {facility.type}
          </Badge>
          {facility.price && (
            <Badge className="bg-healthcare-100 text-healthcare-700">
              {facility.price}
            </Badge>
          )}
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground">{facility.address || facility.location}</span>
          </div>
          <div>
            {getRatingStars(facility.rating)}
          </div>
        </div>
      </div>
      
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
        <img
          src={facility.image || "https://images.unsplash.com/photo-1571055107559-3e67626fa8be"}
          alt={facility.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1571055107559-3e67626fa8be";
          }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white/90" onClick={handleSaveFavorite}>
            <Heart className="h-4 w-4 text-healthcare-600" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white/90" onClick={handleShare}>
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">About this facility</h2>
              <p className="text-muted-foreground mb-6">
                {facility.description}
              </p>
              
              <h3 className="text-lg font-medium mb-3">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-healthcare-600" />
                  <span>Personalized care plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-healthcare-600" />
                  <span>Private and semi-private rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-healthcare-600" />
                  <span>Community activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-healthcare-600" />
                  <span>Professional staff</span>
                </div>
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Book a Tour</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Schedule a visit to see if this facility is right for you or your loved one.
                  </p>
                  <Button className="w-full bg-healthcare-600 mb-3" onClick={handleBookTour}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Tour
                  </Button>
                  {facility.phone && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`tel:${facility.phone.replace(/\D/g, '')}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {facility.phone}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="amenities" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Amenities & Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {facility.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                <Star className="h-4 w-4 text-healthcare-600" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Current Availability</h2>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{facility.availableBeds} Beds Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated today
                  </p>
                </div>
                <Button className="bg-healthcare-600" onClick={handleBookTour}>
                  Request Availability
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-muted-foreground">
            Availability changes frequently. Contact the facility directly for the most up-to-date information.
          </p>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-healthcare-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">{facility.address || facility.location}</p>
              </div>
            </div>
            
            {facility.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-healthcare-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">
                    <a href={`tel:${facility.phone.replace(/\D/g, '')}`} className="hover:underline">
                      {facility.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {facility.url && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-healthcare-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Website</h3>
                  <p className="text-muted-foreground">
                    <a href={facility.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {facility.url.replace(/^https?:\/\//i, '')}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Similar Facilities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Similar Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="h-40 bg-muted">
                  <img 
                    src={`https://images.unsplash.com/photo-${1550000000000 + i * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                    alt="Similar Facility"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1571055107559-3e67626fa8be";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Similar Facility {i}</h3>
                  <p className="text-sm text-muted-foreground my-1">Phoenix, AZ</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-xs">(4.0)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailPage;
