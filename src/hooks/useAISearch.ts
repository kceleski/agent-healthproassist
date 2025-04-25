
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AISearchFilters {
  facilityType?: string[];
  location?: string;
  amenities?: string[];
}

interface ConversationData {
  recommendations?: string[];
  preferences?: Record<string, string>;
  notes?: string[];
}

interface AISearchResponse {
  facilityType?: string[];
  location?: string;
  amenities?: string[];
  conversationData?: ConversationData;
}

export const useAISearch = (onFiltersUpdate: (filters: AISearchFilters) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string): Promise<AISearchResponse | undefined> => {
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
        return data;
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
