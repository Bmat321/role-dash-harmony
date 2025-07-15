/* eslint-disable @typescript-eslint/no-explicit-any */
import { AttendanceRecord } from '@/types/attendance'; // Assuming your types are defined
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { attendanceApi } from './attendanceApi';
import { normalizeAttendanceRecord } from '@/utils/normalize';
import { shiftUtils } from '@/utils/attendanceHelpers';

interface AttendanceState {
  isLoading: boolean;
  error: string | null;
  records: AttendanceRecord[];
  currentRecord: AttendanceRecord | null;
  stats: any; // Stats data
  companySummary: any; // Company-wide attendance summary
  activeTab: string; // New state for active tab
  selectedShift: 'day' | 'night'; // New state for selected shift
  isCheckedIn: boolean; // New state for checked-in status
  isClocking: boolean; 
  currentSession: { shift: 'day' | 'night'; checkInTime: string } | null;
}

const initialState: AttendanceState = {
  isLoading: false,
  error: null,
  records: [],
  currentRecord: null,
  stats: null,
  companySummary: null,
  isClocking: false,
  activeTab: 'clock-in', // Default active tab
  selectedShift: shiftUtils.get(),  // Default selected shift
  isCheckedIn: false, // Default checked-in status
  currentSession: null, // Default current session

};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
 reducers: {
    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setIsClocking(state, action: PayloadAction<boolean>) {
  state.isClocking = action.payload;
},

setSelectedShift(state, action: PayloadAction<'day' | 'night'>) {
  state.selectedShift = action.payload;
  shiftUtils.set(action.payload); // persist
},

clearSelectedShift(state) {
  state.selectedShift = 'day';
  shiftUtils.clear(); // clear on checkout/reset
},

    // Set attendance records
    setRecords(state, action: PayloadAction<AttendanceRecord[]>) {
      state.records = action.payload;
    },
    // Set current record
    setCurrentRecord(state, action: PayloadAction<AttendanceRecord | null>) {
      state.currentRecord = action.payload;
    },
    // Set attendance stats
    setStats(state, action: PayloadAction<any>) {
      state.stats = action.payload;
    },
    // Set company attendance summary
    setCompanySummary(state, action: PayloadAction<any>) {

      state.companySummary = action.payload;
    },
    // Reset the attendance state
    resetAttendanceState(state) {
      state.records = [];
      state.currentRecord = null;
      state.isLoading = false;
      state.error = null;
      state.stats = null;
      state.companySummary = null;
      state.activeTab = 'clock-in'; 
      state.selectedShift = 'day';
      state.isCheckedIn = false; 
      state.currentSession = null; 
    },
    // Set active tab
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    // Set selected shift
    // setSelectedShift(state, action: PayloadAction<'day' | 'night'>) {
    //   state.selectedShift = action.payload;
    // },
    // Set checked-in status
    setIsCheckedIn(state, action: PayloadAction<boolean>) {
      state.isCheckedIn = action.payload;
    },
    // Set current session details
    setCurrentSession(state, action: PayloadAction<{ shift: 'day' | 'night'; checkInTime: string } | null>) {
      state.currentSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get My Attendance History
    builder
      .addMatcher(attendanceApi.endpoints.getMyAttendanceHistory.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(attendanceApi.endpoints.getMyAttendanceHistory.matchFulfilled, (state, action) => {
        state.isLoading = false;
         const records = action.payload.data.data.map(normalizeAttendanceRecord);
        state.records = records;

        const active = records.find(record => record.checkIn && !record.checkOut);
        state.currentRecord = active || null;
        state.isCheckedIn = !!active;
      })
      .addMatcher(attendanceApi.endpoints.getMyAttendanceHistory.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch attendance history';
      });

    // // Get My Attendance Stats
    // builder
    //   .addMatcher(attendanceApi.endpoints.getMyAttendanceStats.matchPending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addMatcher(attendanceApi.endpoints.getMyAttendanceStats.matchFulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.stats = action.payload.data; // Assuming payload contains stats data
    //   })
    //   .addMatcher(attendanceApi.endpoints.getMyAttendanceStats.matchRejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.error?.message || 'Failed to fetch attendance stats';
    //   });

    // Get Company Attendance Summary
    builder
      .addMatcher(attendanceApi.endpoints.getCompanyAttendanceSummary.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(attendanceApi.endpoints.getCompanyAttendanceSummary.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.companySummary = action.payload.data.data; // Assuming payload contains company summary data
      })
      .addMatcher(attendanceApi.endpoints.getCompanyAttendanceSummary.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch company attendance summary';
      });

    // Biometry Check-In
    builder
      .addMatcher(attendanceApi.endpoints.biometryCheckIn.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(attendanceApi.endpoints.biometryCheckIn.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const newRecord: AttendanceRecord = action.payload.data;
        state.records.push(newRecord); // Add new check-in record
        state.currentRecord = newRecord; // Optionally, update current record
      })
      .addMatcher(attendanceApi.endpoints.biometryCheckIn.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to check-in via biometry';
      });

    // Biometry Check-Out
    builder
      .addMatcher(attendanceApi.endpoints.biometryCheckOut.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(attendanceApi.endpoints.biometryCheckOut.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const updatedRecord: AttendanceRecord = action.payload.data;
        const index = state.records.findIndex((record) => record.id === updatedRecord.id);
        if (index !== -1) {
          state.records[index] = updatedRecord; // Update record
        }
        state.currentRecord = updatedRecord; // Optionally, update current record
        
      })
      .addMatcher(attendanceApi.endpoints.biometryCheckOut.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to check-out via biometry';
      });

    // Manual Check-In
    builder
      .addMatcher(attendanceApi.endpoints.manualCheckIn.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
        .addMatcher(attendanceApi.endpoints.manualCheckIn.matchFulfilled, (state, action) => {
        state.isLoading = false;
     
        
        const newRecord = normalizeAttendanceRecord(action.payload.data.data);

        state.records.push(newRecord);
        state.currentRecord = newRecord;
        state.isCheckedIn = true;
      })
      .addMatcher(attendanceApi.endpoints.manualCheckIn.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to check-in manually';
      });

    // Manual Check-Out
    builder
      .addMatcher(attendanceApi.endpoints.manualCheckOut.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(attendanceApi.endpoints.manualCheckOut.matchFulfilled, (state, action) => {
        state.isLoading = false;

        const updatedRecord = normalizeAttendanceRecord(action.payload.data.data);

        const index = state.records.findIndex((record) => record.id === updatedRecord.id);
        if (index !== -1) {
          state.records[index] = updatedRecord;
        } else {
          state.records.push(updatedRecord); // Optional fallback
        }

        state.currentRecord = updatedRecord;
        state.isCheckedIn = false;
      })

      .addMatcher(attendanceApi.endpoints.manualCheckOut.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to check-out manually';
      });
  },
});

export const {
  setLoading,
  setError,
  setRecords,
  setCurrentRecord,
  setStats,
  setCompanySummary,
  resetAttendanceState,
  setActiveTab,
  setSelectedShift,
  setIsCheckedIn,
  setCurrentSession,
  clearSelectedShift,
  setIsClocking
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
