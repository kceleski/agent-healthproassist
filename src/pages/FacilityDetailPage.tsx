
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Check, 
  Clock, 
  DollarSign, 
  Globe, 
  Mail, 
  MapPin, 
  Phone, 
  Share2, 
  Star, 
  User, 
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Sample facilities data (in a real app, this would come from an API)
const facilitiesData = [
  {
    id: "1",
    name: "Sunset Senior Living",
    type: "Assisted Living",
    rating: 4.5,
    location: "San Francisco, CA",
    address: "123 Golden Gate Ave, San Francisco, CA 94102",
    price: "$$$",
    priceRange: "$3,500 - $5,800 per month",
    image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    amenities: [
      "24/7 Caregivers",
      "Medication Management",
      "Transportation Services",
      "Fine Dining",
      "Social Activities",
      "Housekeeping",
      "Laundry Services",
      "Fitness Center"
    ],
    services: [
      "Assistance with daily living",
      "Medication monitoring",
      "Memory care programs",
      "Wellness checks",
      "Physical therapy",
      "Occupational therapy"
    ],
    description: "Luxury senior living community with personalized care services and beautiful surroundings. Our compassionate team provides assistance with daily activities while promoting independence and dignity. Residents enjoy chef-prepared meals, engaging social activities, and beautiful garden spaces.",
    longDescription: "Sunset Senior Living offers a premier assisted living experience designed to enhance the quality of life for seniors while providing the support they need. Our beautiful community features spacious apartments, elegant common areas, and outdoor spaces that invite residents to relax and socialize.\n\nOur approach to care is person-centered, meaning we tailor our services to each resident's unique needs and preferences. Whether it's assistance with daily activities, medication management, or specialized memory care, our highly trained staff is available 24/7 to provide support while promoting independence and dignity.\n\nResidents enjoy three chef-prepared meals daily in our restaurant-style dining room, with menu options that accommodate dietary restrictions while offering delicious, nutritious choices. Our social calendar is filled with engaging activities, cultural outings, and educational programs designed to keep residents active, connected, and intellectually stimulated.",
    availableBeds: 5,
    openSince: "2015",
    totalUnits: 85,
    staff: 42,
    staffRatio: "1:6",
    licenseNumber: "AL-CA-12345",
    photos: [
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1610897600804-1e64e8223ecf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1592938927918-2f3bd5ba685a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    ],
    contactInfo: {
      name: "Sarah Johnson",
      title: "Admissions Director",
      email: "sarah.johnson@sunsetseniorliving.com",
      phone: "(415) 555-1234",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
    payment: {
      methods: ["Private Pay", "Long-term Care Insurance", "Veterans Benefits"],
      commission: "$1,500 per placement",
      commissionDetails: "One-time payment of $1,500 per resident placed. Additional $500 bonus for residents who stay longer than 6 months."
    },
    reviews: [
      {
        id: "1",
        author: "Michael Thompson",
        role: "Family Member",
        date: "August 15, 2023",
        rating: 5,
        text: "My mother has been at Sunset Senior Living for over a year now, and we couldn't be happier with the care she receives. The staff is attentive, kind, and truly makes her feel at home."
      },
      {
        id: "2",
        author: "Jennifer Wilson",
        role: "Resident",
        date: "July 3, 2023",
        rating: 4,
        text: "I've lived here for 6 months and am very pleased with my decision. The activities keep me engaged, and I've made wonderful friends. The only improvement I'd suggest is more menu variety."
      },
      {
        id: "3",
        author: "Robert Garcia",
        role: "Family Member",
        date: "May 22, 2023",
        rating: 5,
        text: "The care my father receives is exceptional. From the nursing staff to the dining team, everyone goes above and beyond to make residents comfortable and happy."
      }
    ]
  },
  {
    id: "2",
    name: "Golden Years Home",
    type: "Memory Care",
    rating: 4.2,
    location: "Oakland, CA",
    address: "456 Oak Street, Oakland, CA 94610",
    price: "$$",
    priceRange: "$4,200 - $6,500 per month",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    amenities: [
      "Secured Environment",
      "24/7 Specialized Care",
      "Memory Enhancement Programs",
      "Sensory Stimulation",
      "Private Dining",
      "Outdoor Gardens",
      "Family Support Services"
    ],
    services: [
      "Memory care programs",
      "Cognitive therapy",
      "Personal care assistance",
      "Medication management",
      "Behavioral support",
      "Family education"
    ],
    description: "Specialized memory care facility with compassionate staff and engaging activities designed specifically for residents with Alzheimer's and other forms of dementia.",
    longDescription: "Golden Years Home is dedicated to providing exceptional memory care in a secure, supportive environment. Our specially trained staff understands the unique challenges that come with Alzheimer's disease and other forms of dementia, and we're committed to enhancing quality of life through personalized care plans and engaging activities.\n\nOur purpose-built community features secure outdoor spaces, easy-to-navigate hallways, and visual cues to help residents maintain their independence while ensuring their safety. Private and semi-private suites are designed to feel homey and familiar, with memory boxes outside each door to help residents identify their own spaces.\n\nWe take a holistic approach to memory care, offering a range of therapies and activities that engage the mind, body, and spirit. From reminiscence therapy and cognitive exercises to sensory stimulation and gentle physical activity, our programs are designed to slow cognitive decline and promote moments of joy and connection.",
    availableBeds: 3,
    openSince: "2010",
    totalUnits: 42,
    staff: 35,
    staffRatio: "1:5",
    licenseNumber: "MC-CA-54321",
    photos: [
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    ],
    contactInfo: {
      name: "James Wilson",
      title: "Memory Care Director",
      email: "james.wilson@goldenyearshome.com",
      phone: "(510) 555-5678",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
    payment: {
      methods: ["Private Pay", "Long-term Care Insurance", "Limited Medicaid Beds"],
      commission: "$1,200 per placement",
      commissionDetails: "One-time payment of $1,200 per resident placed. Additional $300 referral bonus for multiple placements from the same agent."
    },
    reviews: [
      {
        id: "1",
        author: "Susan Peterson",
        role: "Family Member",
        date: "September 2, 2023",
        rating: 5,
        text: "The care my husband receives here is outstanding. The staff understands his needs and knows how to handle difficult moments with patience and dignity."
      },
      {
        id: "2",
        author: "David Martin",
        role: "Family Member",
        date: "July 15, 2023",
        rating: 4,
        text: "Golden Years has been a blessing for our family. Mom is well-cared for, and the staff keeps us updated on her condition regularly."
      }
    ]
  }
];

const FacilityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  
  // Find the facility based on ID from the URL
  const facility = facilitiesData.find(f => f.id === id);
  
  if (!facility) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Building className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Facility Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The facility you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/facilities">Back to Facilities</Link>
        </Button>
      </div>
    );
  }

  // Function to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
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
      </div>
    );
  };

  // Handlers
  const handleSaveFacility = () => {
    toast({
      title: "Facility Saved",
      description: `${facility.name} has been added to your saved facilities.`,
    });
  };

  const handleShareFacility = () => {
    // In a real app, this would open a share dialog or copy a link
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "The facility link has been copied to your clipboard.",
    });
  };

  const handleContactSubmit = () => {
    toast({
      title: "Contact Request Sent",
      description: `Your message has been sent to ${facility.contactInfo.name}. They will respond shortly.`,
    });
    setIsContactDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/facilities"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Facilities
      </Link>

      {/* Facility Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className="bg-healthcare-100 text-healthcare-700">{facility.type}</Badge>
            <Badge className="bg-healthcare-100 text-healthcare-700">{facility.price}</Badge>
            <Badge className="bg-muted/80">{facility.availableBeds} beds available</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{facility.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {renderStars(facility.rating)}
              <span className="ml-2 text-sm font-medium">{facility.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {facility.location}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleSaveFacility}>
            Save
          </Button>
          <Button variant="outline" onClick={handleShareFacility}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-600">
                Contact Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contact {facility.name}</DialogTitle>
                <DialogDescription>
                  Send a message to the facility contact person.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-4 mb-4 p-4 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={facility.contactInfo.image} />
                  <AvatarFallback>{facility.contactInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{facility.contactInfo.name}</div>
                  <div className="text-sm text-muted-foreground">{facility.contactInfo.title}</div>
                  <div className="flex items-center gap-4 mt-1">
                    <a href={`mailto:${facility.contactInfo.email}`} className="text-xs text-healthcare-600 hover:underline">
                      <Mail className="h-3 w-3 inline mr-1" />
                      Email
                    </a>
                    <a href={`tel:${facility.contactInfo.phone}`} className="text-xs text-healthcare-600 hover:underline">
                      <Phone className="h-3 w-3 inline mr-1" />
                      Call
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm mb-4">
                  Fill out this form to send a message regarding {facility.name}. The facility contact will get back to you as soon as possible.
                </p>
                {/* Form would go here in a real implementation */}
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 border rounded-md" 
                      placeholder="Describe your inquiry or request..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsContactDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-healthcare-600" onClick={handleContactSubmit}>
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Facility Images */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 rounded-lg overflow-hidden">
          <img 
            src={facility.photos[selectedImageIndex]} 
            alt={facility.name} 
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-1 gap-4">
          {facility.photos.slice(0, 4).map((photo, index) => (
            <div 
              key={index}
              className={`rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedImageIndex === index 
                  ? "ring-2 ring-healthcare-500" 
                  : "hover:opacity-80"
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img 
                src={photo} 
                alt={`${facility.name} ${index + 1}`} 
                className="w-full h-24 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Facility Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>About {facility.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{facility.longDescription}</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Specialized care services offered at {facility.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {facility.services.map((service, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-healthcare-600 mr-2 mt-0.5 shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Open Since</div>
                      <div className="font-medium">{facility.openSince}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Units</div>
                      <div className="font-medium">{facility.totalUnits}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Staff Members</div>
                      <div className="font-medium">{facility.staff}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Staff to Resident Ratio</div>
                      <div className="font-medium">{facility.staffRatio}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">License Number</div>
                      <div className="font-medium">{facility.licenseNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Price Range</div>
                      <div className="font-medium">{facility.priceRange}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden mb-4 bg-muted aspect-video flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                      <address className="not-italic">
                        {facility.address}
                      </address>
                    </div>
                    <Button variant="outline" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Contact Person</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={facility.contactInfo.image} />
                      <AvatarFallback>{facility.contactInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{facility.contactInfo.name}</div>
                      <div className="text-sm text-muted-foreground">{facility.contactInfo.title}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex">
                      <Mail className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                      <a href={`mailto:${facility.contactInfo.email}`} className="hover:underline">
                        {facility.contactInfo.email}
                      </a>
                    </div>
                    <div className="flex">
                      <Phone className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                      <a href={`tel:${facility.contactInfo.phone}`} className="hover:underline">
                        {facility.contactInfo.phone}
                      </a>
                    </div>
                    <Button className="w-full bg-healthcare-600 mt-2">
                      Contact Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Current Availability</div>
                      <div className="font-medium text-2xl">{facility.availableBeds} Beds</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Schedule Tour</div>
                      <Button variant="outline" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Tour
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Amenities Tab */}
        <TabsContent value="amenities" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Amenities and Features</CardTitle>
              <CardDescription>
                Comfort and convenience features available at {facility.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {facility.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-healthcare-600 mr-2 mt-0.5 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Details Tab */}
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Facility Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground">Facility Type</div>
                    <div className="font-medium">{facility.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{facility.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Open Since</div>
                    <div className="font-medium">{facility.openSince}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Units</div>
                    <div className="font-medium">{facility.totalUnits}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Staff Members</div>
                    <div className="font-medium">{facility.staff}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Staff to Resident Ratio</div>
                    <div className="font-medium">{facility.staffRatio}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">License Number</div>
                    <div className="font-medium">{facility.licenseNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Availability</div>
                    <div className="font-medium">{facility.availableBeds} Beds</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Price Range</div>
                    <div className="font-medium">{facility.priceRange}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Care Services</CardTitle>
                <CardDescription>Specialized services offered at this facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facility.services.map((service, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-healthcare-600 mr-2 mt-0.5 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Resident and Family Reviews</CardTitle>
                  <CardDescription>
                    Feedback from residents and their family members
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{facility.rating}</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="flex flex-col">
                    {renderStars(facility.rating)}
                    <div className="text-sm text-muted-foreground mt-1">
                      Based on {facility.reviews.length} reviews
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {facility.reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.author}</div>
                          <div className="text-sm text-muted-foreground">{review.role}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {review.date}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Ways to get in touch with {facility.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={facility.contactInfo.image} />
                    <AvatarFallback>{facility.contactInfo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-lg">{facility.contactInfo.name}</div>
                    <div className="text-muted-foreground">{facility.contactInfo.title}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex">
                    <Mail className="h-5 w-5 text-healthcare-600 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <a href={`mailto:${facility.contactInfo.email}`} className="hover:underline">
                        {facility.contactInfo.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex">
                    <Phone className="h-5 w-5 text-healthcare-600 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <a href={`tel:${facility.contactInfo.phone}`} className="hover:underline">
                        {facility.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex">
                    <MapPin className="h-5 w-5 text-healthcare-600 mr-3 shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">Address</div>
                      <address className="not-italic">
                        {facility.address}
                      </address>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button className="w-full bg-healthcare-600">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Contact the facility directly with your questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="Enter subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea 
                      className="w-full min-h-[100px] p-2 rounded-md border" 
                      placeholder="Enter your message..."
                    />
                  </div>
                  <Button className="w-full bg-healthcare-600">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Payment Tab */}
        <TabsContent value="payment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Accepted payment methods and financial options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold">{facility.priceRange}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Prices may vary based on care level and unit type
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Accepted Payment Methods</h3>
                    <div className="space-y-2">
                      {facility.payment.methods.map((method, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                          <span>{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Financial Assistance</h3>
                    <p className="text-muted-foreground">
                      Contact the facility directly to learn about financial 
                      assistance options and payment plans that may be available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Agent Commission Structure</CardTitle>
                <CardDescription>
                  Information about placement fees and commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Commission Rate</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold">{facility.payment.commission}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Per successful placement
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Commission Details</h3>
                    <p className="text-muted-foreground">
                      {facility.payment.commissionDetails}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Timeline</h3>
                    <p className="text-muted-foreground">
                      Commissions are typically paid within 30 days of resident move-in.
                      Contact the facility for specific payment schedules and terms.
                    </p>
                  </div>
                  
                  <Button className="w-full bg-healthcare-600">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Discuss Commission
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Agent Notes</CardTitle>
              <CardDescription>
                Your private notes about this facility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Your Notes</h3>
                  <textarea 
                    className="w-full min-h-[200px] p-4 rounded-md border" 
                    placeholder="Add your private notes about this facility here. These notes are only visible to you."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    Clear
                  </Button>
                  <Button className="bg-healthcare-600">
                    Save Notes
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Placement History</h3>
                  <div className="text-center py-6 text-muted-foreground">
                    <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No placement history with this facility yet.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Similar Facilities */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-6">Similar Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilitiesData
            .filter(f => f.id !== facility.id)
            .map(similarFacility => (
              <Card key={similarFacility.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={similarFacility.image} 
                      alt={similarFacility.name} 
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
                        {similarFacility.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/facilities/${similarFacility.id}`}>
                      <h3 className="font-medium text-lg hover:text-healthcare-600 transition-colors">
                        {similarFacility.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 my-2">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{similarFacility.location}</span>
                    </div>
                    
                    <div className="mt-2 mb-3">
                      {renderStars(similarFacility.rating)}
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-sm">
                        <span className="font-medium">{similarFacility.availableBeds}</span> beds available
                      </span>
                      <Button asChild size="sm" className="bg-healthcare-600">
                        <Link to={`/facilities/${similarFacility.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailPage;
