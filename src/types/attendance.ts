/* eslint-disable @typescript-eslint/no-explicit-any */

import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// export interface AttendanceRecord {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   date: string;
//   clockIn?: string;
//   clockOut?: string;
//   breakStart?: string;
//   breakEnd?: string;
//   totalHours?: number;
//   status: 'present' | 'absent' | 'late' | 'partial' | 'checked-in';
//   biometricId?: string;
//   notes?: string;
// }

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: 'day' | 'night';
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'checked-in';
  hoursWorked?: number;
  biometricId?: string;
}
export interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  averageHours: number;
  attendanceRate: number;
}

export interface CompanySummaryData {
  totalEmployees: number;
  dayShiftPresent: number;
  nightShiftPresent: number;
  attendanceRate: number; // e.g., 0.94 for 94%
}
export interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];  
  attendanceStats: AttendanceStats | null;  
  companyAttendanceSummary: any | null;  
  adminAttendanceReport: any | null;  
  exportedAttendanceData: any | null;  

  isLoading: {
    historyLoading: boolean;
    statsLoading: boolean;
    summaryLoading: boolean;
    adminReportLoading: boolean;
    exportLoading: boolean;
    biometryCheckInLoading: boolean;
    biometryCheckOutLoading: boolean;
    manualCheckInLoading: boolean;
    manualCheckOutLoading: boolean;
  };

  error: {
    historyError: string | null | FetchBaseQueryError | SerializedError | FetchBaseQueryError | SerializedError;
    statsError: string | null | FetchBaseQueryError | SerializedError;
    summaryError: string | null | FetchBaseQueryError | SerializedError;
    adminReportError: string | null | FetchBaseQueryError | SerializedError;
    exportError: string | null | FetchBaseQueryError | SerializedError;
  };

  handleBiometryCheckIn: (data: any) => Promise<boolean>;
  handleBiometryCheckOut: (data: any) => Promise<boolean>;
  handleManualCheckIn: (data: any) => Promise<boolean>;
  handleManualCheckOut: (data: any) => Promise<boolean>;
  handleExportAttendance: () => Promise<boolean>;

  refetchAttendanceHistory: () => void;
  // refetchAttendanceStats: () => void;
  // refetchCompanySummary: () => void;
}
