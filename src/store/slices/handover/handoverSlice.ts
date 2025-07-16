import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handoverApi } from './handoverApi';

export interface HandoverReport {
  _id?: string;
  user: string;
  teamLead: string;
  date: string;
  shift: 'Day' | 'Night';
  summary: string;
  pdfFile?: string;
  status: 'Pending' | 'Approved' | 'Rejected'; // assuming enum values
  note?: string;
  createdAt: string;
}

interface HandoverState {
  isLoading: boolean;
  error: string | null;
  reports: HandoverReport[];
  selectedReport: HandoverReport | null;
}

const initialState: HandoverState = {
  isLoading: false,
  error: null,
  reports: [],
  selectedReport: null,
};

const handoverSlice = createSlice({
  name: 'handover',
  initialState,
  reducers: {
    setSelectedReport(state, action: PayloadAction<HandoverReport | null>) {
      state.selectedReport = action.payload;
    },
    clearHandoverState(state) {
      state.selectedReport = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Handover
    builder
      .addMatcher(handoverApi.endpoints.createHandover.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(handoverApi.endpoints.createHandover.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.push(action.payload.data);
      })
      .addMatcher(handoverApi.endpoints.createHandover.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to create handover report';
      });

    // Get My Reports
    builder
      .addMatcher(handoverApi.endpoints.getMyHandoverReports.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(handoverApi.endpoints.getMyHandoverReports.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload.data;
      })
      .addMatcher(handoverApi.endpoints.getMyHandoverReports.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch reports';
      });

    // Approve
    builder
      .addMatcher(handoverApi.endpoints.approveHandoverReport.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(handoverApi.endpoints.approveHandoverReport.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        const index = state.reports.findIndex((r) => r._id === updated._id);
        if (index !== -1) state.reports[index] = updated;
      })
      .addMatcher(handoverApi.endpoints.approveHandoverReport.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to approve report';
      });

    // Reject
    builder
      .addMatcher(handoverApi.endpoints.rejectHandoverReport.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(handoverApi.endpoints.rejectHandoverReport.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        const index = state.reports.findIndex((r) => r._id === updated._id);
        if (index !== -1) state.reports[index] = updated;
      })
      .addMatcher(handoverApi.endpoints.rejectHandoverReport.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to reject report';
      });
  },
});

export const { setSelectedReport, clearHandoverState } = handoverSlice.actions;
export default handoverSlice.reducer;
