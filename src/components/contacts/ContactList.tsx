
import { useState, useEffect } from "react";
import { ContactCard } from "./ContactCard";
import { getSeniorClients, SeniorClientData } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ContactListProps {
  contacts: SeniorClientData[];
  selectedContact: SeniorClientData | null;
  onSelectContact: (contact: SeniorClientData) => void;
}

const ContactList = ({ contacts, selectedContact, onSelectContact }: ContactListProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        <ContactCard 
          key={contact.id} 
          contact={{
            id: contact.id,
            name: `${contact.first_name} ${contact.last_name}`,
            email: contact.email,
            phone: contact.phone,
            location: `${contact.city || ''}, ${contact.state || ''}`.trim().replace(/^,|,$/, ''),
            lastUpdated: contact.updated_at ? new Date(contact.updated_at).toLocaleDateString() : 'recently'
          }} 
          onViewDetails={onSelectContact}
        />
      ))}
    </div>
  );
};

export default ContactList;
