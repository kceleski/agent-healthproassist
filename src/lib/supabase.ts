
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client with public URL and anon key
// These keys are safe to use in client code as they're restricted by RLS policies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zpfaojrmcozacnsnwmra.supabase.co"; 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZmFvanJtY296YWNuc253bXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDI1NjYsImV4cCI6MjA1Nzg3ODU2Nn0.p6zCt1HzmKCkBHbairGysWtWo22d6m2rJY3q3yE58gc";

// Configure the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper to get user profile with subscription info
export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get user data from our custom users table
  const { data: userData } = await supabase
    .from('users')
    .select('*, user_profiles(*)')
    .eq('id', user.id)
    .single();
    
  return userData;
};
