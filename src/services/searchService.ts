
import { supabase } from "@/integrations/supabase/client";

export interface SearchResultData {
  query: string;
  location?: string;
  facility_type?: string;
  amenities?: string[];
  results: any[];
}

// Function to save search result to Supabase
export const saveSearchResult = async (searchData: SearchResultData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user. Search results not saved.');
      return null;
    }

    const { data, error } = await supabase
      .from('search_results')
      .insert({
        query: searchData.query,
        location: searchData.location,
        facility_type: searchData.facility_type,
        amenities: searchData.amenities,
        results: JSON.stringify(searchData.results),
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving search results:', error);
    return null;
  }
};
