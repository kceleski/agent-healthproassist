
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

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
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDemoTier: (tier: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ? {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          name: currentSession.user.user_metadata?.full_name || '',
          avatar_url: currentSession.user.user_metadata?.avatar_url || null,
        } : null);
        setIsAuthenticated(!!currentSession);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ? {
        id: currentSession.user.id,
        email: currentSession.user.email || '',
        name: currentSession.user.user_metadata?.full_name || '',
        avatar_url: currentSession.user.user_metadata?.avatar_url || null,
      } : null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, user_profiles(*), demo_tier, subscription')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Extract avatar_url correctly from user_profiles
        let avatarUrl = null;
        if (data.user_profiles && Array.isArray(data.user_profiles) && data.user_profiles[0]) {
          avatarUrl = data.user_profiles[0].avatar_url;
        }
        
        setUser({
          id: data.id,
          email: data.email || '',
          name: data.full_name || '',
          avatar_url: avatarUrl,
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
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
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
      if (data?.user?.id) {
        await createUserRecord(data.user.id, { email, full_name: name });
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUserRecord = async (userId: string, userData: { email: string, full_name: string }) => {
    try {
      // Check if user record exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (existingUser) {
        // Update existing user
        await supabase
          .from('users')
          .update({
            email: userData.email,
            full_name: userData.full_name,
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          })
          .eq('id', userId);
      } else {
        // Create new user record
        await supabase
          .from('users')
          .insert({
            id: userId,
            email: userData.email,
            full_name: userData.full_name,
            demo_tier: 'basic',
            subscription: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });
        
        // Create user profile
        await supabase
          .from('user_profiles')
          .insert({
            user_id: userId
          });
      }
    } catch (error) {
      console.error('Error creating user record:', error);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
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
      throw error;
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
    session,
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
