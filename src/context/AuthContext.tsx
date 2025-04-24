
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase'; // Use a single Supabase client instance

// Type for authenticated user
type AuthUser = {
  id: string;
  email: string | undefined;
  name?: string;
  subscription?: string;
  role?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  enableWarmLeads: () => Promise<void>;
  useWarmLeadCredit: () => Promise<boolean>;
  purchaseWarmLeadCredits: (quantity: number) => Promise<void>;
  updateDemoTier: (tier: 'basic' | 'premium') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name as string,
          subscription: session.user.user_metadata?.subscription as string,
          role: session.user.user_metadata?.role as string,
        };
        setUser(userData);
      }
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event);
      setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name as string,
          subscription: session.user.user_metadata?.subscription as string,
          role: session.user.user_metadata?.role as string,
        };
        setUser(userData);
        toast.success("Signed in successfully!");
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        toast.success("Signed out successfully!");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            subscription: 'basic',
            role: 'Consultant',
          },
        },
      });

      if (error) {
        throw error;
      }
      
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Legacy features preserved but now using real auth data
  const enableWarmLeads = async () => {
    if (user) {
      toast.success('Warm leads feature enabled!');
    } else {
      toast.error('You need to be logged in to enable warm leads');
    }
    return;
  };

  const useWarmLeadCredit = async (): Promise<boolean> => {
    if (user) {
      toast.success('Warm lead credit used!');
      return true;
    }
    toast.error('You need to be logged in to use warm lead credits');
    return false;
  };

  const purchaseWarmLeadCredits = async (): Promise<void> => {
    if (user) {
      toast.success(`Purchased warm lead credits!`);
    } else {
      toast.error('You need to be logged in to purchase credits');
    }
    return;
  };

  const updateDemoTier = async (tier: 'basic' | 'premium') => {
    if (user) {
      toast.success(`Account upgraded to ${tier} tier!`);
    } else {
      toast.error('You need to be logged in to upgrade');
    }
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        enableWarmLeads,
        useWarmLeadCredit,
        purchaseWarmLeadCredits,
        updateDemoTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
