
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

// This is now synchronously checking for demo users and returns a promise for regular users
export const getUserTier = async (user: AuthUser | null): Promise<'premium' | 'basic'> => {
  // For demo users, return subscription immediately
  if (user?.isDemo) {
    return user.subscription || 'basic';
  }
  
  // For regular users, check premium status
  const isPremium = await isPremiumUser(user);
  return isPremium ? 'premium' : 'basic';
};

// Synchronous version for direct use in components
export const getUserTierSync = (user: AuthUser | null): 'premium' | 'basic' => {
  // For demo users, we can check directly
  if (user?.isDemo) {
    return user.subscription || 'basic';
  }
  
  // For non-demo users, default to basic when we can't check asynchronously
  return 'basic';
};
