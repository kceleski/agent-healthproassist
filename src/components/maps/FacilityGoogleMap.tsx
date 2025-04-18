
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface FacilityGoogleMapProps {
  location: string;
  selectedCareType: string;
  selectedAmenities: string[];
}

const GOOGLE_MAPS_API_KEY = "AIzaSyADFSlLS5ofwKFSwjQKE1LSAzO3kECr4Ho";
const GOOGLE_PLACES_API_KEY = "AIzaSyCxAU5BCCcICK4HdmkLfEDSQB3EvBwQQbE";

const FacilityGoogleMap: React.FC<FacilityGoogleMapProps> = ({
  location,
  selectedCareType,
  selectedAmenities,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10000); // 10km default radius
  const [mapCenter, setMapCenter] = useState<google.maps.LatLng | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      setIsLoaded(true);
    };
    
    document.head.appendChild(script);
    
    return () => {
      window.initMap = undefined;
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map and search
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Create map instance
    const mapOptions: google.maps.MapOptions = {
      zoom: 12,
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Perform search if we have a location
    if (location) {
      searchFacilities(newMap, location);
    }
  }, [isLoaded]);

  // Update search when parameters change
  useEffect(() => {
    if (!map || !isLoaded) return;
    if (location) {
      searchFacilities(map, location);
    }
  }, [location, selectedCareType, selectedAmenities, isLoaded]);

  // Search for facilities based on criteria
  const searchFacilities = (mapInstance: google.maps.Map, searchLocation: string) => {
    // Clear existing markers
    clearMarkers();
    
    // Geocode the location to get coordinates
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status !== "OK" || !results || results.length === 0) {
        console.error("Geocoding failed:", status);
        return;
      }
      
      const location = results[0].geometry.location;
      mapInstance.setCenter(location);
      setMapCenter(location);
      
      // Construct search query for Places API
      let searchQuery = "senior care";
      
      if (selectedCareType && selectedCareType !== "any") {
        searchQuery += " " + selectedCareType;
      }
      
      // Create Places service
      const service = new google.maps.places.PlacesService(mapInstance);
      
      // Search for places
      service.nearbySearch(
        {
          location: location,
          radius: searchRadius,
          keyword: searchQuery,
          type: "health"
        },
        (results, status, pagination) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // Filter results by amenities if needed
            let filteredResults = results;
            if (selectedAmenities.length > 0) {
              // We'll need to get details for each place to check amenities
              // This is simplified as full implementation would require multiple detail requests
              filteredResults = results.slice(0, 10); // Limit to avoid too many API calls
            }
            
            // Create markers for each place
            createMarkers(filteredResults, mapInstance);
          } else {
            console.error("Places search failed:", status);
          }
        }
      );
    });
  };

  // Create markers on the map
  const createMarkers = (places: google.maps.places.PlaceResult[], mapInstance: google.maps.Map) => {
    const newMarkers: google.maps.Marker[] = [];
    const bounds = new google.maps.LatLngBounds();
    
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) return;
      
      // Create marker
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: mapInstance,
        title: place.name,
        animation: google.maps.Animation.DROP
      });
      
      // Create info window with place details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
            <div style="margin-bottom: 5px;">${place.vicinity || ''}</div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span style="color: #FFC107; margin-right: 5px;">★</span>
              <span>${place.rating || 'No rating'}</span>
            </div>
            ${place.photos && place.photos.length > 0 
              ? `<img src="${place.photos[0].getUrl({maxWidth: 200, maxHeight: 150})}" style="width: 100%; max-width: 200px; margin-top: 5px;" alt="${place.name}"/>`
              : ''}
          </div>
        `
      });
      
      // Add click listener to open info window
      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
      
      // Extend bounds to include this marker
      bounds.extend(place.geometry.location);
      newMarkers.push(marker);
    });
    
    // If we have markers, adjust map to show all
    if (newMarkers.length > 0) {
      mapInstance.fitBounds(bounds);
      
      // If we only have one result, zoom out a bit
      if (newMarkers.length === 1) {
        mapInstance.setZoom(14);
      }
    }
    
    setMarkers(newMarkers);
  };

  // Clear all markers from the map
  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  // Expand search radius
  const expandSearchRadius = () => {
    const newRadius = searchRadius * 2;
    setSearchRadius(newRadius);
    
    if (map && mapCenter) {
      const service = new google.maps.places.PlacesService(map);
      clearMarkers();
      
      let searchQuery = "senior care";
      if (selectedCareType && selectedCareType !== "any") {
        searchQuery += " " + selectedCareType;
      }
      
      service.nearbySearch(
        {
          location: mapCenter,
          radius: newRadius,
          keyword: searchQuery,
          type: "health"
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            createMarkers(results, map);
          }
        }
      );
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border shadow">
      {!isLoaded && (
        <div className="flex items-center justify-center h-[600px] bg-slate-100">
          <div className="animate-spin h-12 w-12 border-4 border-healthcare-600 rounded-full border-t-transparent"></div>
        </div>
      )}
      
      <div ref={mapRef} className="h-[600px] w-full"></div>
      
      {markers.length === 0 && isLoaded && (
        <div className="p-4 bg-white border-t">
          <p className="text-muted-foreground text-sm mb-2">No facilities found matching your criteria.</p>
          <Button onClick={expandSearchRadius} variant="outline" size="sm" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Expand Search Area
          </Button>
        </div>
      )}
    </div>
  );
};

export default FacilityGoogleMap;
