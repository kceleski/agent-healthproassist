
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
      .from('agent_appointment_reminders') // Updated table name
      .insert({
        ...reminder,
        sent: false
      })
      .select()
      .single();

    if (error) throw error;
    
    // Ensure the returned data conforms to Reminder interface
    const validTypes: ReminderType[] = ['email', 'sms'];
    const validTimeBefore: ReminderTime[] = ['15min', '30min', '1hour', '1day'];
    
    const reminderData: Reminder = {
      id: data.id as string,
      appointment_id: data.appointment_id as string,
      user_id: data.user_id as string,
      type: validTypes.includes(data.type as any) 
        ? (data.type as ReminderType) 
        : 'email', // default fallback
      time_before: validTimeBefore.includes(data.time_before as any)
        ? (data.time_before as ReminderTime)
        : '30min', // default fallback
      sent: Boolean(data.sent)
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
      id: item.id as string,
      appointment_id: item.appointment_id as string,
      user_id: item.user_id as string,
      type: validTypes.includes(item.type as any) 
        ? (item.type as ReminderType) 
        : 'email', // default fallback
      time_before: validTimeBefore.includes(item.time_before as any)
        ? (item.time_before as ReminderTime)
        : '30min', // default fallback
      sent: Boolean(item.sent)
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
