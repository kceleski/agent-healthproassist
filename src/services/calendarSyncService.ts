
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/lib/database.types';

export type CalendarProvider = 'google' | 'outlook' | 'apple';

export interface CalendarSync {
  id?: string;
  user_id: string;
  provider: CalendarProvider;
  connected: boolean;
  last_synced?: string;
  calendar_id?: string;
}

export const connectCalendarProvider = async (userId: string, provider: CalendarProvider): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_connections')
      .insert({
        user_id: userId, 
        provider, 
        connected: true, 
        last_synced: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error connecting calendar:', error);
    return false;
  }
};

export const getConnectedCalendars = async (userId: string): Promise<CalendarSync[]> => {
  try {
    const { data, error } = await supabase
      .from('calendar_connections')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching connected calendars:', error);
    return [];
  }
};

export const disconnectCalendarProvider = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_connections')
      .update({ connected: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    return false;
  }
};
