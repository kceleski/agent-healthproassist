import React from 'react';
import { SeniorClientData } from '@/services/clientService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ContactDetailsProps {
  contact: SeniorClientData;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact }) => {
  const initials = `${contact.first_name[0] || ''}${contact.last_name[0] || ''}`;

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{contact.first_name} {contact.last_name}</CardTitle>
            <CardDescription>{contact.email || 'No email provided'}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Phone</h3>
                <p>{contact.phone || 'N/A'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Location</h3>
                <p>{contact.city || 'N/A'}, {contact.state || 'N/A'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Veteran Status</h3>
                <p>{contact.veteran_status ? 'Yes' : 'No'}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetails;
