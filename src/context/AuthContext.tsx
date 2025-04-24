import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { AuthUser, AuthContextType } from '@/types/auth';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { syncUserData } from '@/services/userService';

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
          if (event === 'SIGNED_IN') {
            await syncUserData(session.user.id, {
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name
            });
          }
          
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

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await syncUserData(session.user.id, {
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name
        });
        
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
      
      console.log("Login attempt with email:", email);
      
      if (email === 'demo.basic@healthproassist.com') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'demo.basic@healthproassist.com',
          password: 'Passw0rd!Demo123' 
        });
        
        if (error) {
          console.error("Demo basic login error:", error);
          toast.error("Demo account login failed. Please try again.");
          throw error;
        }
        
        toast.success("Logged in as Demo Basic User");
        window.location.href = "/welcome";
        return;
      }
      
      if (email === 'demo.premium@healthproassist.com') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'demo.premium@healthproassist.com',
          password: 'Passw0rd!Demo123'
        });
        
        if (error) {
          console.error("Demo premium login error:", error);
          toast.error("Demo account login failed. Please try again.");
          throw error;
        }
        
        toast.success("Logged in as Demo Premium User");
        window.location.href = "/welcome";
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        await syncUserData(data.user.id, {
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name
        });
      }
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string,
    profileData?: {
      bio?: string,
      default_location?: string,
      notification_preferences?: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
      },
      communication_preferences?: {
        receiveUpdates: boolean;
        receiveReferrals: boolean;
        allowContactSharing: boolean;
      }
    }
  ) => {
    try {
      setLoading(true);
      console.log("Attempting to register user:", { name, email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        throw error;
      }
      
      console.log("Registration response:", data);
      
      if (data.user) {
        console.log("User created successfully, syncing user data");
        await syncUserData(data.user.id, {
          email: data.user.email || '',
          full_name: name
        });
        
        if (profileData) {
          console.log("Updating profile data:", profileData);
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              bio: profileData.bio,
              default_location: profileData.default_location,
              notification_preferences: profileData.notification_preferences,
              communication_preferences: profileData.communication_preferences
            })
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error("Error updating profile data:", profileError);
          }
        }
        
        // Set the user in state
        const userData: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          name: name
        };
        
        setUser(userData);
        setSession(data.session);
      }
      
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      console.error("Registration error:", error);
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
