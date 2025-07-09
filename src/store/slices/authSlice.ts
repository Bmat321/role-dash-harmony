import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '@/types/auth';
import { authApi } from './authApi';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  code?: string | null; // Optional 2FA code or similar field
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  code: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('hris_mock_token');
      localStorage.removeItem('hris_mock_user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('hris_mock_token', action.payload.token);
    },
    initializeFromStorage: (state) => {
      const token = localStorage.getItem('hris_mock_token');
      const userData = localStorage.getItem('hris_mock_user');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          state.user = user;
          state.token = token;
        } catch {
          localStorage.removeItem('hris_mock_token');
          localStorage.removeItem('hris_mock_user');
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
        localStorage.setItem('hris_mock_token', action.payload.token);
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
        localStorage.setItem('hris_mock_token', action.payload.token);
        // Optionally store user:
        // localStorage.setItem('hris_mock_user', JSON.stringify(action.payload.user));
      })
      .addMatcher(authApi.endpoints.verify2fa?.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || '2FA verification failed';
      });
  },
});

export const { logout, clearError, setCredentials, initializeFromStorage } = authSlice.actions;
export default authSlice.reducer;
