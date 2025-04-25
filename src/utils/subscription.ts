
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Asynchronously get user tier from the database
export const getUserTier = async (user: User | null): Promise<'basic' | 'premium'> => {
  if (!user) return 'basic';
  
  try {
    // First check the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();
    
    if (profile?.subscription_tier === 'premium') return 'premium';
    
    // If not found in profile, check the subscriptions table
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (subscription?.plan === 'premium') return 'premium';
    
    // If no premium subscription found, return basic
    return 'basic';
  } catch (error) {
    console.error('Error checking user tier:', error);
    return 'basic';
  }
};

// Synchronous function for checking if user has premium features
// Use this for feature flags in components that don't need to be reactive to tier changes
export const hasPremiumFeatures = (isPremium: boolean): boolean => {
  return isPremium;
};
