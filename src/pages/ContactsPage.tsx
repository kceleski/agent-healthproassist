import { useState, useEffect } from "react";
import { 
  Building, 
  CalendarDays, 
  Download, 
  Filter, 
  Mail, 
  MapPin, 
  MoreHorizontal, 
  Phone, 
  Plus, 
  Search, 
  User, 
  Users,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddSeniorClientForm from "@/components/contacts/AddSeniorClientForm";
import { useAuth } from "@/context/AuthContext";

// Sample Senior Clients Data
const initialSeniorsData = [
  {
    id: "1",
    name: "Eleanor Johnson",
    age: 78,
    careNeeds: ["Memory Care", "Medication Management"],
    budget: "$3,500 - $4,500",
    location: "San Francisco, CA",
    phone: "(415) 555-1234",
    email: "eleanor.johnson@example.com",
    status: "Active",
    notes: "Prefers a facility with garden access. Daughter is primary decision maker.",
    lastContact: "2 days ago",
    image: "https://images.unsplash.com/photo-1581579438747-e5b6bdc752df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "Sarah Thompson",
        relationship: "Daughter",
        phone: "(415) 555-5678",
        email: "sarah.thompson@example.com"
      }
    ]
  },
  {
    id: "2",
    name: "Robert Wilson",
    age: 82,
    careNeeds: ["Assisted Living", "Physical Therapy"],
    budget: "$4,000 - $5,000",
    location: "Oakland, CA",
    phone: "(510) 555-9876",
    email: "robert.wilson@example.com",
    status: "Active",
    notes: "Veteran, interested in facilities with veteran programs. Uses a walker.",
    lastContact: "1 week ago",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "Michael Wilson",
        relationship: "Son",
        phone: "(510) 555-4321",
        email: "michael.wilson@example.com"
      }
    ]
  },
  {
    id: "3",
    name: "Maria Garcia",
    age: 75,
    careNeeds: ["Independent Living", "Meal Preparation"],
    budget: "$3,000 - $4,000",
    location: "San Jose, CA",
    phone: "(408) 555-7890",
    email: "maria.garcia@example.com",
    status: "Placed",
    notes: "Spanish-speaking, prefers a facility with bilingual staff. Enjoys community activities.",
    lastContact: "3 weeks ago",
    image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "Carlos Garcia",
        relationship: "Son",
        phone: "(408) 555-4567",
        email: "carlos.garcia@example.com"
      },
      {
        name: "Sofia Martinez",
        relationship: "Daughter",
        phone: "(408) 555-2345",
        email: "sofia.martinez@example.com"
      }
    ]
  },
  {
    id: "4",
    name: "James Smith",
    age: 85,
    careNeeds: ["Skilled Nursing", "Wound Care"],
    budget: "$5,000 - $6,500",
    location: "Palo Alto, CA",
    phone: "(650) 555-6543",
    email: "james.smith@example.com",
    status: "Active",
    notes: "Recently hospitalized, needs a facility with strong medical care. Prefers private room.",
    lastContact: "Yesterday",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "John Smith",
        relationship: "Nephew",
        phone: "(650) 555-7890",
        email: "john.smith@example.com"
      }
    ]
  }
];

// Sample Facility Contacts Data
const facilityContactsData = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Admissions Director",
    facility: "Sunset Senior Living",
    facilityType: "Assisted Living",
    location: "San Francisco, CA",
    phone: "(415) 555-1234",
    email: "sarah.johnson@sunsetseniorliving.com",
    lastContact: "2 days ago",
    notes: "Prefers email communication. Quick to respond to placement inquiries.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "2",
    name: "James Wilson",
    title: "Memory Care Director",
    facility: "Golden Years Home",
    facilityType: "Memory Care",
    location: "Oakland, CA",
    phone: "(510) 555-5678",
    email: "james.wilson@goldenyearshome.com",
    lastContact: "1 week ago",
    notes: "Excellent resource for memory care placements. Conducts thorough assessments.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    title: "Community Relations Manager",
    facility: "Serenity Care Center",
    facilityType: "Skilled Nursing",
    location: "San Jose, CA",
    phone: "(408) 555-9012",
    email: "maria.rodriguez@serenitycare.com",
    lastContact: "3 days ago",
    notes: "Bilingual (Spanish/English). Good follow-up on placement status.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "4",
    name: "Robert Chen",
    title: "Executive Director",
    facility: "Riverside Retirement",
    facilityType: "Independent Living",
    location: "Palo Alto, CA",
    phone: "(650) 555-3456",
    email: "robert.chen@riversideretirement.com",
    lastContact: "2 weeks ago",
    notes: "Best to schedule appointments. Offers competitive commission rates.",
    image: "https://images.unsplash.com/photo-1500648733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "5",
    name: "Jennifer Williams",
    title: "Marketing Director",
    facility: "Oakwood Senior Community",
    facilityType: "Assisted Living",
    location: "San Francisco, CA",
    phone: "(415) 555-7890",
    email: "jennifer.williams@oakwoodsenior.com",
    lastContact: "5 days ago",
    notes: "Hosts regular facility tours. Responsive to urgent placement needs.",
    image: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  }
];

const ContactsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [seniorsData, setSeniorsData] = useState(() => {
    const savedSeniors = localStorage.getItem("seniorClients");
    return savedSeniors ? JSON.parse(savedSeniors) : initialSeniorsData;
  });
  const [filteredSeniors, setFilteredSeniors] = useState(seniorsData);
  const [filteredFacilities, setFilteredFacilities] = useState(facilityContactsData);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("seniors");
  
  const userTier = user?.demoTier || user?.subscription || 'basic';
  const isProUser = userTier === "premium";

  useEffect(() => {
    localStorage.setItem("seniorClients", JSON.stringify(seniorsData));
    setFilteredSeniors(seniorsData);
  }, [seniorsData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      const matchedSeniors = seniorsData.filter(
        (senior: any) => 
          senior.name.toLowerCase().includes(query) ||
          senior.location.toLowerCase().includes(query) ||
          senior.careNeeds.some((need: string) => need.toLowerCase().includes(query))
      );
      
      const matchedFacilities = isProUser ? facilityContactsData.filter(
        (contact: any) => 
          contact.name.toLowerCase().includes(query) ||
          contact.facility.toLowerCase().includes(query) ||
          contact.location.toLowerCase().includes(query) ||
          contact.facilityType.toLowerCase().includes(query)
      ) : [];
      
      setFilteredSeniors(matchedSeniors);
      setFilteredFacilities(matchedFacilities);
    } else {
      setFilteredSeniors(seniorsData);
      setFilteredFacilities(isProUser ? facilityContactsData : []);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredSeniors(seniorsData);
    setFilteredFacilities(isProUser ? facilityContactsData : []);
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: "Contact filters have been updated.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Contacts Exported",
      description: "The contacts have been exported to CSV successfully.",
    });
  };

  const openContactDetails = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailDrawerOpen(true);
  };

  const handleSaveSeniorClient = (newClient: any) => {
    setSeniorsData([newClient, ...seniorsData]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          {isProUser 
            ? "Manage your senior clients and facility contacts in one place."
            : "Manage your senior clients in one place."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isProUser 
                ? "Search contacts by name, location, or facility..."
                : "Search senior clients by name, location, or needs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <Button className="bg-healthcare-600" onClick={() => setIsContactDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {isProUser ? "Add Contact" : "Add Senior Client"}
            </Button>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Senior Client</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new senior client to your contacts.
                </DialogDescription>
              </DialogHeader>
              <AddSeniorClientForm 
                onClose={() => setIsContactDialogOpen(false)}
                onSave={handleSaveSeniorClient}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isProUser ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="seniors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Senior Clients
              </TabsTrigger>
              <TabsTrigger value="facilities" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Facility Contacts
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={handleApplyFilters}>
              <Filter className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
          
          <TabsContent value="seniors">
            {filteredSeniors.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Users className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No senior clients found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or add a new senior client.
                  </p>
                  <Button onClick={() => setIsContactDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Senior Client
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeniors.map((senior, index) => (
                  <Card key={senior.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={senior.image} />
                          <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg truncate">{senior.name}</h3>
                            <Badge 
                              className={senior.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                            >
                              {senior.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>{senior.age} years old</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 pb-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {senior.careNeeds.map((need, i) => (
                            <Badge key={i} variant="outline" className="bg-healthcare-50 text-healthcare-700 text-xs font-normal">
                              {need}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <span>{senior.location}</span>
                          </div>
                          <div className="flex items-start">
                            <Mail className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <a 
                              href={`mailto:${senior.email}`} 
                              className="truncate hover:text-healthcare-600 transition-colors"
                            >
                              {senior.email}
                            </a>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <a 
                              href={`tel:${senior.phone}`} 
                              className="hover:text-healthcare-600 transition-colors"
                            >
                              {senior.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Last contact: {senior.lastContact}
                          </div>
                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openContactDetails(senior)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                                <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8"
                              onClick={() => openContactDetails(senior)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="facilities">
            {filteredFacilities.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Building className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No facility contacts found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or add a new facility contact.
                  </p>
                  <Button onClick={() => setIsContactDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Facility Contact
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((contact, index) => (
                  <Card key={contact.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={contact.image} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg truncate">{contact.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                            <span className="truncate">{contact.title}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 pb-3">
                        <Badge variant="outline" className="bg-healthcare-50 text-healthcare-700 text-xs font-normal mb-3">
                          {contact.facilityType}
                        </Badge>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-start">
                            <Building className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <span className="font-medium">{contact.facility}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <span>{contact.location}</span>
                          </div>
                          <div className="flex items-start">
                            <Mail className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <a 
                              href={`mailto:${contact.email}`} 
                              className="truncate hover:text-healthcare-600 transition-colors"
                            >
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                            <a 
                              href={`tel:${contact.phone}`} 
                              className="hover:text-healthcare-600 transition-colors"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Last contact: {contact.lastContact}
                          </div>
                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openContactDetails(contact)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                                <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8"
                              onClick={() => openContactDetails(contact)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          {filteredSeniors.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No senior clients found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or add a new senior client.
                </p>
                <Button onClick={() => setIsContactDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Senior Client
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeniors.map((senior, index) => (
                <Card key={senior.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={senior.image} />
                        <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg truncate">{senior.name}</h3>
                          <Badge 
                            className={senior.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                          >
                            {senior.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span>{senior.age} years old</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {senior.careNeeds.map((need, i) => (
                          <Badge key={i} variant="outline" className="bg-healthcare-50 text-healthcare-700 text-xs font-normal">
                            {need}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                          <span>{senior.location}</span>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                          <a 
                            href={`mailto:${senior.email}`} 
                            className="truncate hover:text-healthcare-600 transition-colors"
                          >
                            {senior.email}
                          </a>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                          <a 
                            href={`tel:${senior.phone}`} 
                            className="hover:text-healthcare-600 transition-colors"
                          >
                            {senior.phone}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          Last contact: {senior.lastContact}
                        </div>
                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openContactDetails(senior)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                              <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => openContactDetails(senior)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedContact && (
        <Sheet open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Contact Details</SheetTitle>
              <SheetDescription>
                View detailed information about this contact
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedContact.image} />
                  <AvatarFallback>{selectedContact.name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">{selectedContact.name}</h3>
                  
                  {selectedContact.facility ? (
                    <div className="mt-1">
                      <span className="text-muted-foreground">{selectedContact.title}</span>
                      <Badge className="ml-2 bg-healthcare-50 text-healthcare-700">
                        {selectedContact.facilityType}
                      </Badge>
                    </div>
                  ) : (
                    <div className="mt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="text-muted-foreground">{selectedContact.age} years old</span>
                      <Badge className={
                        selectedContact.status === "Active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }>
                        {selectedContact.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {selectedContact.facility ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground mb-1 block">Facility</Label>
                    <p className="font-medium">{selectedContact.facility}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground mb-1 block">Care Needs</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedContact.careNeeds?.map((need: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-healthcare-50 text-healthcare-700">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground mb-1 block">Budget</Label>
                    <p>{selectedContact.budget}</p>
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-muted-foreground mb-1 block">Contact Information</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedContact.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="text-healthcare-600 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${selectedContact.phone}`}
                      className="text-healthcare-600 hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              {selectedContact.familyContacts && (
                <div>
                  <Label className="text-muted-foreground mb-1 block">Family Contacts</Label>
                  <div className="space-y-4 mt-2">
                    {selectedContact.familyContacts.map((contact: any, index: number) => (
                      <div key={index} className="bg-muted/50 p-3 rounded-md">
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {contact.relationship}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a 
                              href={`mailto:${contact.email}`}
                              className="text-healthcare-600 hover:underline"
                            >
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <a 
                              href={`tel:${contact.phone}`}
                              className="text-healthcare-600 hover:underline"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedContact.notes && (
                <div>
                  <Label className="text-muted-foreground mb-1 block">Notes</Label>
                  <div className="bg-muted/50 p-3 rounded-md mt-1">
                    <p className="text-sm">{selectedContact.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-1" />
                Last contact: {selectedContact.lastContact}
              </div>
            </div>
            
            <SheetFooter className="mt-6">
              <Button className="w-full" variant="outline" onClick={() => setIsDetailDrawerOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ContactsPage;
