/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { apiSlice } from "../auth/apiSlice";

export const handoverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create Handover Report
    createHandover: builder.mutation({
      query: (file: FormData) => ({
        url: '/api/handover',
        method: 'POST',
        body: file,
        credentials: 'include' as const,
        // headers will be auto-handled for FormData
      }),
    }),

    // Get My Reports
    getMyHandoverReports: builder.query({
      query: () => ({
        url: '/api/handover/my-reports',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),

    // Approve Report
    approveHandoverReport: builder.mutation({
      query: (id: string) => ({
        url: `/api/handover/${id}/approve`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),

    // Reject Report
    rejectHandoverReport: builder.mutation({
      query: (id: string) => ({
        url: `/api/handover/${id}/reject`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),

  }),
});

export const {
  useCreateHandoverMutation,
  useGetMyHandoverReportsQuery,
  useApproveHandoverReportMutation,
  useRejectHandoverReportMutation,
} = handoverApi;
