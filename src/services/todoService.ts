
import { supabase } from '@/lib/supabase';
import { TodoItem } from '@/types/todo';

export const createTodoItem = async (todo: Omit<TodoItem, 'completed' | 'created_at'>): Promise<TodoItem | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...todo, completed: false, status: 'active' }])
      .select()
      .single();

    if (error) throw error;
    
    // Transform the data to match TodoItem interface
    const todoItem: TodoItem = {
      id: data.id,
      user_id: data.assigned_to || data.user_id,
      title: data.title,
      description: data.description,
      due_date: data.due_date,
      priority: data.priority as 'low' | 'medium' | 'high',
      completed: data.status === 'completed',
      created_at: data.created_at
    };
    
    return todoItem;
  } catch (error) {
    console.error('Error creating todo item:', error);
    return null;
  }
};

export const getTodoItems = async (userId: string): Promise<TodoItem[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    
    // Transform the data to match TodoItem interface
    const todoItems: TodoItem[] = (data || []).map(item => ({
      id: item.id,
      user_id: item.assigned_to || item.user_id,
      title: item.title,
      description: item.description,
      due_date: item.due_date,
      priority: item.priority as 'low' | 'medium' | 'high',
      completed: item.status === 'completed',
      created_at: item.created_at
    }));
    
    return todoItems;
  } catch (error) {
    console.error('Error fetching todo items:', error);
    return [];
  }
};

export const updateTodoItem = async (id: string, updates: Partial<TodoItem>): Promise<boolean> => {
  try {
    // Transform TodoItem updates to match the tasks table schema
    const taskUpdates: any = {
      ...updates,
      status: updates.completed ? 'completed' : 'active'
    };
    
    // Remove fields that don't exist in the tasks table
    delete taskUpdates.completed;
    
    const { error } = await supabase
      .from('tasks')
      .update(taskUpdates)
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
    const { error } = await supabase
      .from('tasks')
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
        completed: false,
        tags: ["follow-up", "client", "facilities"]
      },
      {
        user_id: userId,
        title: "Update Maria Garcia's medical records",
        description: "Records are over 30 days old and may need updating before placement",
        priority: "medium" as const,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        ai_generated: true,
        completed: false,
        tags: ["medical", "records", "update"]
      }
    ];
    
    return mockRecommendations;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
};
