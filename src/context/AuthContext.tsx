
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { syncUserData, updateUserSubscription } from '@/services/userService';

// Extend the User type to include our custom properties
interface ExtendedUser extends User {
  name?: string;
  demoTier?: string;
  subscription?: string;
}

type AuthContextType = {
  user: ExtendedUser | null;
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
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Extend the user with our custom properties
          const extendedUser: ExtendedUser = {
            ...session.user,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            demoTier: session.user.user_metadata?.demo_tier || 'basic',
            subscription: session.user.user_metadata?.subscription || 'basic'
          };
          setUser(extendedUser);
          
          // If we have a user, sync their data to our users table
          setTimeout(async () => {
            await syncUserData(session.user.id, {
              email: session.user.email || '',
              full_name: session.user.user_metadata.name || ''
            });
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Extend the user with our custom properties
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          demoTier: session.user.user_metadata?.demo_tier || 'basic',
          subscription: session.user.user_metadata?.subscription || 'basic'
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Failed to sign in');
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
            demo_tier: 'basic',
            subscription: 'basic'
          }
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Demo features preserved from previous implementation
  const enableWarmLeads = async () => {
    try {
      setLoading(true);
      if (user) {
        // This would be implemented with a real database update in production
        toast.success('Warm leads feature enabled!');
      }
    } catch (error) {
      console.error('Enabling warm leads failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const useWarmLeadCredit = async (): Promise<boolean> => {
    try {
      setLoading(true);
      if (user) {
        // This would be implemented with a real database update in production
        return true;
      }
      return false;
    } catch (error) {
      console.error('Using warm lead credit failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const purchaseWarmLeadCredits = async (quantity: number): Promise<void> => {
    try {
      setLoading(true);
      if (user) {
        // This would be implemented with a real purchase flow in production
        toast.success(`Purchased ${quantity} warm lead credits!`);
      }
    } catch (error) {
      console.error('Purchasing warm lead credits failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDemoTier = async (tier: 'basic' | 'premium') => {
    if (user) {
      try {
        // Update the user metadata in Supabase
        const { data, error } = await supabase.auth.updateUser({
          data: {
            demo_tier: tier,
            subscription: tier
          }
        });

        if (error) throw error;

        // Update local user state
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            demoTier: tier,
            subscription: tier,
            user_metadata: {
              ...prevUser.user_metadata,
              demo_tier: tier,
              subscription: tier
            }
          };
        });

        // Also update the user in the database via our service
        await updateUserSubscription(user.id, tier);
        
        toast.success(`Upgraded to ${tier} tier!`);
      } catch (error: any) {
        console.error('Error updating tier:', error);
        toast.error(error.message || 'Failed to update subscription tier');
      }
    }
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
