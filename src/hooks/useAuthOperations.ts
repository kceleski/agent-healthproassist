
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthUser } from '@/types/auth';

export const useAuthOperations = () => {
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  const loginDemo = (type: 'basic' | 'premium'): AuthUser => {
    // Create a valid UUID for demo users to prevent database issues
    const demoUuid = '00000000-0000-0000-0000-000000000000'; 
    
    const demoUser: AuthUser = {
      id: demoUuid, // Use valid UUID format
      email: `demo-${type}@example.com`,
      name: `Demo ${type.charAt(0).toUpperCase() + type.slice(1)} User`,
      subscription: type,
      role: type === 'premium' ? 'premium' : 'basic',
      isDemo: true,
      demoType: type // Add demo type for reference
    };
    
    toast.success(`Logged in as ${type} demo user`);
    return demoUser;
  };

  const register = async (
    email: string, 
    password: string,
    metadata?: any
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (error) throw error;
      
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  return {
    login,
    register,
    logout,
    loginDemo
  };
};
