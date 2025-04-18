
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export type FilterType = 'assisted-living' | 'memory-care' | 'skilled-nursing' | 'independent-living' | 'all';
export type LocationArea = 'san-francisco' | 'oakland' | 'san-jose' | 'palo-alto' | 'los-angeles' | 'all';

export const useFacilityMap = (isPro: boolean) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeLocation, setActiveLocation] = useState<LocationArea>('all');

  const initializeMap = () => {
    if (!mapRef.current || !isPro) return;
    
    try {
      const mapOptions = {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
      };
      
      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      loadDefaultFacilities(map);
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      toast.error('Could not initialize the map. Please try again.');
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const loadDefaultFacilities = (map: google.maps.Map) => {
    if (!isPro) return;
    
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: { lat: 37.7749, lng: -122.4194 },
        radius: 10000,
        keyword: 'senior care',
        type: 'health'
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          clearMarkers();
          const newMarkers: google.maps.Marker[] = [];
          const bounds = new google.maps.LatLngBounds();
          
          results.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;
            
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
              animation: google.maps.Animation.DROP
            });
            
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div>
                  <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                  <div style="margin-bottom: 5px;">${place.vicinity || ''}</div>
                  <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span style="color: #FFC107; margin-right: 5px;">★</span>
                    <span>${place.rating || 'No rating'}</span>
                  </div>
                </div>
              `
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            bounds.extend(place.geometry.location);
            newMarkers.push(marker);
          });
          
          markersRef.current = newMarkers;
          
          if (newMarkers.length > 0) {
            map.fitBounds(bounds);
          }
        }
      }
    );
  };

  const applyMapFilters = (filterType: FilterType, location: LocationArea) => {
    if (!mapIsLoaded || !mapInstanceRef.current) {
      console.warn('Google Maps not initialized');
      return;
    }
    
    let searchKeyword = 'senior care';
    let locationQuery = '';
    
    switch(filterType) {
      case 'assisted-living':
        searchKeyword = 'assisted living senior care';
        break;
      case 'memory-care':
        searchKeyword = 'memory care senior facility';
        break;
      case 'skilled-nursing':
        searchKeyword = 'skilled nursing facility';
        break;
      case 'independent-living':
        searchKeyword = 'independent living senior';
        break;
    }
    
    switch(location) {
      case 'san-francisco':
        locationQuery = 'San Francisco, CA';
        break;
      case 'oakland':
        locationQuery = 'Oakland, CA';
        break;
      case 'san-jose':
        locationQuery = 'San Jose, CA';
        break;
      case 'palo-alto':
        locationQuery = 'Palo Alto, CA';
        break;
      case 'los-angeles':
        locationQuery = 'Los Angeles, CA';
        break;
    }
    
    setActiveFilter(filterType);
    setActiveLocation(location);
    performMapSearch(searchKeyword, locationQuery);
  };

  const performMapSearch = (keyword: string, location: string) => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    clearMarkers();
    
    if (location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const locationCoords = results[0].geometry.location;
          map.setCenter(locationCoords);
          
          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch(
            {
              location: locationCoords,
              radius: 10000,
              keyword: keyword,
              type: 'health'
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const newMarkers: google.maps.Marker[] = [];
                const bounds = new google.maps.LatLngBounds();
                
                results.forEach(place => {
                  if (!place.geometry || !place.geometry.location) return;
                  
                  const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map,
                    title: place.name,
                    animation: google.maps.Animation.DROP
                  });
                  
                  const infoWindow = new google.maps.InfoWindow({
                    content: `
                      <div>
                        <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                        <div style="margin-bottom: 5px;">${place.vicinity || ''}</div>
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                          <span style="color: #FFC107; margin-right: 5px;">★</span>
                          <span>${place.rating || 'No rating'}</span>
                        </div>
                      </div>
                    `
                  });
                  
                  marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                  });
                  
                  bounds.extend(place.geometry.location);
                  newMarkers.push(marker);
                });
                
                markersRef.current = newMarkers;
                
                if (newMarkers.length > 0) {
                  map.fitBounds(bounds);
                }
              }
            }
          );
        }
      });
    }
  };

  return {
    mapRef,
    mapIsLoaded,
    setMapIsLoaded,
    activeFilter,
    activeLocation,
    initializeMap,
    applyMapFilters
  };
};
