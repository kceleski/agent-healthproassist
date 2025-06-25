
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
  related_client_id?: string;
  related_facility_id?: string;
}

export const createTodoItem = async (todoData: Omit<TodoItem, 'id' | 'completed' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('agent_todo_items')
    .insert([{
      ...todoData,
      completed: false
    }])
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
  return true;
};

export const generateAIRecommendations = async (userId: string): Promise<TodoItem[]> => {
  // Mock AI recommendations for now
  return [
    {
      id: 'ai-1',
      title: 'Follow up with Johnson Family',
      description: 'Check on tour feedback from yesterday',
      priority: 'high',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ai-2', 
      title: 'Update facility availability list',
      description: 'Review current bed availability for partner facilities',
      priority: 'medium',
      due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      user_id: userId,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
};
