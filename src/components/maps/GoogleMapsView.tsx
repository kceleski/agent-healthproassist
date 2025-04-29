
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Navigation, Phone, Globe, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

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

interface GoogleMapsViewProps {
  hasSearched?: boolean;
}

const GoogleMapsView = ({ hasSearched = false }: GoogleMapsViewProps) => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.4484, lng: -112.0740 }); // Phoenix center
  const [conversationData, setConversationData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const isMobile = useIsMobile();

  const { data: facilities, isLoading } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      // Only fetch if a search has been performed
      if (!hasSearched) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (error) throw error;
      
      // Log data for debugging
      console.log('Fetched facilities:', data?.length || 0);
      return data as Facility[];
    },
    enabled: hasSearched // Only run this query if a search has been performed
  });

  useEffect(() => {
    // Retrieve conversation data from sessionStorage
    const storedData = sessionStorage.getItem('searchConversationData');
    if (storedData) {
      setConversationData(JSON.parse(storedData));
    }

    // Only try to get user location if a search has been performed
    if (hasSearched && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('User location set', position.coords);
        },
        (error) => {
          console.log('Error getting location:', error);
          // Keep default Phoenix center if location not available
        }
      );
    }
  }, [hasSearched]);

  // Effect to update map center when a facility is selected
  useEffect(() => {
    if (selectedFacility) {
      setMapCenter({
        lat: Number(selectedFacility.latitude),
        lng: Number(selectedFacility.longitude)
      });
    }
  }, [selectedFacility]);

  const containerStyle = {
    width: '100%',
    height: isMobile ? '400px' : '600px'
  };

  const handleGetDirections = (facility: Facility) => {
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(facility.address)}`;
    window.open(mapUrl, '_blank');
    toast.success(`Opening directions to ${facility.name}`);
  };

  const handleMarkerClick = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const handleCallFacility = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
    toast.success('Initiating call...');
  };

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank');
    toast.success('Opening website...');
  };

  // If we haven't performed a search yet, show a placeholder
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] md:h-[600px] bg-slate-50 rounded-lg">
        <Search className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
        <h3 className="text-xl font-medium text-center mb-2">No Search Performed</h3>
        <p className="text-center text-muted-foreground max-w-md px-4">
          Please use the search function to find facilities. The map will display results after a search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-full">
        <LoadScript googleMapsApiKey="AIzaSyADFSlLS5ofwKFSwjQKE1LSAzO3kECr4Ho">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px] md:h-[600px] bg-slate-50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-healthcare-600" />
            </div>
          ) : facilities && facilities.length > 0 ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              options={{
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
              }}
            >
              {userLocation && (
                <MarkerF
                  position={userLocation}
                  icon={{
                    url: '/placeholder.svg',
                    scaledSize: new window.google.maps.Size(30, 30)
                  }}
                  title="Your Location"
                />
              )}
              
              {facilities.map((facility) => (
                <MarkerF
                  key={facility.id}
                  position={{ 
                    lat: Number(facility.latitude), 
                    lng: Number(facility.longitude) 
                  }}
                  onClick={() => handleMarkerClick(facility)}
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
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.phone && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCallFacility(selectedFacility.phone as string)}
                          className="flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                      )}
                      {selectedFacility.website && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVisitWebsite(selectedFacility.website as string)}
                          className="flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          Website
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGetDirections(selectedFacility)}
                        className="flex items-center gap-1"
                      >
                        <Navigation className="h-3 w-3" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] md:h-[600px] bg-slate-50 rounded-lg">
              <MapPin className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No facility data available</p>
              <p className="text-sm text-muted-foreground">Try searching for facilities first</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/search'}
              >
                Go to Search
              </Button>
            </div>
          )}
        </LoadScript>
      </div>

      {conversationData && (
        <Card className="mt-4 bg-white shadow-lg">
          <CardContent className="pt-6">
            {conversationData.recommendations && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">AI Recommendations</h4>
                <ul className="list-disc pl-4">
                  {conversationData.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            {conversationData.preferences && (
              <div>
                <h4 className="font-medium mb-2">Search Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(conversationData.preferences).map(([key, value]: [string, any]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleMapsView;
