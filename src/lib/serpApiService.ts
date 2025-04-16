import { getJson } from 'serpapi';
import { toast } from 'sonner';

// SerpAPI key from environment variables
const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY || '838Ua1jg4Hf8dWHFMy4GryT4';

// Base URL for SerpAPI
const SERPAPI_BASE_URL = 'https://serpapi.com';

// Interface for location search results
export interface LocationSearchResult {
  name: string;
  address: string;
  rating?: number;
  reviews?: number;
  type: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  hours?: string[];
  description?: string;
}

/**
 * Search for facilities near a location using SerpAPI
 * @param query Search query (e.g., "senior living near Phoenix, AZ")
 * @param limit Maximum number of results to return
 * @returns Promise with location search results
 */
export const searchFacilities = async (
  query: string,
  limit: number = 20
): Promise<LocationSearchResult[]> => {
  if (!SERPAPI_KEY) {
    toast.error('SerpAPI key is not configured');
    console.error('SerpAPI key is missing. Please set VITE_SERPAPI_KEY in your environment variables.');
    return [];
  }

  try {
    const params = {
      engine: 'google_maps',
      q: query,
      ll: '@33.4484,-112.0740,14z', // Default to Phoenix, AZ if no specific location
      type: 'search',
      api_key: SERPAPI_KEY
    };

    const response = await getJson(params);
    const localResults = response.local_results || [];
    
    // Map SerpAPI results to our interface
    const mappedResults: LocationSearchResult[] = localResults
      .slice(0, limit)
      .map((result: any) => ({
        name: result.title || 'Unknown',
        address: result.address || 'No address available',
        rating: result.rating,
        reviews: result.reviews,
        type: result.type || 'Facility',
        phone: result.phone,
        website: result.website,
        latitude: result.gps_coordinates?.latitude,
        longitude: result.gps_coordinates?.longitude,
        imageUrl: result.thumbnail,
        hours: result.hours,
        description: result.description
      }))
      .filter((result: LocationSearchResult) => 
        result.latitude && result.longitude
      );

    return mappedResults;
  } catch (error) {
    console.error('Error searching facilities with SerpAPI:', error);
    toast.error('Failed to search facilities. Please try again later.');
    return [];
  }
};

/**
 * Get facility details using SerpAPI
 * @param placeId Google Maps place ID
 * @returns Promise with detailed location information
 */
export const getFacilityDetails = async (
  placeId: string
): Promise<LocationSearchResult | null> => {
  if (!SERPAPI_KEY) {
    toast.error('SerpAPI key is not configured');
    console.error('SerpAPI key is missing. Please set VITE_SERPAPI_KEY in your environment variables.');
    return null;
  }

  try {
    const params = {
      engine: 'google_maps',
      place_id: placeId,
      api_key: SERPAPI_KEY
    };

    const response = await getJson(params);
    
    if (!response.place_results) {
      return null;
    }

    const result = response.place_results;
    
    return {
      name: result.title || 'Unknown',
      address: result.address || 'No address available',
      rating: result.rating,
      reviews: result.reviews,
      type: result.type || 'Facility',
      phone: result.phone,
      website: result.website,
      latitude: result.gps_coordinates?.latitude,
      longitude: result.gps_coordinates?.longitude,
      imageUrl: result.thumbnail,
      hours: result.hours,
      description: result.description
    };
  } catch (error) {
    console.error('Error getting facility details with SerpAPI:', error);
    toast.error('Failed to get facility details. Please try again later.');
    return null;
  }
};

/**
 * Check if SerpAPI is configured
 * @returns Boolean indicating if SerpAPI key is available
 */
export const isSerpApiConfigured = (): boolean => {
  return !!SERPAPI_KEY;
};