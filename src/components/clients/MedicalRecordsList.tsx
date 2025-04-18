
import { useState } from 'react';
import { MedicalRecordCard, MedicalRecordCardProps } from './MedicalRecordCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MedicalRecordsListProps {
  clients: Omit<MedicalRecordCardProps, 'key'>[];
}

export const MedicalRecordsList = ({ clients }: MedicalRecordsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => 
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client, i) => (
          <MedicalRecordCard key={i} {...client} />
        ))}
        {filteredClients.length === 0 && (
          <div className="col-span-2 py-8 text-center text-muted-foreground">
            No clients match your search criteria
          </div>
        )}
      </div>
    </div>
  );
};
