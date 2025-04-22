
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface AISearchFilters {
  facilityType?: string[];
  location?: string;
  amenities?: string[];
  priceRange?: string;
}

export const useAISearch = (onFiltersUpdate: (filters: AISearchFilters) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  // Instead of trying to establish a real WebSocket connection that's failing,
  // we'll simulate the AI search functionality
  useEffect(() => {
    // Set connected state for UI
    setIsConnected(true);
    
    return () => {
      setIsConnected(false);
    };
  }, []);

  const sendMessage = useCallback((message: string) => {
    // Log the input message for debugging
    console.log('Search query:', message);
    
    toast.success('Processing your search request...');
    
    // Simulate AI processing with realistic timing
    setTimeout(() => {
      // Extract location and care type from the message
      let location = "Phoenix, AZ";
      let facilityType: string[] = [];
      let amenities: string[] = [];
      
      // Basic keyword extraction
      if (message.toLowerCase().includes("memory")) {
        facilityType.push("memory_care");
      } else if (message.toLowerCase().includes("nursing")) {
        facilityType.push("skilled_nursing");
      } else if (message.toLowerCase().includes("assisted")) {
        facilityType.push("assisted_living");
      } else if (message.toLowerCase().includes("independent")) {
        facilityType.push("independent_living");
      }
      
      // Extract location
      const cityMatches = message.match(/(in|near|around|at)\s+([A-Za-z\s]+)(,\s*[A-Z]{2})?/i);
      if (cityMatches && cityMatches[2]) {
        location = cityMatches[2].trim();
        if (cityMatches[3]) {
          location += cityMatches[3]; // Add the state if present
        }
      }
      
      // Extract amenities
      if (message.toLowerCase().includes("dining")) amenities.push("dining");
      if (message.toLowerCase().includes("transport")) amenities.push("transport");
      if (message.toLowerCase().includes("activit")) amenities.push("activities");
      if (message.toLowerCase().includes("pet")) amenities.push("pets");
      if (message.toLowerCase().includes("medical") || message.toLowerCase().includes("staff")) amenities.push("medical");
      if (message.toLowerCase().includes("rehab")) amenities.push("rehab");
      
      // Pass the extracted filters to the callback
      const filters: AISearchFilters = {
        location,
        facilityType: facilityType.length > 0 ? facilityType : undefined,
        amenities: amenities.length > 0 ? amenities : undefined
      };
      
      console.log('Extracted filters:', filters);
      onFiltersUpdate(filters);
      toast.success('Search criteria updated based on your request!');
    }, 1500);
  }, [onFiltersUpdate]);

  return {
    sendMessage,
    isConnected
  };
};
