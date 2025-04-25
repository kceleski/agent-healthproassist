
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthUser } from '@/types/auth';

// Create or update a user in our users table after authentication
export async function syncUserData(userId: string, userData: { email: string, full_name?: string, phone?: string }) {
  try {
    console.log("Syncing user data for:", userId, userData);
    
    // First check if the user exists in our users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching user data:", fetchError);
      throw fetchError;
    }
    
    if (existingUser) {
      console.log("Updating existing user:", existingUser);
      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }
      
      console.log("User updated successfully");
    } else {
      console.log("Creating new user");
      // Create new user
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          subscription: 'free', // Default subscription tier
          demo_tier: 'basic', // For demo purposes
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        });
      
      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }
      
      console.log("User created successfully");
    }
    
    // Also ensure we have a user profile record
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching user profile:", profileError);
    }
    
    if (!profileData) {
      console.log("Creating new user profile");
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
        });
        
      if (error) {
        console.error("Error creating user profile:", error);
      } else {
        console.log("User profile created successfully");
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing user data:', error);
    return false;
  }
}

// Update user subscription tier
export async function updateUserSubscription(userId: string, tier: 'free' | 'basic' | 'premium' | 'standard') {
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
    
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    toast.error('Failed to update subscription');
    return false;
  }
}

// Get user notifications (unread by default)
export async function getUserNotifications(userId: string, onlyUnread = true) {
  // Skip notifications for demo users to prevent database errors
  if (userId.includes('demo-') || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    console.log('Demo user detected, returning mock notifications');
    return [
      {
        id: '1',
        user_id: userId,
        title: 'Demo Notification',
        content: 'This is a demo notification',
        type: 'info',
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: userId,
        title: 'Welcome to Demo Mode',
        content: 'You are currently using the demo version',
        type: 'success',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
  }

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
  // Skip for demo notifications
  if (notificationId === '1' || notificationId === '2') {
    return true;
  }

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

// Fetch user profile data
export async function fetchUserProfile(userId: string) {
  // Skip database call for demo users
  if (userId.includes('demo-') || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    console.log('Demo user detected, returning mock profile');
    return {
      id: userId,
      notification_preferences: {
        sms: false,
        email: true,
        inApp: true
      },
      communication_preferences: {
        receiveUpdates: true,
        receiveReferrals: true,
        allowContactSharing: false
      },
      bio: 'This is a demo account',
      default_location: 'Phoenix, AZ'
    };
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
