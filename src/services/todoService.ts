
import { supabase } from '@/lib/supabase';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const createTodoItem = async (todoData: Omit<TodoItem, 'id' | 'completed' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('agent_todo_items')
    .insert([todoData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTodoItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('agent_todo_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateTodoItem = async (id: string, updates: Partial<TodoItem>) => {
  const { data, error } = await supabase
    .from('agent_todo_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTodoItem = async (id: string) => {
  const { error } = await supabase
    .from('agent_todo_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
