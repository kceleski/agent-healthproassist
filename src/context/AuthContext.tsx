
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { AuthUser, AuthContextType } from '@/types/auth';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Fetch both role and profile data
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.email,
            subscription: profile?.subscription || 'basic',
            role: roleData?.role || 'user'
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch both role and profile data
        Promise.all([
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle(),
          supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
        ]).then(([{ data: roleData }, { data: profile }]) => {
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.email,
            subscription: profile?.subscription || 'basic',
            role: roleData?.role || 'user'
          };
          setUser(userData);
        });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check if this is a demo account login
      if (email === 'demo.basic@healthproassist.com') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'demo.basic@healthproassist.com',
          password: 'password123' // Use consistent password
        });
        
        if (error) throw error;
        toast.success("Logged in as Demo Basic User");
        
        // Redirect to welcome page after successful demo login
        window.location.href = "/welcome";
        return;
      }
      
      if (email === 'demo.premium@healthproassist.com') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'demo.premium@healthproassist.com',
          password: 'password123' // Use consistent password
        });
        
        if (error) throw error;
        toast.success("Logged in as Demo Premium User");
        
        // Redirect to welcome page after successful demo login
        window.location.href = "/welcome";
        return;
      }
      
      // Regular user login
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
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
            name
          }
        }
      });

      if (error) throw error;
      
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvatar = () => {
    setShowAvatar(!showAvatar);
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
        showAvatar,
        toggleAvatar
      }}
    >
      {children}
      {showAvatar && user && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Health Assistant</span>
                <Button variant="ghost" size="sm" onClick={toggleAvatar}>×</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <elevenlabs-convai 
                agent-id="R9M1zBEUj8fTGAij61wb" 
                className="w-full h-[350px] rounded-lg bg-gray-100"
              />
            </CardContent>
          </Card>
        </div>
      )}
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
