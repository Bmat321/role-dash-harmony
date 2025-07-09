
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './slices/authApi';
import authReducer from './slices/authSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
// const initializeApp = async () => {

//   await store.dispatch(
//     apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
//   );
// };

// initializeApp();


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
