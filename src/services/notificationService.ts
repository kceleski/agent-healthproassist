
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  related_id?: string;
  read: boolean;
  created_at: string;
}

// Since the notifications table doesn't exist in the current schema,
// I'll create mock functions that return empty data for now
// These should be updated once the notifications table is created in Supabase

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  console.log('getUserNotifications called for user:', userId);
  // Return empty array since notifications table doesn't exist yet
  return [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  console.log('markNotificationAsRead called for notification:', notificationId);
  // Return true to simulate success since table doesn't exist yet
  return true;
};

export const createTestNotification = async (userId: string): Promise<any> => {
  console.log('createTestNotification called for user:', userId);
  // Return mock data since table doesn't exist yet
  return {
    id: 'mock-id',
    user_id: userId,
    type: 'system',
    title: 'Test Notification',
    content: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
    read: false,
    created_at: new Date().toISOString()
  };
};
