import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./features/api/auth/authSlice";
import { apiSlice } from "./features/api/apiSlice";



const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>    
    getDefaultMiddleware({
      immutableCheck: false, // Disable the middleware
      // serializableCheck: {
      //   ignoredActions: ['campaign/userCreateCampaign'],
      //   ignoredPaths: ['campaign.startDate', 'campaign.endDate'],        
        
      // },
    }).concat(apiSlice.middleware),
});


const initializeApp = async () => {

  // await store.dispatch(
  //   apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
  // );
};

initializeApp();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
