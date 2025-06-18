import { supabase } from '@/lib/supabase';

export async function getFullUserProfile(userId: string) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('agent_users')
      .select(`*, profile: agent_profiles(*), agency: agent_agencies(*)`)
      .eq('id', userId)
      .single();
    if (error) throw error;
    return { ...data, ...data.profile, agency_name: data.agency?.agency_name };
  } catch (error) {
    console.error('Error fetching full user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
    const { data, error } = await supabase.from('agent_profiles').update(profileData).eq('user_id', userId).select();
    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }
    return data;
}
