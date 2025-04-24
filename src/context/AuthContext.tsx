
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { AuthAvatar } from '@/components/auth/AuthAvatar';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading, showAvatar, toggleAvatar, setUser } = useAuthState();
  const { login, register, logout, loginDemo } = useAuthOperations();

  const handleLoginDemo = (type: 'basic' | 'premium') => {
    const demoUser = loginDemo(type);
    setUser(demoUser);
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
        toggleAvatar,
        loginDemo: handleLoginDemo
      }}
    >
      {children}
      <AuthAvatar showAvatar={showAvatar} onClose={toggleAvatar} />
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
