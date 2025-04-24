
import React, { createContext, useContext, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Update the user type to include all properties consistently
type DemoUser = {
  id: string;
  email: string;
  name: string;
  demoTier: string;
  subscription: string;
  role: string;
  user_metadata: {
    name: string;
    demo_tier: string;
    subscription: string;
    role: string;
  }
};

// Mock user for demo purposes
const DEMO_USER: DemoUser = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  name: 'Demo User',
  demoTier: 'premium',
  subscription: 'premium',
  role: 'Consultant',
  user_metadata: {
    name: 'Demo User',
    demo_tier: 'premium',
    subscription: 'premium',
    role: 'Consultant'
  }
};

// Mock session for demo purposes
const DEMO_SESSION = {
  access_token: 'demo-token',
  refresh_token: 'demo-refresh-token',
  user: DEMO_USER
} as unknown as Session;

type AuthContextType = {
  user: typeof DEMO_USER | null;
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
  // For demo purposes, always provide an authenticated user
  const [user] = useState(DEMO_USER);
  const [session] = useState(DEMO_SESSION);
  const [loading, setLoading] = useState(false);

  // Mock implementations of auth functions for demo
  const login = async () => {
    toast.success("Demo login successful");
  };

  const register = async () => {
    toast.success("Demo registration successful");
  };

  const logout = async () => {
    toast.success("Demo logout successful");
  };

  // Demo features preserved from previous implementation
  const enableWarmLeads = async () => {
    toast.success('Demo: Warm leads feature enabled!');
    return;
  };

  const useWarmLeadCredit = async (): Promise<boolean> => {
    toast.success('Demo: Warm lead credit used!');
    return true;
  };

  const purchaseWarmLeadCredits = async (): Promise<void> => {
    toast.success(`Demo: Purchased warm lead credits!`);
    return;
  };

  const updateDemoTier = async (tier: 'basic' | 'premium') => {
    toast.success(`Demo: Upgraded to ${tier} tier!`);
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
        isAuthenticated: true, // Always authenticated in demo mode
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
