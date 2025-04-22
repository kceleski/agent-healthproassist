
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  phone?: string;
  website?: string;
}

const GoogleMapsView = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.4484, lng: -112.0740 }); // Phoenix center

  const { data: facilities, isLoading } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (error) throw error;
      
      // Log data for debugging
      console.log('Fetched facilities:', data);
      return data as Facility[];
    }
  });

  const containerStyle = {
    width: '100%',
    height: '600px'
  };

  const defaultOptions = {
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey="AIzaSyCxAU5BCCcICK4HdmkLfEDSQB3EvBwQQbE">
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px] bg-slate-50 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-healthcare-600" />
          </div>
        ) : facilities && facilities.length > 0 ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            options={defaultOptions}
          >
            {facilities.map((facility) => (
              <MarkerF
                key={facility.id}
                position={{ 
                  lat: Number(facility.latitude), 
                  lng: Number(facility.longitude) 
                }}
                onClick={() => setSelectedFacility(facility)}
              />
            ))}

            {selectedFacility && (
              <InfoWindowF
                position={{ 
                  lat: Number(selectedFacility.latitude), 
                  lng: Number(selectedFacility.longitude) 
                }}
                onCloseClick={() => setSelectedFacility(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold mb-1">{selectedFacility.name}</h3>
                  <Badge className="mb-2">{selectedFacility.type}</Badge>
                  <p className="text-sm mb-2">{selectedFacility.address}</p>
                  <div className="flex gap-2">
                    {selectedFacility.phone && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`tel:${selectedFacility.phone}`)}
                      >
                        Call
                      </Button>
                    )}
                    {selectedFacility.website && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(selectedFacility.website, '_blank')}
                      >
                        Website
                      </Button>
                    )}
                  </div>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        ) : (
          <div className="flex flex-col items-center justify-center h-[600px] bg-slate-50 rounded-lg">
            <p className="text-lg text-muted-foreground mb-2">No facility data available</p>
            <p className="text-sm text-muted-foreground">Try searching for facilities first</p>
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default GoogleMapsView;
