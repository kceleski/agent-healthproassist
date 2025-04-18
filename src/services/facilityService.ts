
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FacilityData {
  place_id?: string;
  name: string;
  facility_type?: string[];
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  price_range?: string;
  amenities?: string[];
  description?: string;
}

// Save facility to database
export async function saveFacility(facilityData: FacilityData) {
  try {
    // Check if facility with place_id already exists
    if (facilityData.place_id) {
      const { data: existingFacility } = await supabase
        .from('facilities')
        .select('id')
        .eq('place_id', facilityData.place_id)
        .single();
      
      if (existingFacility) {
        // Update existing facility
        const { error } = await supabase
          .from('facilities')
          .update({
            ...facilityData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingFacility.id);
        
        if (error) throw error;
        
        return existingFacility.id;
      }
    }
    
    // Create new facility
    const { data, error } = await supabase
      .from('facilities')
      .insert({
        ...facilityData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    return data[0].id;
  } catch (error) {
    console.error('Error saving facility:', error);
    toast.error('Failed to save facility data');
    return null;
  }
}

// Get facility by ID
export async function getFacility(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', facilityId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching facility:', error);
    return null;
  }
}

// Save a facility to user's favorites
export async function saveFacilityToFavorites(userId: string, facilityId: string, notes?: string) {
  try {
    const { error } = await supabase
      .from('saved_facilities')
      .insert({
        user_id: userId,
        facility_id: facilityId,
        notes,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    toast.success('Facility saved to favorites');
    return true;
  } catch (error) {
    console.error('Error saving to favorites:', error);
    toast.error('Failed to save facility to favorites');
    return false;
  }
}

// Get user's saved facilities
export async function getSavedFacilities(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_facilities')
      .select(`
        id,
        notes,
        created_at,
        facilities (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching saved facilities:', error);
    return [];
  }
}

// Remove facility from favorites
export async function removeFacilityFromFavorites(userId: string, facilityId: string) {
  try {
    const { error } = await supabase
      .from('saved_facilities')
      .delete()
      .eq('user_id', userId)
      .eq('facility_id', facilityId);
    
    if (error) throw error;
    
    toast.success('Facility removed from favorites');
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    toast.error('Failed to remove facility from favorites');
    return false;
  }
}

// Search facilities by criteria
export async function searchFacilities(criteria: {
  query?: string,
  city?: string,
  state?: string,
  facilityType?: string[],
  amenities?: string[]
}) {
  try {
    let query = supabase
      .from('facilities')
      .select('*');
    
    if (criteria.query) {
      query = query.ilike('name', `%${criteria.query}%`);
    }
    
    if (criteria.city) {
      query = query.ilike('city', `%${criteria.city}%`);
    }
    
    if (criteria.state) {
      query = query.ilike('state', `%${criteria.state}%`);
    }
    
    if (criteria.facilityType && criteria.facilityType.length > 0) {
      query = query.contains('facility_type', criteria.facilityType);
    }
    
    if (criteria.amenities && criteria.amenities.length > 0) {
      query = query.contains('amenities', criteria.amenities);
    }
    
    const { data, error } = await query.limit(50);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error searching facilities:', error);
    return [];
  }
}
