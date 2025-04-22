
import { supabase } from "@/lib/supabase";

export interface SearchResultData {
  query: string;
  location?: string;
  facility_type?: string;
  amenities?: string[];
  results: any[];
  user_id?: string;
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
        results: JSON.stringify(searchData.results || []), // Ensure results is never null
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting search result:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving search results:', error);
    return null;
  }
};

// Function to get search results for a specific user
export const getSearchResults = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('search_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};
