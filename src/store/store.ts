
// import { configureStore } from '@reduxjs/toolkit';
// import { authApi } from './slices/auth/authApi';
// import { apiSlice } from './slices/auth/apiSlice';
// import authReducer, { initializeFromStorage } from './slices/auth/authSlice';
// import profileReducer from './slices/profile/profileSlice';
// import attendanceReducer from './slices/attendance/attendanceSlice';
// import leaveReducer from './slices/leave/leaveSlice';
// // import storage from 'redux-persist/lib/storage'; 
// // import { persistReducer, persistStore } from 'redux-persist';


// // const persistConfig = {
// //   key: 'root',
// //   storage,
// //   whitelist: ['auth'], // Only persist the 'auth' slice
// // };


// // Create a persisted reducer for auth slice
// // const persistedAuthReducer = persistReducer(persistConfig, authReducer);
// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     profile: profileReducer,
//     attendance: attendanceReducer,
//     leave: leaveReducer,
//     [authApi.reducerPath]: authApi.reducer,
//   },
//   devTools: process.env.NODE_ENV !== 'production',
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });
// // Persist the store and create the persistor
// // export const persistor = persistStore(store);


// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { apiSlice } from './slices/auth/apiSlice';
import authReducer from './slices/auth/authSlice';
import leaveReducer from './slices/leave/leaveSlice';
import attendanceReducer from './slices/attendance/attendanceSlice'
import profileReducer from './slices/profile/profileSlice'

// 1. Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>; // ✅ explicitly type it

// 2. Create persisted reducer with type
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'leave'],
};

const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

// 3. Configure store with safe middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

// 4. App-wide types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
