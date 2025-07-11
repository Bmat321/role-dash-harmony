
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  useLoginMutation, 
  // useRegisterMutation, 
  useResetPasswordMutation,
  useVerify2FAMutation,
} from '@/store/slices/authApi';
import { 
  logout as logoutAction, 
  clearError, 
  setCredentials,
  initializeFromStorage 
} from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';
import { AuthContextType, User } from '@/types/auth';

export const useReduxAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  console.log("User", user)
  
  const [loginMutation] = useLoginMutation();
  // const [registerMutation] = useRegisterMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [verify2FA] = useVerify2FAMutation()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      dispatch(initializeFromStorage());
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
    }
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For non-mock users, use the SOAP API
      const result = await loginMutation({ email, password }).unwrap();
      console.log("result", result)
      toast({
        title: '2FA code sent to your email',
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const verify2fa = async (email: string, code: string): Promise<boolean> => {
    try {
      // Check if it's a mock user first
      const mockUsers: Record<string, { password: string; user: User }> = {
        'admin@hris.com': {
          password: 'Admin@123', // Fixed: was 'hr123', should be 'Admin@123'
          user: {
            id: '1',
            email: 'admin@hris.com',
            firstName: 'Admin',
            lastName: 'Admin',
            role: 'admin',
            department: 'Admin',
            position: 'Admin',
            status: 'active',
            token: `admin_token_${Date.now()}`,
            companyId: ''
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
            token: `hr_token_${Date.now()}`,
            companyId: ''
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
            token: `manager_token_${Date.now()}`,
            companyId: ''
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
            token: `emp_token_${Date.now()}`,
            companyId: ''
          },
        },
      };

      const mockData = mockUsers[email];
      if (mockData && mockData.password === code) {
        dispatch(setCredentials({ user: mockData.user, token: mockData.user.token }));
        toast({
          title: 'Login Successful',
          description: `Welcome, ${mockData.user.firstName}!`,
        });
        return true;
      }

      // For non-mock users, use the SOAP API
      const result = await verify2FA({ email, code }).unwrap();
      toast({
        title: 'Login Successful',
        description: `Welcome, ${result.user.firstName}!`,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  // const register = async (userData: {
  //   username: string;
  //   email: string;
  //   password: string;
  // }): Promise<boolean> => {
  //   try {
  //     await registerMutation(userData).unwrap();
  //     toast({
  //       title: 'Registration Successful',
  //       description: 'You can now login with your credentials',
  //     });
  //     return true;
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'Registration failed';
  //     toast({
  //       title: 'Registration Error',
  //       description: errorMessage,
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
  // };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await resetPasswordMutation({ email }).unwrap();
      toast({
        title: 'Password Reset Initiated',
        description: 'Check your email for further instructions',
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
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
    try {
      dispatch(logoutAction());
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.some(role => user.role.includes(role));
  };

  return {
    user,
    token: user?.token,
    isLoading,
    error: error || '',
    login,
    // register,
    resetPassword,
    verify2fa,
    logout,
    hasRole,
    clearError: () => dispatch(clearError()),
  };
};
