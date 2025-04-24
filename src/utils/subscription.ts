
import { AuthUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';

export const isPremiumUser = async (user: AuthUser | null): Promise<boolean> => {
  if (!user) return false;
  
  // For demo users, check the subscription property directly
  if (user.isDemo) {
    return user.subscription === 'premium';
  }
  
  // For regular users, check the database
  const { data } = await supabase
    .from('users')
    .select('subscription')
    .eq('id', user.id)
    .single();
    
  return data?.subscription === 'premium';
};

export const getUserTier = async (user: AuthUser | null): Promise<'premium' | 'basic'> => {
  if (user?.isDemo) {
    return user.subscription || 'basic';
  }
  return await isPremiumUser(user) ? 'premium' : 'basic';
};
