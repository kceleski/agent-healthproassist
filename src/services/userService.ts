import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthUser } from '@/types/auth';

// The syncUserData function is no longer needed as a SQL trigger handles this.

// Fetch user profile data from the new agent_ tables
export async function fetchUserProfile(userId: string) {
  if (!userId || userId.includes('demo-')) {
    console.log('Demo user or no user ID, returning mock profile.');
    return {
      id: userId || 'demo-user',
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      notification_preferences: { email: true, sms: false, inApp: true },
      communication_preferences: { receiveUpdates: true, receiveReferrals: true, allowContactSharing: false },
      bio: 'This is a demo account.',
      default_location: 'Phoenix, AZ'
    };
  }

  try {
    const { data, error } = await supabase
      .from('agent_users')
      .select(`
        *,
        profile:agent_profiles(*),
        agency:agent_agencies(*)
      `)
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Update user subscription tier in the new agent_users table
export async function updateUserSubscription(userId: string, tier: 'standard' | 'premium') {
  try {
    const { error } = await supabase
      .from('agent_users')
      .update({
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    toast.error('Failed to update subscription');
    return false;
  }
}

// Get user notifications (now points to agent_notifications if it existed)
export async function getUserNotifications(userId: string, onlyUnread = true) {
  // Placeholder, as there is no agent_notifications table yet.
  return [];
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  // Placeholder
  return true;
}
