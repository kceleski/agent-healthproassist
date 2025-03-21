
import { useState } from "react";
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
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Sample Senior Clients Data
const seniorsData = [
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
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSeniors, setFilteredSeniors] = useState(seniorsData);
  const [filteredFacilities, setFilteredFacilities] = useState(facilityContactsData);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      const matchedSeniors = seniorsData.filter(
        senior => 
          senior.name.toLowerCase().includes(query) ||
          senior.location.toLowerCase().includes(query) ||
          senior.careNeeds.some(need => need.toLowerCase().includes(query))
      );
      
      const matchedFacilities = facilityContactsData.filter(
        contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.facility.toLowerCase().includes(query) ||
          contact.location.toLowerCase().includes(query) ||
          contact.facilityType.toLowerCase().includes(query)
      );
      
      setFilteredSeniors(matchedSeniors);
      setFilteredFacilities(matchedFacilities);
    } else {
      setFilteredSeniors(seniorsData);
      setFilteredFacilities(facilityContactsData);
    }
  };

  // Handle export
  const handleExport = () => {
    toast({
      title: "Contacts Exported",
      description: "The contacts have been exported to CSV successfully.",
    });
  };

  // Open contact detail drawer
  const openContactDetails = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your senior clients and facility contacts in one place.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts by name, location, or facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  This feature will be available in a future update.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Contacts Tabs */}
      <Tabs defaultValue="seniors" className="w-full">
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
          <Button variant="outline" size="sm">
            <Filter className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
        
        {/* Seniors Tab Content */}
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
        
        {/* Facility Contacts Tab Content */}
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
                        <p className="text-sm text-muted-foreground truncate">{contact.title}</p>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-3">
                      <div className="mb-3">
                        <h4 className="font-medium">{contact.facility}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-healthcare-50 text-healthcare-700 text-xs font-normal">
                            {contact.facilityType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
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

      {/* Contact Details Dialog */}
      {selectedContact && (
        <Dialog open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedContact.image} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedContact.name}</h2>
                  {'title' in selectedContact ? (
                    <>
                      <p className="text-muted-foreground">{selectedContact.title}</p>
                      <p className="font-medium mt-1">{selectedContact.facility}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground">{selectedContact.age} years old</p>
                        <Badge 
                          className={selectedContact.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                        >
                          {selectedContact.status}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                      <span>{selectedContact.location}</span>
                    </div>
                    <div className="flex">
                      <Mail className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                      <a 
                        href={`mailto:${selectedContact.email}`} 
                        className="hover:text-healthcare-600 transition-colors"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                    <div className="flex">
                      <Phone className="h-5 w-5 text-healthcare-600 mr-2 shrink-0" />
                      <a 
                        href={`tel:${selectedContact.phone}`} 
                        className="hover:text-healthcare-600 transition-colors"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                {'careNeeds' in selectedContact ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Care Needs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedContact.careNeeds.map((need: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-healthcare-50 text-healthcare-700 font-normal">
                            {need}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Budget Range</div>
                        <div className="font-medium">{selectedContact.budget}</div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Facility Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-healthcare-50 text-healthcare-700 font-normal">
                          {selectedContact.facilityType}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">Last Contacted</div>
                        <div className="font-medium">{selectedContact.lastContact}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{selectedContact.notes}</p>
                </CardContent>
              </Card>
              
              {'familyContacts' in selectedContact && selectedContact.familyContacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Family Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedContact.familyContacts.map((family: any, i: number) => (
                        <div key={i} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{family.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{family.name}</div>
                            <div className="text-sm text-muted-foreground">{family.relationship}</div>
                            <div className="flex items-center gap-4 mt-1">
                              <a href={`mailto:${family.email}`} className="text-xs text-healthcare-600 hover:underline flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {family.email}
                              </a>
                              <a href={`tel:${family.phone}`} className="text-xs text-healthcare-600 hover:underline flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {family.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">Edit Contact</Button>
                <Button className="bg-healthcare-600">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContactsPage;
