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
import { 
  LocationSearchResult, 
  searchFacilities, 
  isSerpApiConfigured 
} from '@/lib/serpApiService';

declare global {
  interface Window {
    mapboxgl: typeof mapboxgl;
  }
}

// Original Facility interface for CSV data
interface Facility {
  "Facility Name": string;
  "Facility Type": string;
  "Latitude": string;
  "Longitude": string;
  "Address"?: string;
  "City"?: string;
  "State"?: string;
  "ZipCode"?: string;
  "Phone"?: string;
  "Website"?: string;
  [key: string]: string | undefined;
}

// Combined interface that can handle both data sources
interface UnifiedFacility {
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
  // Flag to indicate data source
  isFromSerpApi: boolean;
}

const FacilityMapbox = () => {
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  const mapboxAccessToken = 'pk.eyJ1IjoicGxhY2VtaW5kZXIiLCJhIjoiY2x1cTJreGxrMGlmOTJqcndyM2dvMmZicSJ9.4Y3n51DE-45lhB-anoiG0A';
  const facilitiesCSVUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0ho57cEDv7YMk7Y557SIGx6rCs8C4Z5tLPOvAlMD4Ho4aXMW6At3NdWj5ATKTOkNR_-CxGHyeewz6/pub?output=csv';
  const searchRadiusMiles = 20;
  const initialCoords = [-112.0740, 33.4484];
  const initialZoom = 9;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [allFacilities, setAllFacilities] = useState<UnifiedFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<UnifiedFacility[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<UnifiedFacility | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Pro users always use SerpAPI

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

  useEffect(() => {
    const loadFacilityData = async () => {
      setIsLoading(true);
      setStatus('Loading facility data...');
      
      try {
        const response = await fetch(facilitiesCSVUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        
        const validData = parsedData.filter(f => 
          f.Latitude && f.Longitude &&
          !isNaN(parseFloat(f.Latitude)) && !isNaN(parseFloat(f.Longitude))
        );
        
        // Convert to unified format
        const unifiedData: UnifiedFacility[] = validData.map(facility => ({
          name: facility['Facility Name'],
          type: facility['Facility Type'] || 'Unknown',
          latitude: parseFloat(facility.Latitude),
          longitude: parseFloat(facility.Longitude),
          address: facility['Address'],
          city: facility['City'],
          state: facility['State'],
          zipCode: facility['ZipCode'],
          phone: facility['Phone'],
          website: facility['Website'],
          isFromSerpApi: false
        }));
        
        const types = new Set<string>();
        unifiedData.forEach(f => {
          if (f.type && f.type.trim()) {
            types.add(f.type.trim());
          }
        });
        
        setAllFacilities(unifiedData);
        setFacilityTypes(Array.from(types).sort());
        setStatus('');
      } catch (error) {
        console.error('Error loading facility data:', error);
        setStatus('Error loading facilities.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFacilityData();
  }, []);

  const parseCSV = (text: string): Facility[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data: Facility[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      if (values.length === headers.length) {
        const entry: Record<string, string> = {};
        headers.forEach((header, index) => {
          entry[header] = values[index];
        });
        data.push(entry as Facility);
      } else {
        console.warn(`Skipping CSV line ${i + 1}: Header/value count mismatch`);
      }
    }
    
    return data;
  };

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
      let centerCoords: [number, number] | null = null;
      let facilities: UnifiedFacility[] = [];
      
      // Always use SerpAPI for all users
      const searchQuery = `senior care facilities near ${locationQuery}`;
      const results = await searchFacilities(searchQuery);
      
      if (results.length > 0) {
        // Use the first result's coordinates as center
        centerCoords = [results[0].longitude, results[0].latitude];
        
        // Convert SerpAPI results to unified format
        facilities = results.map(result => ({
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
          description: result.description,
          isFromSerpApi: true
        }));
      }
      
      // If SerpAPI failed, fall back to Mapbox geocoding with mock data
      if (!centerCoords) {
        centerCoords = await geocodeLocation(locationQuery);
        if (!centerCoords) {
          setStatus('Location not found. Please try a different search.');
          setFilteredFacilities([]);
          return;
        }
        
        // Filter existing facilities based on distance
        facilities = filterFacilitiesByDistance(allFacilities, centerCoords, selectedType);
      }
      
      if (mapRef.current && centerCoords) {
        mapRef.current.flyTo({ center: centerCoords, zoom: 11 });
      }
      
      setFilteredFacilities(facilities);
      addMarkersToMap(facilities, turf.point(centerCoords));
      setStatus('');
    } catch (error) {
      console.error('Search error:', error);
      setStatus('Error during search.');
    } finally {
      setIsLoading(false);
    }
  };

  const geocodeLocation = async (locationString: string): Promise<[number, number] | null> => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationString)}.json?access_token=${mapboxAccessToken}&limit=1&country=US`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center as [number, number];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  const filterFacilitiesByDistance = (
    facilities: UnifiedFacility[], 
    centerCoords: [number, number], 
    type: string
  ): UnifiedFacility[] => {
    if (!facilities.length || !centerCoords) return [];
    
    const centerPoint = turf.point(centerCoords);
    
    const filtered = facilities.filter(facility => {
      const facilityCoords: [number, number] = [
        facility.longitude, 
        facility.latitude
      ];
      
      if (isNaN(facilityCoords[0]) || isNaN(facilityCoords[1])) {
        return false;
      }
      
      const facilityPoint = turf.point(facilityCoords);
      const distance = turf.distance(centerPoint, facilityPoint, { units: 'miles' });
      
      const typeMatch = (type === 'all' || 
        (facility.type && facility.type.trim() === type));
      
      return typeMatch && distance <= searchRadiusMiles;
    });
    
    filtered.sort((a, b) => {
      const distA = turf.distance(
        centerPoint, 
        turf.point([a.longitude, a.latitude]), 
        { units: 'miles' }
      );
      const distB = turf.distance(
        centerPoint, 
        turf.point([b.longitude, b.latitude]), 
        { units: 'miles' }
      );
      return distA - distB;
    });
    
    return filtered;
  };

  const addMarkersToMap = (facilities: UnifiedFacility[], centerPoint: turf.Feature<turf.Point>) => {
    clearMarkers();
    
    facilities.forEach(facility => {
      const lon = facility.longitude;
      const lat = facility.latitude;
      
      if (isNaN(lon) || isNaN(lat) || !mapRef.current) return;
      
      const distance = turf.distance(
        centerPoint, 
        turf.point([lon, lat]), 
        { units: 'miles' }
      ).toFixed(1);
      
      // Use different colors for SerpAPI vs CSV data
      const markerColor = facility.isFromSerpApi ? "#4CAF50" : "#007bff";
      
      const marker = new mapboxgl.Marker({
        color: markerColor
      })
        .setLngLat([lon, lat])
        .addTo(mapRef.current);
      
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div>
          <h4 class="font-bold">${facility.name || 'N/A'}</h4>
          <p>${facility.type || 'N/A'}</p>
          <p>${distance} miles away</p>
          ${facility.rating ? `<p>Rating: ${facility.rating}/5 (${facility.reviews} reviews)</p>` : ''}
        </div>
      `;
      
      const button = document.createElement('button');
      button.textContent = 'View Details';
      button.className = 'px-2 py-1 mt-2 bg-blue-600 text-white rounded text-sm';
      button.onclick = () => {
        flyToFacility([lon, lat]);
        setSelectedFacility(facility);
      };
      popupContent.appendChild(button);
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setDOMContent(popupContent);
      
      marker.setPopup(popup);
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

  const handleFacilitySelect = (facility: UnifiedFacility) => {
    flyToFacility([facility.longitude, facility.latitude]);
    setSelectedFacility(facility);
  };

  // Pro users always use SerpAPI, no toggle needed

  return (
    <div className="w-full h-full">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-150px)] gap-4">
        <div className="w-full lg:w-1/4 flex flex-col gap-4 lg:overflow-y-auto p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold">Find Facilities</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <div className="flex gap-2">
                <Input 
                  id="location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, state or zip code"
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
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="all">All Types</option>
                {facilityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="py-2 px-3 bg-green-50 text-green-700 rounded text-sm">
              Using live data (SerpAPI) for search results
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
                      {facility.isFromSerpApi && (
                        <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
                          Live Data
                        </Badge>
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
                    <Button className="bg-healthcare-600">View Details</Button>
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

export default FacilityMapbox;