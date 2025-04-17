
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AvatarResponseContextType {
  lastResponse: string;
  setLastResponse: (response: string) => void;
}

const AvatarResponseContext = createContext<AvatarResponseContextType | undefined>(undefined);

export const AvatarResponseProvider = ({ children }: { children: ReactNode }) => {
  const [lastResponse, setLastResponse] = useState<string>('');

  return (
    <AvatarResponseContext.Provider value={{ lastResponse, setLastResponse }}>
      {children}
    </AvatarResponseContext.Provider>
  );
};

export const useAvatarResponse = () => {
  const context = useContext(AvatarResponseContext);
  if (context === undefined) {
    throw new Error('useAvatarResponse must be used within a AvatarResponseProvider');
  }
  return context;
};
