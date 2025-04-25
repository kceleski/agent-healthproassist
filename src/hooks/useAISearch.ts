
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AISearchFilters {
  facilityType?: string[];
  location?: string;
  amenities?: string[];
}

export const useAISearch = (onFiltersUpdate: (filters: AISearchFilters) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: message }
      });

      if (error) throw error;

      if (data) {
        console.log('AI search results:', data);
        onFiltersUpdate({
          facilityType: data.facilityType,
          location: data.location,
          amenities: data.amenities
        });

        toast.success('Search criteria updated based on your request');
      }
    } catch (error) {
      console.error('AI search error:', error);
      toast.error('Failed to process your search request');
    } finally {
      setIsLoading(false);
    }
  }, [onFiltersUpdate]);

  return {
    sendMessage,
    isLoading
  };
};
