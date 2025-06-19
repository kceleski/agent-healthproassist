
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthUser } from "@/types/auth";

// Type guard to check if an object is a full Supabase User or our custom AuthUser
function isSupabaseUser(user: User | AuthUser | null): user is User {
  return user !== null && 'app_metadata' in user && 'user_metadata' in user;
}

// Asynchronously get user tier from the database
export const getUserTier = async (user: User | AuthUser | null): Promise<'standard' | 'premium'> => {
  if (!user) return 'standard';
  
  // Handle demo users with predefined subscription
  if ('isDemo' in user && user.isDemo) {
    return user.subscription as 'standard' | 'premium' || 'standard';
  }
  
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
    return 'standard';
  } catch (error) {
    console.error('Error checking user tier:', error);
    return 'standard';
  }
};

// Synchronous function for checking if user has premium features
// Use this for feature flags in components that don't need to be reactive to tier changes
export const hasPremiumFeatures = (isPremium: boolean): boolean => {
  return isPremium;
};
