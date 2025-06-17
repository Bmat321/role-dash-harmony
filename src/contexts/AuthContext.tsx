
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@hris.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@hris.com',
      name: 'System Administrator',
      role: 'admin',
      department: 'IT',
      position: 'System Admin',
      status: 'active'
    }
  },
  'hr@hris.com': {
    password: 'hr123',
    user: {
      id: '2',
      email: 'hr@hris.com',
      name: 'Sarah Johnson',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager',
      status: 'active'
    }
  },
  'manager@hris.com': {
    password: 'manager123',
    user: {
      id: '3',
      email: 'manager@hris.com',
      name: 'Mike Wilson',
      role: 'manager',
      department: 'Engineering',
      position: 'Team Lead',
      status: 'active'
    }
  },
  'employee@hris.com': {
    password: 'emp123',
    user: {
      id: '4',
      email: 'employee@hris.com',
      name: 'Jane Doe',
      role: 'employee',
      department: 'Engineering',
      position: 'Software Developer',
      status: 'active'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('hris_token');
    const storedUser = localStorage.getItem('hris_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = mockUsers[email];
      if (mockData && mockData.password === password) {
        const mockToken = `jwt_token_${Date.now()}`;
        
        setUser(mockData.user);
        setToken(mockToken);
        
        // Store in localStorage
        localStorage.setItem('hris_token', mockToken);
        localStorage.setItem('hris_user', JSON.stringify(mockData.user));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${mockData.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hris_token');
    localStorage.removeItem('hris_user');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
