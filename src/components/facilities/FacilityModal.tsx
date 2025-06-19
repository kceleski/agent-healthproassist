import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';
import { Facility } from './FacilityCard';

interface FacilityModalProps {
  facility: Facility | null;
  isOpen: boolean;
  onClose: () => void;
}

const FacilityModal: React.FC<FacilityModalProps> = ({ facility, isOpen, onClose }) => {
  if (!facility) return null;
  const images = facility.image_url ? [facility.image_url] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{facility.name}</DialogTitle>
          <Badge variant="secondary" className="w-fit">{facility.type}</Badge>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
             <p className="text-gray-700">{facility.description}</p>
             <h3 className="font-semibold text-lg">Services & Amenities</h3>
             <div className="flex flex-wrap gap-2">
                {facility.tags?.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
             </div>
          </TabsContent>
          <TabsContent value="gallery" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, i) => <img key={i} src={image} alt={facility.name} className="w-full h-48 object-cover rounded-lg" />)}
                {images.length === 0 && <p>No images available.</p>}
            </div>
          </TabsContent>
          <TabsContent value="contact" className="space-y-4 pt-4">
             <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-500" /> <a href={`tel:${facility.phone}`} className="text-blue-600 hover:underline">{facility.phone}</a></div>
             <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-gray-500" /> <a href={facility.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit Website</a></div>
             <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-500" /> <span>{`${facility.street}, ${facility.city}, ${facility.state}`}</span></div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityModal;
