
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/lib/database.types';

export type ReminderType = 'email' | 'sms';
export type ReminderTime = '15min' | '30min' | '1hour' | '1day';

export interface Reminder {
  id?: string;
  appointment_id: string;
  type: ReminderType;
  time_before: ReminderTime;
  sent: boolean;
  user_id: string;
}

export const createReminder = async (reminder: Omit<Reminder, 'sent'>): Promise<Reminder | null> => {
  try {
    const { data, error } = await supabase
      .from('appointment_reminders')
      .insert({
        ...reminder,
        sent: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    return null;
  }
};

export const getRemindersByAppointmentId = async (appointmentId: string): Promise<Reminder[]> => {
  try {
    const { data, error } = await supabase
      .from('appointment_reminders')
      .select('*')
      .eq('appointment_id', appointmentId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
};

export const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointment_reminders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};
