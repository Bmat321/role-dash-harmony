
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useReduxAuth } from '@/hooks/useReduxAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduxAuth = useReduxAuth();

  // Add error boundary to prevent crashes
  if (!reduxAuth) {
    console.error('useReduxAuth returned undefined');
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={reduxAuth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
