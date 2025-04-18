
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SeniorClientData {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  care_needs?: string;
  medical_conditions?: string[];
  mobility_status?: string;
  cognitive_status?: string;
  budget_range?: string;
  insurance_info?: string;
  notes?: string;
}

// Create a new senior client
export async function createSeniorClient(userId: string, clientData: SeniorClientData) {
  try {
    const { data, error } = await supabase
      .from('senior_clients')
      .insert({
        user_id: userId,
        ...clientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    toast.success('Senior client added successfully');
    return data[0];
  } catch (error) {
    console.error('Error creating senior client:', error);
    toast.error('Failed to add senior client');
    return null;
  }
}

// Get all senior clients for a user
export async function getSeniorClients(userId: string) {
  try {
    const { data, error } = await supabase
      .from('senior_clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching senior clients:', error);
    return [];
  }
}

// Get a specific senior client
export async function getSeniorClient(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('senior_clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching senior client:', error);
    return null;
  }
}

// Update a senior client
export async function updateSeniorClient(clientId: string, clientData: Partial<SeniorClientData>) {
  try {
    const { error } = await supabase
      .from('senior_clients')
      .update({
        ...clientData,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId);
    
    if (error) throw error;
    
    toast.success('Senior client updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating senior client:', error);
    toast.error('Failed to update senior client');
    return false;
  }
}

// Delete a senior client
export async function deleteSeniorClient(clientId: string) {
  try {
    const { error } = await supabase
      .from('senior_clients')
      .delete()
      .eq('id', clientId);
    
    if (error) throw error;
    
    toast.success('Senior client deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting senior client:', error);
    toast.error('Failed to delete senior client');
    return false;
  }
}
