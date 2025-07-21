/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { apiSlice } from "@/store/slices/auth/apiSlice";

export const handoverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create Handover Report
    createHandover: builder.mutation({
      query: (file: FormData) => ({
        url: '/api/handover/create',
        method: 'POST',
        body: file,
        credentials: 'include' as const,
         headers: {

        },
      }),
    }),

    // Get My Reports
    getMyHandoverReport: builder.query({
      query: () => ({
        url: '/api/handover/report',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),

    // team get by department  Reports
    teamGetHandoverReportByDepartment: builder.query({
      query: () => ({
        url: '/api/handover/reports',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),

    // team get by department  Reports
    // handoverApi.ts
    deleteHandoverById: builder.mutation({
      query: (id: string) => ({
        url: `/api/handover/report/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),



  }),
});

export const {
  useCreateHandoverMutation,
  useGetMyHandoverReportQuery,
  useTeamGetHandoverReportByDepartmentQuery,
   useDeleteHandoverByIdMutation
} = handoverApi;
