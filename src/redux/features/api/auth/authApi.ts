
import {apiSlice} from '../apiSlice';
import {
  userLoggedIn,
  userLogout,
  userRegistration,
//   userRequestPassword,
//   userTwo2fa,
} from './authSlice';
// import {logger} from 'react-native-logs';


// interface RegistrationData {}
export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
 
    activation: builder.mutation({
      query: ({activation_token, activation_code}) => ({
        url: '/api/auth/activate-user',
        method: 'POST',
        body: {activation_token, activation_code},
      }),
    }),

    login: builder.mutation({
      query: ({email, password}) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: {email, password},

        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const result = await queryFulfilled;
          console.log("result", result)

          const {token} = result.data.data;
          dispatch(
            userLoggedIn({
              accessToken: token,
             
            }),
          );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('LOGIN ERROR', error);
          }
        }
      },
    }),


    verify2FA: builder.mutation({
      query: ({email, code}) => ({
        url: '/api/auth/verify-2fa',
        method: 'POST',
        body: {email, code},
        credentials: 'include' as const,
      }),
    }),

 
  }),
});

export const {
//   useRegisterMutation,
  useActivationMutation,
  useLoginMutation,

  useVerify2FAMutation,

} = authApi;
