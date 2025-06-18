import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import useSoapAuth from '@/hooks/useSoapAuth';  // Admin login hook for SOAP API

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for HR, Manager, and Employee (non-admin)
const mockUsers: Record<string, { password: string; user: User }> = {
  'hr@hris.com': {
    password: 'hr123',
    user: { id: '2', email: 'hr@hris.com', firstName: 'Sarah', lastName: 'Johnson', role: 'hr', department: 'HR', position: 'HR Manager', status: 'active', token: '' },
  },
  'manager@hris.com': {
    password: 'manager123',
    user: { id: '3', email: 'manager@hris.com', firstName: 'Mike', lastName: 'Wilson', role: 'manager', department: 'Engineering', position: 'Lead', status: 'active', token: '' },
  },
  'employee@hris.com': {
    password: 'emp123',
    user: { id: '4', email: 'employee@hris.com', firstName: 'Jane', lastName: 'Doe', role: 'employee', department: 'Engineering', position: 'Developer', status: 'active', token: '' },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin login using SOAP API
  const { user: soapUser, login: soapLogin, logout: soapLogout, isLoading: isSoapLoading } = useSoapAuth();
  
  // Separate state for mock (non-admin) users
  const [mockUser, setMockUser] = useState<User | null>(null);  // Store mock or non-admin user here
  const [mockToken, setMockToken] = useState<string | null>(null);  // Store mock or non-admin token here
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState(isSoapLoading);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from localStorage for non-admin users (mock)
  useEffect(() => {
    const storedMockToken = localStorage.getItem('hris_mock_token');
    const storedMockUser = localStorage.getItem('hris_mock_user');
    
    if (storedMockToken && storedMockUser) {
      setMockUser(JSON.parse(storedMockUser));
      setMockToken(storedMockToken);
    }
    setIsLoading(false);
  }, []);

  // Login method: Handles Admin and Non-Admin (Mock) separately
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const isAdmin = email === 'admin@hris.com';

    try {
      if (isAdmin) {
        // Use SOAP API login for Admin
        await soapLogin(email, password);
        return true;
      } else {
        // Mock login for HR, Manager, Employee (non-admin)
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay for mock login
        const mockData = mockUsers[email];

        if (mockData && mockData.password === password) {
          // Only set state with mock data for non-admin users
          setMockUser(mockData.user);
          setMockToken(`mock_token_${Date.now()}`);
          localStorage.setItem('hris_mock_token', `mock_token_${Date.now()}`);
          localStorage.setItem('hris_mock_user', JSON.stringify(mockData.user));

          toast({
            title: 'Login Successful',
            description: `Welcome, ${mockData.user.firstName}!`,
          });

          return true;
        } else {
          toast({
            title: 'Login Failed',
            description: 'Invalid email or password',
            variant: 'destructive',
          });
          return false;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [soapLogin]);

  // Separate logout for Admin and Mock users
  const logoutHandler = () => {
    if (soapUser?.role === 'admin') {
      // Call SOAP API logout for Admin
      soapLogout();
    }

    // Clear non-admin (mock) user data
    setMockUser(null);
    setMockToken(null);
    localStorage.removeItem('hris_mock_token');
    localStorage.removeItem('hris_mock_user');

    // Clear admin (SOAP) data from localStorage
    localStorage.removeItem('soap_api_token');
    localStorage.removeItem('soap_api_user');

    // Show logout success message
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  // Return Auth context with separate user states
  return (
    <AuthContext.Provider value={{
      user: mockUser || soapUser,  // Use mock user or SOAP user (for admin)
      token: mockToken || soapUser?.token,  // Use mock token or SOAP token (for admin)
      login,
      logout: logoutHandler,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
