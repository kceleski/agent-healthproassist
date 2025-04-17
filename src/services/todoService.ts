
import { supabase } from '@/integrations/supabase/client';

export interface TodoItem {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  related_client_id?: string;
  related_facility_id?: string;
  related_appointment_id?: string;
  ai_generated?: boolean;
  tags?: string[];
  created_at?: string;
}

export const createTodoItem = async (todo: Omit<TodoItem, 'completed' | 'created_at'>): Promise<TodoItem | null> => {
  try {
    // Define the table name as a string literal type to help TypeScript
    const tableName = 'todo_items' as const;
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([{ ...todo, completed: false, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data as TodoItem;
  } catch (error) {
    console.error('Error creating todo item:', error);
    return null;
  }
};

export const getTodoItems = async (userId: string): Promise<TodoItem[]> => {
  try {
    // Define the table name as a string literal type to help TypeScript
    const tableName = 'todo_items' as const;
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as TodoItem[] || [];
  } catch (error) {
    console.error('Error fetching todo items:', error);
    return [];
  }
};

export const updateTodoItem = async (id: string, updates: Partial<TodoItem>): Promise<boolean> => {
  try {
    // Define the table name as a string literal type to help TypeScript
    const tableName = 'todo_items' as const;
    
    const { error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating todo item:', error);
    return false;
  }
};

export const deleteTodoItem = async (id: string): Promise<boolean> => {
  try {
    // Define the table name as a string literal type to help TypeScript
    const tableName = 'todo_items' as const;
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting todo item:', error);
    return false;
  }
};

export const generateAIRecommendations = async (userId: string): Promise<TodoItem[]> => {
  try {
    // In a real implementation, this would call an AI service
    // For now, we'll return mock recommendations
    const mockRecommendations: TodoItem[] = [
      {
        user_id: userId,
        title: "Follow up with Robert Johnson on facility preferences",
        description: "Client viewed 3 facilities last week but hasn't made a decision",
        priority: "high" as const,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        ai_generated: true,
        tags: ["follow-up", "client", "facilities"],
        completed: false
      },
      {
        user_id: userId,
        title: "Update Maria Garcia's medical records",
        description: "Records are over 30 days old and may need updating before placement",
        priority: "medium" as const,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        ai_generated: true,
        tags: ["medical", "records", "update"],
        completed: false
      }
    ];
    
    return mockRecommendations;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
};
