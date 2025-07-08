import { UserState } from '@/types/auth';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';


const initialState: UserState = {
    user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'Admin',
        department: '',
        companyId: '',
        status: 'active',
        token: '',
        isAuthenticated: false,
        isLoading: false
    }
   
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.user.token = action.payload.token;
    },

    userAuthenticated: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean }>
    ) => {
      state.user.isAuthenticated = action.payload.isAuthenticated;
      state.user.isLoading = false;
    },

    userLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.user.isLoading = action.payload.isLoading;
    },

    userLoggedIn: (
      state,
      action: PayloadAction<{
        accessToken?: string;
      }>
    ) => {
      if (action.payload.accessToken) {
        state.user.token = action.payload.accessToken;
      }
    },

    userLogout: state => {
      return initialState;
    },
  },
});

export const {
  userRegistration,
  userLoading,
  userAuthenticated,
  userLoggedIn,
  userLogout,

} = authSlice.actions;

export default authSlice.reducer;
