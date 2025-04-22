
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
    // Try to get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if there's an authenticated user
    const userId = user?.id;
    if (!userId) {
      console.warn('No authenticated user. Search results will not be saved to user history.');
    }

    const { data, error } = await supabase
      .from('search_results')
      .insert({
        query: searchData.query,
        location: searchData.location,
        facility_type: searchData.facility_type,
        amenities: searchData.amenities,
        results: JSON.stringify(searchData.results || []), // Ensure results is never null
        user_id: userId // Will be null for non-authenticated users
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
