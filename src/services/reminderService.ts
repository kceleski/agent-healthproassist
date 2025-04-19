
import { supabase } from '@/lib/supabase';

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
    
    // Ensure the type is of ReminderType
    const validTypes: ReminderType[] = ['email', 'sms'];
    const validType = validTypes.includes(data.type as any) 
      ? (data.type as ReminderType) 
      : 'email'; // default fallback
    
    const reminderData: Reminder = {
      ...data,
      type: validType,
      time_before: data.time_before as ReminderTime
    };
    
    return reminderData;
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
    
    // Ensure each reminder has the correct types
    const validTypes: ReminderType[] = ['email', 'sms'];
    const validTimeBefore: ReminderTime[] = ['15min', '30min', '1hour', '1day'];
    
    const reminders: Reminder[] = (data || []).map(item => ({
      ...item,
      type: validTypes.includes(item.type as any) 
        ? (item.type as ReminderType) 
        : 'email', // default fallback
      time_before: validTimeBefore.includes(item.time_before as any)
        ? (item.time_before as ReminderTime)
        : '30min' // default fallback
    }));
    
    return reminders;
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
