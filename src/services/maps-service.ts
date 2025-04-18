/**
 * Maps and location services
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const SEARCH_API_KEY = import.meta.env.VITE_SEARCH_API_KEY;

export interface LocationSearchResult {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  types?: string[];
  photos?: string[];
  website?: string;
  phone?: string;
  [key: string]: any;
}

/**
 * Searches for facilities using the SearchAPI.io service
 * @param query The search query
 * @returns Array of search results
 */
export const searchFacilities = async (query: string): Promise<LocationSearchResult[]> => {
  try {
    const apiUrl = `https://www.searchapi.io/api/v1/search?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${SEARCH_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Search API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the API response to our format
    return data.places.map((place: any) => ({
      id: place.data_id || place.place_id || `place-${Math.random().toString(36).substring(2, 9)}`,
      name: place.title || '',
      address: place.address || '',
      location: {
        lat: place.gps_coordinates?.latitude || 0,
        lng: place.gps_coordinates?.longitude || 0
      },
      rating: place.rating || 0,
      types: place.categories || [],
      photos: place.photos?.map((photo: any) => photo.image?.url || '') || [],
      website: place.website || '',
      phone: place.phone || ''
    }));
  } catch (error) {
    console.error('Error searching facilities:', error);
    return [];
  }
};

/**
 * Loads the Google Maps script
 * @param callback Function to call when the script is loaded
 */
export const loadGoogleMapsScript = (callback: () => void): void => {
  if (window.google?.maps) {
    callback();
    return;
  }
  
  // Define the callback function globally
  window.initMap = callback;
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
  script.async = true;
  script.defer = true;
  
  document.head.appendChild(script);
};

/**
 * Gets the distance between two coordinates in kilometers
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export const getDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

/**
 * Converts degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};