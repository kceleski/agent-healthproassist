import { supabase } from '@/lib/supabase';
import { TodoItem } from '@/types/todo';

export const getTodoItems = async (userId: string): Promise<TodoItem[]> => {
  if (!userId) return [];
  const { data, error } = await supabase.from('agent_tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching tasks:', error.message);
    return [];
  }
  return data || [];
};

export const createTodoItem = async (todo: Omit<TodoItem, 'id' | 'created_at' | 'updated_at'>): Promise<TodoItem | null> => {
    const { data, error } = await supabase.from('agent_tasks').insert(todo).select().single();
    if (error) {
        console.error('Error creating task:', error);
        return null;
    }
    return data;
};
