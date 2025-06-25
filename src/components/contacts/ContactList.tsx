
import { useState, useEffect } from "react";
import { ContactCard } from "./ContactCard";
import { getSeniorClients, SeniorClientData } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ContactList = () => {
  const [contacts, setContacts] = useState<SeniorClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getSeniorClients();
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onUpdate={fetchContacts} />
      ))}
    </div>
  );
};

export default ContactList;
