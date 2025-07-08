
<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
// import useSoapAuth from '@/hooks/useSoapAuth';  // Admin login hook for SOAP API

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for HR, Manager, and Employee (non-admin)
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@hris.com': {
    password: 'hr123',
    user: {
      id: '2', email: 'admin@hris.com', firstName: 'Admin', lastName: 'Admin', role: 'Admin', department: 'Admin', position: 'Admin', status: 'active', token: '',
      companyId: '',
      isAuthenticated: false,
      isLoading: false
    },
  },
  'hr@hris.com': {
    password: 'hr123',
    user: {
      id: '2', email: 'hr@hris.com', firstName: 'Sarah', lastName: 'Johnson', role: 'HR', department: 'HR', position: 'HR Manager', status: 'active', token: '',
      companyId: '',
      isAuthenticated: false,
      isLoading: false
    },
  },
  'manager@hris.com': {
    password: 'manager123',
    user: {
      id: '3', email: 'manager@hris.com', firstName: 'Mike', lastName: 'Wilson', role: 'Manager', department: 'Engineering', position: 'Lead', status: 'active', token: '',
      companyId: '',
      isAuthenticated: false,
      isLoading: false
    },
  },
  'employee@hris.com': {
    password: 'emp123',
    user: {
      id: '4', email: 'employee@hris.com', firstName: 'Jane', lastName: 'Doe', role: 'Employee', department: 'Engineering', position: 'Developer', status: 'active', token: '',
      companyId: '',
      isAuthenticated: false,
      isLoading: false
    },
  },
};

=======
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useReduxAuth } from '@/hooks/useReduxAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

>>>>>>> 5aa0faabc1d67921d25488d096652884c1bd8e7c
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduxAuth = useReduxAuth();

  // Add error boundary to prevent crashes
  if (!reduxAuth) {
    console.error('useReduxAuth returned undefined');
    return <div>Loading authentication...</div>;
  }

<<<<<<< HEAD
  // Login method: Handles Admin and Non-Admin (Mock) separately
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const isAdmin = email === 'admin@hris.com';

    try {
      if (isAdmin) {
        // Call SOAP API login for Admin (uncomment when SOAP logic is ready)
        // await soapLogin(email, password);
        
        // Mock success for SOAP login (you can replace with actual API call)
        setMockUser({
          id: '1',
          email: 'admin@hris.com',
          firstName: 'Admin',
          lastName: 'Admin',
          role: 'Admin',
          department: 'Admin',
          position: 'Admin',
          status: 'active',
          token: `admin_token_${Date.now()}`,
          isAuthenticated: false,
          isLoading: false,
          companyId: "comapnyId",

        });
        
        setMockToken(`admin_token_${Date.now()}`);
        localStorage.setItem('hris_mock_token', `admin_token_${Date.now()}`);
        localStorage.setItem('hris_mock_user', JSON.stringify({
          id: '1',
          email: 'admin@hris.com',
          firstName: 'Admin',
          lastName: 'Admin',
          role: 'admin',
          department: 'Admin',
          position: 'Admin',
          status: 'active',
          token: `admin_token_${Date.now()}`
        }));

        toast({
          title: 'Login Successful',
          description: `Welcome, Admin!`,
        });

        return true;
      } else {
        // Mock login for HR, Manager, Employee (non-admin)
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay for mock login
        const mockData = mockUsers[email];

        if (mockData && mockData.password === password) {
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
  }, []);

  // Separate logout for Admin and Mock users
  const logoutHandler = () => {
    // if (soapUser?.role === 'admin') {
    //   // Call SOAP API logout for Admin
    //   soapLogout();
    // }

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
=======
>>>>>>> 5aa0faabc1d67921d25488d096652884c1bd8e7c
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
