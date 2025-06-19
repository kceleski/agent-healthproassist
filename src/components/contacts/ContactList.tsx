import React from 'react';
import { SeniorClientData } from '@/services/clientService';
import ContactCard from './ContactCard';

interface ContactListProps {
  contacts: SeniorClientData[];
  selectedContact: SeniorClientData | null;
  onSelectContact: (contact: SeniorClientData) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, selectedContact, onSelectContact }) => {
  return (
    <div>
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          isSelected={selectedContact?.id === contact.id}
          onClick={() => onSelectContact(contact)}
        />
      ))}
    </div>
  );
};

export default ContactList;
