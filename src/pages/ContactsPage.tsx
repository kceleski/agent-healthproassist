import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSeniorClients, SeniorClientData } from '@/services/clientService';
import ContactList from '@/components/contacts/ContactList';
import ContactDetails from '@/components/contacts/ContactDetails';
import { AddSeniorClientForm } from '@/components/contacts/AddSeniorClientForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getFullUserProfile } from '@/services/userService';
import { Skeleton } from '@/components/ui/skeleton';

const ContactsPage = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<SeniorClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<SeniorClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        setLoading(true);
        const profile = await getFullUserProfile(user.id);
        setCurrentUserProfile(profile);
        
        const clientData = await getSeniorClients(user.id, profile?.agency_id);
        setClients(clientData);
        if (clientData.length > 0) {
          setSelectedClient(clientData[0]);
        }
        setLoading(false);
      }
    };
    loadData();
  }, [user]);
  
  const handleClientAdded = (newClient: SeniorClientData) => {
    setClients(prev => [newClient, ...prev].sort((a, b) => a.last_name.localeCompare(b.last_name)));
    setIsFormOpen(false);
  };

  return (
    <div className="flex h-full bg-white">
      <div className="w-full md:w-1/3 border-r h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Clients ({clients.length})</h2>
             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Client</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
                    {user && <AddSeniorClientForm userId={user.id} agencyId={currentUserProfile?.agency_id} onClientAdded={handleClientAdded} />}
                </DialogContent>
            </Dialog>
        </div>
        {loading ? (
            <div className="p-4 space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        ) : (
            <ContactList
              contacts={clients}
              selectedContact={selectedClient}
              onSelectContact={setSelectedClient}
            />
        )}
      </div>
      <div className="hidden md:block md:w-2/3 h-full overflow-y-auto">
        {selectedClient ? <ContactDetails contact={selectedClient} /> : <div className="p-8 text-center text-gray-500">Select a client to see details.</div>}
      </div>
    </div>
  );
};

export default ContactsPage;
