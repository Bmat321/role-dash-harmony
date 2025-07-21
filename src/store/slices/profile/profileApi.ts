/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { apiSlice } from "../auth/apiSlice";



export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    editProfile: builder.mutation({
      query: (data) => ({
        url: '/api/user/me',
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
      // invalidatesTags: ['Profiles'],
    }),

    uploadProfile: builder.mutation({
      query: (file:FormData) => ({
        url: '/api/user/upload',
        method: 'PUT',
        body: file,
        credentials: 'include' as const,
         headers: {
          // No need to manually set Content-Type for FormData
        },
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: '/api/user/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      
    }),

    getAllProfile: builder.query({
      query: () => ({
        url: '/api/user/users',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Profiles'],
    }),

    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `/api/user/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),



    
  }),
});

export const {
useEditProfileMutation,
useUploadProfileMutation,
useGetProfileQuery,
useDeleteProfileMutation,
useGetAllProfileQuery
 
} = profileApi;
