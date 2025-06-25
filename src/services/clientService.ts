
import { supabase } from '@/lib/supabase';

export interface SeniorClientData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  veteran_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const createSeniorClient = async (clientData: Omit<SeniorClientData, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('seniors')
    .insert([clientData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSeniorClients = async () => {
  const { data, error } = await supabase
    .from('seniors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getSeniorClientById = async (id: string) => {
  const { data, error } = await supabase
    .from('seniors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateSeniorClient = async (id: string, updates: Partial<SeniorClientData>) => {
  const { data, error } = await supabase
    .from('seniors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSeniorClient = async (id: string) => {
  const { error } = await supabase
    .from('seniors')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
