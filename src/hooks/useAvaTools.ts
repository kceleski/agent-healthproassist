
import { useNavigate } from 'react-router-dom';

interface SearchFilters {
  location?: string;
  facilityType?: string;
  amenities?: string[];
}

const SERP_API_KEY = "838Ua1jg4Hf8dWHFMy4GryT4";

export const useAvaTools = (
  onFiltersUpdate: (filters: SearchFilters) => void,
  handleSearch: () => void
) => {
  const navigate = useNavigate();

  const clientTools = {
    updateSearchFilters: (parameters: SearchFilters) => {
      console.log('Updating search filters:', parameters);
      onFiltersUpdate(parameters);
      return "Search filters updated successfully";
    },

    performWebSearch: async (query: string) => {
      console.log('Performing web search for:', query);
      try {
        // Using searchapi.io for web search
        const apiUrl = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Search API request failed');
        }
        
        const data = await response.json();
        console.log('Web search results:', data);
        
        // Return the organic search results
        return {
          success: true,
          results: data.organic_results || [],
          message: `Found ${data.organic_results?.length || 0} results`
        };
      } catch (error) {
        console.error('Web search error:', error);
        return {
          success: false,
          results: [],
          message: 'Failed to perform web search'
        };
      }
    },

    performSearch: () => {
      console.log('Performing facility search with current filters');
      handleSearch();
      return "Facility search initiated";
    },

    navigateToMap: () => {
      console.log('Navigating to map view');
      navigate('/map');
      return "Navigated to map view";
    }
  };

  return clientTools;
};
