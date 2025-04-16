import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, X, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { LocationSearchResult, searchFacilities } from '@/lib/serpApiService';

declare global {
  interface Window {
    mapboxgl: typeof mapboxgl;
  }
}

// Facility interface for our unified data format
interface Facility {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  hours?: string[];
  description?: string;
}

const FacilityMapboxPro = () => {
  const { user } = useAuth();
  
  const mapboxAccessToken = 'pk.eyJ1IjoicGxhY2VtaW5kZXIiLCJhIjoiY2x1cTJreGxrMGlmOTJqcndyM2dvMmZicSJ9.4Y3n51DE-45lhB-anoiG0A';
  const searchRadiusMiles = 20;
  const initialCoords = [-112.0740, 33.4484]; // Phoenix, AZ
  const initialZoom = 9;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    mapboxgl.accessToken = mapboxAccessToken;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: initialCoords,
      zoom: initialZoom,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });
    
    mapRef.current = map;
    
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }));
    
    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      
      map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    });
    
    // Add globe spinning effect
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;
    
    function spinGlobe() {
      if (!mapRef.current) return;
      
      const zoom = mapRef.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = mapRef.current.getCenter();
        center.lng -= distancePerSecond;
        mapRef.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }
    
    map.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.on('moveend', () => {
      spinGlobe();
    });
    
    spinGlobe();
    
    return () => {
      map.remove();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationQuery.trim()) {
      setStatus('Please enter a location.');
      return;
    }
    
    setIsLoading(true);
    setStatus('Searching for facilities...');
    clearMarkers();
    setSelectedFacility(null);
    
    try {
      // Use SerpAPI to search for facilities with user input
      // Allow users to specify what they're looking for
      const searchQuery = locationQuery.includes('near') ? 
        locationQuery : 
        `senior care facilities near ${locationQuery}`;
      
      const results = await searchFacilities(searchQuery);
      
      if (results.length === 0) {
        setStatus('No facilities found. Please try a different search.');
        setAllFacilities([]);
        setFilteredFacilities([]);
        return;
      }
      
      // Extract facility types for filtering
      const types = new Set<string>();
      results.forEach(result => {
        if (result.type) {
          types.add(result.type);
        }
      });
      setFacilityTypes(Array.from(types).sort());
      
      // Convert SerpAPI results to our facility format
      const mappedFacilities = results.map(result => ({
        name: result.name,
        type: result.type,
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.address,
        phone: result.phone,
        website: result.website,
        rating: result.rating,
        reviews: result.reviews,
        imageUrl: result.imageUrl,
        hours: result.hours,
        description: result.description
      }));
      
      // Store all facilities
      setAllFacilities(mappedFacilities);
      
      // Filter by type if needed
      const filteredResults = selectedType === 'all' 
        ? mappedFacilities 
        : mappedFacilities.filter(f => f.type === selectedType);
      
      setFilteredFacilities(filteredResults);
      
      // Center map on first result
      const centerCoords: [number, number] = [results[0].longitude, results[0].latitude];
      if (mapRef.current) {
        mapRef.current.flyTo({ center: centerCoords, zoom: 11 });
      }
      
      // Add markers to map
      addMarkersToMap(filteredResults);
      setStatus('');
    } catch (error) {
      console.error('Search error:', error);
      setStatus('Error during search. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const addMarkersToMap = (facilities: Facility[]) => {
    clearMarkers();
    
    facilities.forEach(facility => {
      const lon = facility.longitude;
      const lat = facility.latitude;
      
      if (isNaN(lon) || isNaN(lat) || !mapRef.current) return;
      
      // Create a custom element for the marker
      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      el.style.width = '25px';
      el.style.height = '35px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.backgroundSize = 'cover';
      
      // Add a click event directly to the marker element
      el.addEventListener('click', () => {
        flyToFacility([lon, lat]);
        setSelectedFacility(facility);
      });
      
      const marker = new mapboxgl.Marker({
        element: el,
        color: "#4CAF50"
      })
        .setLngLat([lon, lat])
        .addTo(mapRef.current);
      
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div>
          <h4 class="font-bold">${facility.name || 'N/A'}</h4>
          <p>${facility.type || 'N/A'}</p>
          ${facility.rating ? `<p>Rating: ${facility.rating}/5 (${facility.reviews} reviews)</p>` : ''}
        </div>
      `;
      
      const button = document.createElement('button');
      button.textContent = 'View Details';
      button.className = 'px-2 py-1 mt-2 bg-blue-600 text-white rounded text-sm cursor-pointer';
      
      // Use a proper event listener instead of onclick
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        flyToFacility([lon, lat]);
        setSelectedFacility(facility);
      });
      
      popupContent.appendChild(button);
      
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      })
        .setDOMContent(popupContent);
      
      // Add popup to marker
      marker.setPopup(popup);
      
      // Add click handler to marker
      marker.getElement().addEventListener('click', () => {
        flyToFacility([lon, lat]);
        setSelectedFacility(facility);
      });
      
      markersRef.current.push(marker);
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const flyToFacility = (coords: [number, number]) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: coords,
        zoom: 14,
        essential: true
      });
    }
  };

  const handleFacilitySelect = (facility: Facility) => {
    flyToFacility([facility.longitude, facility.latitude]);
    setSelectedFacility(facility);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);
    
    // Filter facilities by type
    if (allFacilities.length > 0) {
      const filtered = type === 'all' 
        ? allFacilities 
        : allFacilities.filter(f => f.type === type);
      
      // Update the filtered facilities list
      setFilteredFacilities(filtered);
      
      // Clear existing markers and add new ones
      clearMarkers();
      addMarkersToMap(filtered);
      
      // Reset selected facility if it doesn't match the filter
      if (selectedFacility && type !== 'all' && selectedFacility.type !== type) {
        setSelectedFacility(null);
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-150px)] gap-4">
        <div className="w-full lg:w-1/4 flex flex-col gap-4 lg:overflow-y-auto p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold">Find Facilities</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Search Query</label>
              <div className="flex gap-2">
                <Input 
                  id="location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="E.g., 'nursing homes near Phoenix' or 'Chicago'"
                  className="flex-grow"
                />
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-healthcare-600"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="facility-type" className="text-sm font-medium">Facility Type</label>
              <select
                id="facility-type"
                value={selectedType}
                onChange={handleTypeChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="all">All Types</option>
                {facilityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="py-2 px-3 bg-green-50 text-green-700 rounded text-sm">
              Using live data from SerpAPI
            </div>
          </form>
          
          {status && (
            <div className="py-2 px-3 bg-blue-50 text-blue-700 rounded">
              {status}
            </div>
          )}
          
          <div className="flex-grow overflow-y-auto">
            <h3 className="text-lg font-medium mb-2">
              {filteredFacilities.length > 0 
                ? `${filteredFacilities.length} facilities found`
                : 'Enter a location to search'}
            </h3>
            
            <ul className="space-y-2">
              {filteredFacilities.length === 0 ? (
                <li className="p-3 bg-gray-50 rounded text-gray-500">
                  {isLoading 
                    ? 'Searching...' 
                    : locationQuery 
                      ? 'No facilities found in this area.' 
                      : 'Enter a location and search.'}
                </li>
              ) : (
                filteredFacilities.map((facility, index) => {
                  return (
                    <li 
                      key={index}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        selectedFacility && selectedFacility.name === facility.name
                          ? 'bg-healthcare-50 border border-healthcare-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleFacilitySelect(facility)}
                    >
                      <div className="font-medium">{facility.name}</div>
                      <div className="text-sm text-gray-600">{facility.type}</div>
                      {facility.address && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {facility.address}
                        </div>
                      )}
                      {facility.rating && (
                        <div className="text-sm text-gray-600 mt-1">
                          Rating: {facility.rating}/5 ({facility.reviews} reviews)
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          
          <div className="mt-auto pt-2 border-t">
            <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700">
              Powered by SerpAPI
            </Badge>
          </div>
        </div>
        
        <div className="flex-grow relative">
          <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden" />
          
          {selectedFacility && (
            <Card className="absolute right-4 top-4 w-80 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{selectedFacility.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedFacility(null)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedFacility.imageUrl && (
                    <div className="w-full h-32 rounded overflow-hidden">
                      <img 
                        src={selectedFacility.imageUrl} 
                        alt={selectedFacility.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm">{selectedFacility.type || 'N/A'}</p>
                  </div>
                  
                  {selectedFacility.address && (
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm">
                        {selectedFacility.address}
                        {selectedFacility.city && selectedFacility.state && (
                          <>, {selectedFacility.city}, {selectedFacility.state} {selectedFacility.zipCode || ''}</>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {selectedFacility.phone && (
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{selectedFacility.phone}</p>
                    </div>
                  )}
                  
                  {selectedFacility.website && (
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a 
                        href={selectedFacility.website.startsWith('http') ? selectedFacility.website : `https://${selectedFacility.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-healthcare-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {selectedFacility.rating && (
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-sm">{selectedFacility.rating}/5 ({selectedFacility.reviews} reviews)</p>
                    </div>
                  )}
                  
                  {selectedFacility.description && (
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm">{selectedFacility.description}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      className="bg-healthcare-600"
                      onClick={() => {
                        // Open website in new tab if available
                        if (selectedFacility.website) {
                          const url = selectedFacility.website.startsWith('http') 
                            ? selectedFacility.website 
                            : `https://${selectedFacility.website}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        } else {
                          // If no website, try to open Google Maps
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${selectedFacility.name} ${selectedFacility.address || ''}`
                          )}`;
                          window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      {selectedFacility.website ? 'Visit Website' : 'View on Maps'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityMapboxPro;