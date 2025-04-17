
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

export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
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
};

export const createTestNotification = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'system',
        title: 'Test Notification',
        content: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
        read: false
      })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating test notification:', error);
    throw error;
  }
};
