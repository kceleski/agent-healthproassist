
import { supabase } from '@/lib/supabase';

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
      .from('agent_calendar_connections')
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
      .from('agent_calendar_connections')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    
    const validProviders: CalendarProvider[] = ['google', 'outlook', 'apple'];
    const calendars: CalendarSync[] = (data || []).map(item => ({
      id: item.id as string,
      user_id: item.user_id as string,
      provider: validProviders.includes(item.provider as any) 
        ? (item.provider as CalendarProvider) 
        : 'google',
      connected: Boolean(item.connected),
      last_synced: item.last_synced as string | undefined,
      calendar_id: item.calendar_id as string | undefined
    }));
    
    return calendars;
  } catch (error) {
    console.error('Error fetching connected calendars:', error);
    return [];
  }
};

export const disconnectCalendarProvider = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('agent_calendar_connections')
      .update({ connected: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    return false;
  }
};
