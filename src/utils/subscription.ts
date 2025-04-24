
import { AuthUser } from '@/types/auth';

/**
 * Determines if a user has premium subscription status
 * @param user The authenticated user object
 * @returns boolean indicating if user has premium status
 */
export const isPremiumUser = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.subscription === 'premium' || user.demoTier === 'premium';
};

/**
 * Gets the current tier of the user
 * @param user The authenticated user object
 * @returns 'premium' if user has premium status, otherwise 'basic'
 */
export const getUserTier = (user: AuthUser | null): 'premium' | 'basic' => {
  return isPremiumUser(user) ? 'premium' : 'basic';
};
