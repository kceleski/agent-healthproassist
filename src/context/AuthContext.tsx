
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  demoTier?: string | null;
  subscription?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean; // Added for ProtectedRoute and Navbar
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Alias for signIn
  register: (name: string, email: string, password: string) => Promise<void>; // Alias for signUp
  logout: () => Promise<void>; // Alias for signOut
  updateDemoTier: (tier: string) => Promise<void>; // For subscription-toggle
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        await fetchUser(session.user.id);
        setIsAuthenticated(true);
      } else {
        setLoading(false);
        setIsAuthenticated(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await fetchUser(session?.user.id);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });
  }, []);

  const fetchUser = async (userId: string | undefined) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, user_profiles(*), demo_tier, subscription')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      if (data) {
        // Extract avatar_url correctly from user_profiles
        let avatar_url = null;
        if (data.user_profiles && data.user_profiles.length > 0 && data.user_profiles[0]) {
          avatar_url = data.user_profiles[0].avatar_url;
        }
        
        setUser({
          id: data.id,
          email: data.email || '',
          name: data.full_name || '',
          avatar_url: avatar_url,
          demoTier: data.demo_tier || null,
          subscription: data.subscription || null,
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;

      // Create a user profile after successful signup
      if (data.user?.id) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{ user_id: data.user.id }]);

        if (profileError) {
          console.error("Error creating user profile:", profileError.message);
          throw profileError;
        }
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error resetting password:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add the updateDemoTier function for the subscription toggle
  const updateDemoTier = async (tier: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          demo_tier: tier,
          subscription: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? {...prev, demoTier: tier, subscription: tier} : null);
    } catch (error: any) {
      console.error("Error updating demo tier:", error.message);
      throw error;
    }
  };

  // Create aliases for consistent function naming across components
  const login = signIn;
  const register = (name: string, email: string, password: string) => signUp(email, password, name);
  const logout = signOut;

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    login,
    register,
    logout,
    updateDemoTier,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
