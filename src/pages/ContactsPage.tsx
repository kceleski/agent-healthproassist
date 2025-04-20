
import { useState, useEffect } from "react";
import { Filter, Download, Plus, Search, X, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactDetails } from "@/components/contacts/ContactDetails";
import AddSeniorClientForm from "@/components/contacts/AddSeniorClientForm";
import { initialSeniorsData, facilityContactsData } from "@/data/contacts";
import { HolographicButton } from "@/components/ui/holographic-button";
import { HolographicCard, HolographicCardContent, HolographicCardHeader, HolographicCardTitle, HolographicCardDescription } from "@/components/ui/holographic-card";

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
    setIsContactDialogOpen(false);
  };

  return (
    <div className="container max-w-full py-4 px-2 sm:py-6 sm:px-4 animate-fade-in">
      <div className="space-y-3 sm:space-y-6">
        <HolographicCard variant="elevated" className="p-4 sm:p-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 neon-text">Contacts</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {isProUser 
                ? "Manage your senior clients and facility contacts in one place."
                : "Manage your senior clients in one place."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-4">
            <form onSubmit={handleSearch} className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 w-full bg-white/50 dark:bg-slate-900/50 border-white/30 backdrop-blur-lg"
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
            <div className="flex gap-2 justify-end">
              <HolographicButton 
                variant="outline" 
                onClick={handleExport}
                className="flex-none"
                size="sm"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </HolographicButton>
              <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <HolographicButton 
                  variant="glowing" 
                  onClick={() => setIsContactDialogOpen(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {isProUser ? "Add Contact" : "Add Senior"}
                  </span>
                </HolographicButton>
                <DialogContent className="sm:max-w-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/30 dark:border-white/10">
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
        </HolographicCard>

        <div className="float-card holographic-panel">
          {isProUser ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <TabsList className="w-full sm:w-auto bg-white/30 dark:bg-slate-900/30">
                  <TabsTrigger 
                    value="seniors" 
                    className="flex-1 sm:flex-none items-center gap-2 data-[state=active]:bg-holo-blue/30 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Senior Clients</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="facilities"  
                    className="flex-1 sm:flex-none items-center gap-2 data-[state=active]:bg-holo-blue/30 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  >
                    <Building className="h-4 w-4" />
                    <span className="hidden sm:inline">Facility Contacts</span>
                  </TabsTrigger>
                </TabsList>
                <HolographicButton 
                  variant="outline" 
                  size="sm" 
                  onClick={handleApplyFilters}
                  className="hidden sm:flex"
                >
                  <Filter className="h-3 w-3 mr-2" />
                  Filter
                </HolographicButton>
              </div>
              
              <TabsContent value="seniors" className="p-4 mt-0">
                <ContactList
                  contacts={filteredSeniors}
                  onViewDetails={openContactDetails}
                  onAddContact={() => setIsContactDialogOpen(true)}
                  type="seniors"
                  isPro={isProUser}
                />
              </TabsContent>
              
              <TabsContent value="facilities" className="p-4 mt-0">
                <ContactList
                  contacts={filteredFacilities}
                  onViewDetails={openContactDetails}
                  onAddContact={() => setIsContactDialogOpen(true)}
                  type="facilities"
                  isPro={isProUser}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs value="seniors" className="w-full">
              <TabsContent value="seniors" className="p-4 mt-0">
                <ContactList
                  contacts={filteredSeniors}
                  onViewDetails={openContactDetails}
                  onAddContact={() => setIsContactDialogOpen(true)}
                  type="seniors"
                  isPro={isProUser}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>

        <ContactDetails
          contact={selectedContact}
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
        />
      </div>
    </div>
  );
};

export default ContactsPage;
