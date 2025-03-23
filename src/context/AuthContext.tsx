
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'placement_agent' | 'referral_partner';
  subscription: 'free' | 'basic' | 'premium' | null;
  warmLeadsEnabled: boolean; // New field to track if the user has paid for warm leads
  warmLeadCredits: number; // Number of warm lead credits available
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  enableWarmLeads: () => Promise<void>; // New function to enable warm leads
  useWarmLeadCredit: () => Promise<boolean>; // New function to use a warm lead credit
  purchaseWarmLeadCredits: (quantity: number) => Promise<void>; // New function to purchase lead credits
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('healthpro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      // For this demo, we'll simulate a successful login
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        name: 'Demo User',
        role: 'placement_agent',
        subscription: 'basic',
        warmLeadsEnabled: false,
        warmLeadCredits: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('healthpro_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      // For this demo, we'll simulate a successful registration
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'placement_agent',
        subscription: 'free',
        warmLeadsEnabled: false,
        warmLeadCredits: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('healthpro_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthpro_user');
  };

  // New function to enable warm leads
  const enableWarmLeads = async () => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      // For this demo, we'll simulate a successful update
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          warmLeadsEnabled: true,
          warmLeadCredits: user.warmLeadCredits + 10, // Give 10 credits as a starter
        };
        
        setUser(updatedUser);
        localStorage.setItem('healthpro_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Enabling warm leads failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // New function to use a warm lead credit
  const useWarmLeadCredit = async (): Promise<boolean> => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      // For this demo, we'll simulate a successful update
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user && user.warmLeadsEnabled && user.warmLeadCredits > 0) {
        const updatedUser = {
          ...user,
          warmLeadCredits: user.warmLeadCredits - 1,
        };
        
        setUser(updatedUser);
        localStorage.setItem('healthpro_user', JSON.stringify(updatedUser));
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

  // New function to purchase warm lead credits
  const purchaseWarmLeadCredits = async (quantity: number): Promise<void> => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      // For this demo, we'll simulate a successful purchase
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          warmLeadsEnabled: true,
          warmLeadCredits: user.warmLeadCredits + quantity,
        };
        
        setUser(updatedUser);
        localStorage.setItem('healthpro_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Purchasing warm lead credits failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        enableWarmLeads,
        useWarmLeadCredit,
        purchaseWarmLeadCredits,
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
