import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export interface Facility {
  id: string;
  name: string;
  type?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
  image_url?: string;
  tags?: string[];
}

interface FacilityCardProps {
  facility: Facility;
  onViewDetails: (facility: Facility) => void;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onViewDetails }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <img src={facility.image_url || 'https://via.placeholder.com/800x400?text=HealthProAssist'} alt={facility.name} className="w-full h-48 object-cover rounded-t-lg" />
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{facility.name}</h3>
        <Badge variant="secondary" className="text-xs w-fit">{facility.type}</Badge>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{facility.city}, {facility.state}</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-3">{facility.description}</p>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="default" className="w-full" onClick={() => onViewDetails(facility)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacilityCard;
