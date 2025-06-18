import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Use the consistent project details
const supabaseUrl = "https://fktcmikrsgutyicluegr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdGNtaWtyc2d1dHlpY2x1ZWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNjY3MjEsImV4cCI6MjA2MDc0MjcyMX0.JW9mbH8H38aAi2JOycemGsd-Tv_RtgViREaOcctJpR4";
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient<Database>>;

export const supabase = (() => {
  if (!supabaseInstance) {
    console.log("Initializing Supabase client");
    supabaseInstance = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'healthProAssistAuthToken'
        }
      }
    );
  }
  return supabaseInstance;
})();

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
