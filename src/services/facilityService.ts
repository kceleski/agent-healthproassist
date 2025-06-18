import { supabase } from '@/lib/supabase';

export const getFacilities = async () => {
  const { data, error } = await supabase.from('agent_facilities').select('*').order('name');
  if (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
  return data;
};

export const getFacilityById = async (id: string) => {
  const { data, error } = await supabase.from('agent_facilities').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching facility:', error);
    return null;
  }
  return data;
};
