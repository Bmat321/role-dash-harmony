/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { apiSlice } from "./apiSlice";


// Define explicit types for request and response payloads
interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  user: any;
  token: string; 
}

interface ResetPasswordData {
 email: string
}


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // register: builder.mutation<RegistrationData, RegistrationData>({
    //   query: (data) => ({
    //     url: '/api/auth/register',
    //     method: 'POST',
    //     body: data,
    //     credentials: 'include' as const,
    //   }),
    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     try {
    //       const result = await queryFulfilled;
    //       dispatch(
    //         userRegistration({
    //           token: result.data.activationToken,
    //         }),
    //       );
    //     } catch (error) {
    //       if (import.meta.env.NODE_ENV !== 'production') {
    //       }
    //     }
    //   },
    // }),

    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: '/api/auth/activate-user',
        method: 'POST',
        body: { activation_token, activation_code },
      }),
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { email, password },
        credentials: 'include' as const,
      }),

    }),

    requestPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/api/auth/request-password',
        method: 'POST',
        body: { email },
        credentials: 'include' as const,
      }),
    
    }),

    verify2fa: builder.mutation({
      query: ({ email, code }) => ({
        url: '/api/auth/verify-2fa',
        method: 'POST',
        body: { email, code },
        credentials: 'include' as const,
      }),
    
    }),

    resetPassword: builder.mutation({
      query: ({ email }: ResetPasswordData) => ({
        url: '/api/auth/reset-user-password',
        method: 'PUT',
        body: { email },
        credentials: 'include' as const,
      }),
    }),

    resendPassword: builder.mutation({
      query: ({ email }: ResetPasswordData) => ({
        url: '/api/auth/resend-password',
        method: 'POST',
        body: { email },
        credentials: 'include' as const,
      }),
    }),  

    newSetPassword: builder.mutation({
      query: ({ newPassword, passwordConfig, temporaryPassword }) => ({
        url: '/api/auth/set-password',
        method: 'POST',
        body: { newPassword, passwordConfig, temporaryPassword },
        credentials: 'include' as const,
      }),
    }),  

    
    inviteUser: builder.mutation({
      query: (data) => ({
        url: '/api/auth/invite-user',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),

    resendIviteLink: builder.mutation({
      query: (email) => ({
        url: '/api/auth/reset-activation',
        method: 'POST',
        body: email,
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Profiles'],
    }),

    bulkInviteUsers: builder.mutation({
      query: (formData) => ({
        url: '/api/auth/bulk-invite',
        method: 'POST',
        body: formData,
        credentials: 'include' as const,
      }),
    }),

 
    logoutUser: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
        credentials: 'include' as const,
      }),
      
    }),
  }),
});

export const {
  useActivationMutation,
  useLoginMutation,
  useRequestPasswordMutation,
  useResetPasswordMutation,
  useVerify2faMutation,
  useResendPasswordMutation,
  useLogoutUserMutation,
  useInviteUserMutation,
  useBulkInviteUsersMutation,
  useResendIviteLinkMutation,
  useNewSetPasswordMutation
} = authApi;
