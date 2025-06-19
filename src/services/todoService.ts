import { supabase } from '@/lib/supabase';
import { TodoItem } from '@/types/todo';

export const getTodoItems = async (userId: string): Promise<TodoItem[]> => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('agent_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error.message);
    return [];
  }
  return data || [];
};

export const createTodoItem = async (todo: Omit<TodoItem, 'id' | 'created_at' | 'updated_at' | 'completed'>): Promise<TodoItem | null> => {
    const { data, error } = await supabase
        .from('agent_tasks')
        .insert({ ...todo, completed: false })
        .select()
        .single();
    
    if (error) {
        console.error('Error creating task:', error);
        return null;
    }
    return data;
};

export const updateTodoItem = async (id: string, updates: Partial<TodoItem>): Promise<TodoItem | null> => {
    const { data, error } = await supabase
        .from('agent_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating task:', error);
        return null;
    }
    return data;
};

export const deleteTodoItem = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('agent_tasks')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error deleting task:', error);
        return false;
    }
    return true;
};

// This function doesn't exist in the new schema, so we provide a placeholder
export const generateAIRecommendations = async (userId: string): Promise<any[]> => {
    console.log("generateAIRecommendations called for user:", userId);
    return [];
};
