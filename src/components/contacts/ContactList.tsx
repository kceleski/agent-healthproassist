
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building, Users } from "lucide-react";
import { ContactCard } from "./ContactCard";

interface ContactListProps {
  contacts: any[];
  onViewDetails: (contact: any) => void;
  onAddContact: () => void;
  isPro?: boolean;
  type?: 'seniors' | 'facilities';
}

export const ContactList = ({ contacts, onViewDetails, onAddContact, isPro = false, type = 'seniors' }: ContactListProps) => {
  if (contacts.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-8">
          {type === 'facilities' ? (
            <Building className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-4" />
          ) : (
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-4" />
          )}
          <h3 className="text-base sm:text-lg font-medium mb-1">
            No {type === 'facilities' ? 'facility contacts' : 'senior clients'} found
          </h3>
          <p className="text-muted-foreground mb-4 text-sm text-center">
            Try adjusting your search terms or add a new {type === 'facilities' ? 'facility contact' : 'senior client'}.
          </p>
          <Button onClick={onAddContact} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add {type === 'facilities' ? 'Facility Contact' : 'Senior Client'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {contacts.map((contact, index) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onViewDetails={onViewDetails}
          isPro={isPro}
        />
      ))}
    </div>
  );
};
