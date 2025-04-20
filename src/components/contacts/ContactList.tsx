
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building, Users } from "lucide-react";
import { ContactCard } from "./ContactCard";
import { HolographicCard, HolographicCardContent } from "@/components/ui/holographic-card";
import { HolographicButton } from "@/components/ui/holographic-button";

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
      <HolographicCard className="w-full">
        <HolographicCardContent className="flex flex-col items-center justify-center p-6 sm:p-10">
          {type === 'facilities' ? (
            <Building className="h-12 w-12 sm:h-16 sm:w-16 text-holo-blue mb-6 opacity-60 neon-glow" />
          ) : (
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-holo-blue mb-6 opacity-60 neon-glow" />
          )}
          <h3 className="text-lg sm:text-xl font-medium mb-2">
            No {type === 'facilities' ? 'facility contacts' : 'senior clients'} found
          </h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Try adjusting your search terms or add a new {type === 'facilities' ? 'facility contact' : 'senior client'}.
          </p>
          <HolographicButton onClick={onAddContact} variant="glowing">
            <Plus className="h-4 w-4 mr-2" />
            Add {type === 'facilities' ? 'Facility Contact' : 'Senior Client'}
          </HolographicButton>
        </HolographicCardContent>
      </HolographicCard>
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
          style={{ animationDelay: `${index * 100}ms` }}
          className="float-card"
        />
      ))}
    </div>
  );
};
