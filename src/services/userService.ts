
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Create or update a user in our users table after authentication
export async function syncUserData(userId: string, userData: { email: string, full_name?: string }) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({
          email: userData.email,
          full_name: userData.full_name,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
    } else {
      // Create new user
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name,
          subscription: 'free', // Default subscription tier
          demo_tier: 'basic', // For demo purposes
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing user data:', error);
    return false;
  }
}

// Update user subscription tier
export async function updateUserSubscription(userId: string, tier: 'free' | 'basic' | 'premium') {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        subscription: tier,
        demo_tier: tier, // For demo purposes, keep these in sync
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success(`Subscription updated to ${tier}`);
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    toast.error('Failed to update subscription');
    return false;
  }
}

// Get user notifications (unread by default)
export async function getUserNotifications(userId: string, onlyUnread = true) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (onlyUnread) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}
