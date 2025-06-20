import { supabase } from '@/lib/supabase';

// This function gets all the necessary data for the logged-in user
export async function getFullUserProfile(userId: string) {
  if (!userId) {
    console.error("Get profile called with no user ID.");
    return null;
  }
  
  try {
    // We select from the main agent_users table
    // and use Supabase to join the related data from agent_profiles and agent_agencies
    const { data, error } = await supabase
      .from('agent_users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        role,
        agent_profiles (*),
        agent_agencies (*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
        return null;
    }

    // This combines the data into one clean object for the UI to use easily
    const userProfile = {
        ...data,
        // The profiles table returns an array, so we take the first element
        ...(Array.isArray(data.agent_profiles) ? data.agent_profiles[0] : data.agent_profiles), 
        // The agencies table might not exist for independent agents
        ...(Array.isArray(data.agent_agencies) ? data.agent_agencies[0] : data.agent_agencies),
    };
    
    return userProfile;

  } catch (error) {
    console.error('Error fetching full user profile:', error);
    return null;
  }
}

// This function allows a user to update their profile information
export async function updateUserProfile(userId: string, profileData: any) {
    if (!userId) {
        console.error("Update profile called with no user ID.");
        return null;
    }

    const { data, error } = await supabase
        .from('agent_profiles')
        .update(profileData)
        .eq('user_id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }
    return data;
}
