import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '@/types/auth';
import { authApi } from './authApi';
import { tokenUtils } from '@/utils/tokenUtils';
import { set } from 'date-fns';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  code?: string | null; // Optional 2FA code or similar field
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  code: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
      logout: (state) => {
      state.user = null;
      state.token = null;
      tokenUtils.clearAll();
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    

    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      tokenUtils.setToken(action.payload.token);
      tokenUtils.setUser(JSON.stringify(action.payload.user));
    },
      initializeFromStorage: (state) => {
      const token = tokenUtils.getToken();
      const userData = tokenUtils.getUser();
      if (token && userData) {
        try {
          state.user = JSON.parse(userData);
          state.token = token;
          state.isAuthenticated = true;
        } catch {
          tokenUtils.clearAll();
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login matchers
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        tokenUtils.setToken(action.payload.token);
        state.user = null;
        // Optionally store user:
        // localStorage.setItem('hris_mock_user', JSON.stringify(action.payload.user));
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Login failed';
      });

    // 2FA matchers
    builder
      .addMatcher(authApi.endpoints.verify2fa?.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.verify2fa?.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        tokenUtils.setToken(action.payload.token);
        tokenUtils.setUser(JSON.stringify(action.payload.user));
       
        // Optionally store user:
        // localStorage.setItem('hris_mock_user', JSON.stringify(action.payload.user));
      })
      .addMatcher(authApi.endpoints.verify2fa?.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || '2FA verification failed';
      });
  },
});

export const { logout, clearError,setIsLoading, setError, setCredentials, initializeFromStorage } = authSlice.actions;
export default authSlice.reducer;
