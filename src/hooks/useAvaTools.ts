
import { useNavigate } from 'react-router-dom';

interface SearchFilters {
  location?: string;
  facilityType?: string;
  amenities?: string[];
}

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

    performSearch: () => {
      console.log('Performing search with current filters');
      handleSearch();
      return "Search initiated";
    },

    navigateToMap: () => {
      console.log('Navigating to map view');
      navigate('/map');
      return "Navigated to map view";
    }
  };

  return clientTools;
};
