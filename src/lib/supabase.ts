import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Get the Supabase URL and Key from your secure .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if the variables are set, and throw an error if they are not
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Please check your .env.local file.")
}

/**
 * This is now the single, official Supabase client for your entire application.
 * All other files will import this instance.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
