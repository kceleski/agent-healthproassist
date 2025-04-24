
import { AuthUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';

export const isPremiumUser = async (user: AuthUser | null): Promise<boolean> => {
  if (!user) return false;
  
  const { data } = await supabase
    .from('users')
    .select('subscription')
    .eq('id', user.id)
    .single();
    
  return data?.subscription === 'premium';
};

export const getUserTier = async (user: AuthUser | null): Promise<'premium' | 'basic'> => {
  return await isPremiumUser(user) ? 'premium' : 'basic';
};
