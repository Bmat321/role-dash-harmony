
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useResetPasswordMutation,
} from '@/store/slices/authApi';
import { 
  logout as logoutAction, 
  clearError, 
  setCredentials,
  initializeFromStorage 
} from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';

export const useReduxAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, error } = useAppSelector((state) => state.auth);
  
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if it's a mock user first
      const mockUsers: Record<string, { password: string; user: any }> = {
        'admin@hris.com': {
          password: 'hr123',
          user: { 
            id: '1', 
            email: 'admin@hris.com', 
            firstName: 'Admin', 
            lastName: 'Admin', 
            role: 'admin', 
            department: 'Admin', 
            position: 'Admin', 
            status: 'active', 
            token: `admin_token_${Date.now()}` 
          },
        },
        'hr@hris.com': {
          password: 'hr123',
          user: { 
            id: '2', 
            email: 'hr@hris.com', 
            firstName: 'Sarah', 
            lastName: 'Johnson', 
            role: 'hr', 
            department: 'HR', 
            position: 'HR Manager', 
            status: 'active', 
            token: `hr_token_${Date.now()}` 
          },
        },
        'manager@hris.com': {
          password: 'manager123',
          user: { 
            id: '3', 
            email: 'manager@hris.com', 
            firstName: 'Mike', 
            lastName: 'Wilson', 
            role: 'manager', 
            department: 'Engineering', 
            position: 'Lead', 
            status: 'active', 
            token: `manager_token_${Date.now()}` 
          },
        },
        'employee@hris.com': {
          password: 'emp123',
          user: { 
            id: '4', 
            email: 'employee@hris.com', 
            firstName: 'Jane', 
            lastName: 'Doe', 
            role: 'employee', 
            department: 'Engineering', 
            position: 'Developer', 
            status: 'active', 
            token: `emp_token_${Date.now()}` 
          },
        },
      };

      const mockData = mockUsers[email];
      if (mockData && mockData.password === password) {
        dispatch(setCredentials({ user: mockData.user, token: mockData.user.token }));
        toast({
          title: 'Login Successful',
          description: `Welcome, ${mockData.user.firstName}!`,
        });
        return true;
      }

      // For non-mock users, use the SOAP API
      const result = await loginMutation({ email, password }).unwrap();
      toast({
        title: 'Login Successful',
        description: `Welcome, ${result.user.firstName}!`,
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      await registerMutation(userData).unwrap();
      toast({
        title: 'Registration Successful',
        description: 'You can now login with your credentials',
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast({
        title: 'Registration Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await resetPasswordMutation({ email }).unwrap();
      toast({
        title: 'Password Reset Initiated',
        description: 'Check your email for further instructions',
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      toast({
        title: 'Password Reset Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const hasRole = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.some(role => user.role.includes(role));
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    resetPassword,
    logout,
    hasRole,
    clearError: () => dispatch(clearError()),
  };
};
