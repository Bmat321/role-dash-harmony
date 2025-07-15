/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  useLoginMutation, 
  useLogoutUserMutation, 
  useResendPasswordMutation, 
  // useRegisterMutation, 
  useResetPasswordMutation,
  useVerify2faMutation,
} from '@/store/slices/auth/authApi';
import { 
  logout as logoutAction, 
  clearError, 
  setCredentials,
  // initializeFromStorage, 
  setIsLoading
} from '@/store/slices/auth/authSlice';
import { toast } from '@/hooks/use-toast';
import { AuthContextType, User } from '@/types/auth';
import { setFormData } from '@/store/slices/profile/profileSlice';
import { set } from 'date-fns';

export const useReduxAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error , isAuthenticated} = useAppSelector((state) => state.auth);  
  const [loginMutation] = useLoginMutation();
  // const [registerMutation] = useRegisterMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [verify2FA] = useVerify2faMutation()
  const [logoutUser] = useLogoutUserMutation();
  const [resendPassword] =  useResendPasswordMutation()
  
  

  // Initialize auth state from localStorage on mount
  // useEffect(() => {
  //   try {
  //     dispatch(initializeFromStorage());
  //   } catch (error) {
  //     console.error('Error initializing auth from storage:', error);
  //   }
  // }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      const result = await loginMutation({ email, password }).unwrap();      
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
    }finally{
      dispatch(setIsLoading(false))
    }
  };

const verify2fa = async (email: string, code: string): Promise<boolean> => {
  dispatch(setIsLoading(true));

  try {
    const result = await verify2FA({ email, code }).unwrap();
    console.log("result", result)

    dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
    dispatch(setFormData(result.data.user));

    toast({
      title: 'Login Successful',
      description: `Welcome, ${result.data.user.firstName}!`,
    });

    return true;
  } catch (error: any) {

    const errorMessage =
      error?.data?.message || 
      error?.error ||         
      error?.message ||     
      'Login failed';         

    toast({
      title: 'Login Error',
      variant: 'destructive',
    });

    return false;
  } finally {
    dispatch(setIsLoading(false));
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

  const resend2fa = async (email: string): Promise<boolean> => {
    try {
      await resendPassword({ email }).unwrap();
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

const logout = async () => {
  console.log("HIITING")
  try {
    // Call backend logout endpoint and wait for it to finish
    const response = await logoutUser({}).unwrap();

    // Now update the client-side state
    dispatch(logoutAction());

    // Show feedback only after successful logout
    toast({
      title: 'Logged Out',
      description: response?.message || 'You have been successfully logged out.',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Logout failed';
    toast({
      title: 'Logout Error',
      description: errorMessage,
      variant: 'destructive',
    });
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
    isAuthenticated,
    login,
    // register,
    resetPassword,
    resend2fa,
    verify2fa,
    logout,    
    hasRole,
    clearError: () => dispatch(clearError()),
  };
};
