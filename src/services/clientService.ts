import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface SeniorClientData {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

export async function getSeniorClients(userId: string, agencyId?: string | null) {
  try {
    let query = supabase.from('agent_senior_clients').select('*');
    if (agencyId) {
      query = query.eq('agency_id', agencyId);
    } else {
      query = query.eq('created_by_user_id', userId);
    }
    const { data, error } = await query.order('last_name', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

export async function createSeniorClient(userId: string, agencyId: string | null, clientData: Omit<SeniorClientData, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('agent_senior_clients')
      .insert({ created_by_user_id: userId, agency_id: agencyId, ...clientData })
      .select().single();
    if (error) throw error;
    toast.success('Client added successfully.');
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    toast.error('Failed to add client.');
    return null;
  }
}
