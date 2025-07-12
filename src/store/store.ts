
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './slices/authApi';
import authReducer, { initializeFromStorage } from './slices/authSlice';
import profileReducer from './slices/profile/profileSlice';
import attendanceReducer from './slices/attendance/attendanceSlice';
import { apiSlice } from './slices/apiSlice';
// import storage from 'redux-persist/lib/storage'; 
// import { persistReducer, persistStore } from 'redux-persist';


// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'], // Only persist the 'auth' slice
// };


// Create a persisted reducer for auth slice
// const persistedAuthReducer = persistReducer(persistConfig, authReducer);
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    attendance: attendanceReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
// Persist the store and create the persistor
// export const persistor = persistStore(store);
store.dispatch(initializeFromStorage());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
