/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useBiometryCheckInMutation,
  useBiometryCheckOutMutation,
  useManualCheckInMutation,
  useManualCheckOutMutation,
  useGetMyAttendanceHistoryQuery,
  useAdminAttendanceReportQuery,
  useGetMyAttendanceStatsQuery,
  useGetCompanyAttendanceSummaryQuery,
  useExportAttendanceExcelQuery,
} from "@/store/slices/attendance/attendanceApi";
import { toast } from "../use-toast";
import { AttendanceContextType } from "@/types/attendance";
import { setLoading } from "@/store/slices/attendance/attendanceSlice";

export const useReduxAttendance = (): AttendanceContextType => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Attendance History & Stats
  const { data: attendanceRecords, isLoading: historyLoading, error: historyError, refetch: refetchAttendanceHistory } = useGetMyAttendanceHistoryQuery(undefined, {
    skip: !user, // Skip if no user
  });

  const { data: attendanceStats, isLoading: statsLoading, error: statsError } = useGetMyAttendanceStatsQuery(undefined, {
    skip: !user, // Skip if no user
  });

  const { data: companyAttendanceSummary, isLoading: summaryLoading, error: summaryError } = useGetCompanyAttendanceSummaryQuery(undefined, {
    skip: !user, // Skip if no user
  });

  // Admin Reports & Export
  const { data: adminAttendanceReport, isLoading: adminReportLoading, error: adminReportError } = useAdminAttendanceReportQuery(undefined, {
    skip: !user || !user.role || user.role !== "admin", // Skip if no user or user is not admin
  });

  const { data: exportedAttendanceData, isLoading: exportLoading, error: exportError } = useExportAttendanceExcelQuery(undefined, {
    skip: !user || !user.role || user.role !== "admin", // Skip if no user or user is not admin
  });

  // Mutations for Check-In/Check-Out
  const [biometryCheckIn, { isLoading: biometryCheckInLoading }] = useBiometryCheckInMutation();
  const [biometryCheckOut, { isLoading: biometryCheckOutLoading }] = useBiometryCheckOutMutation();
  const [manualCheckIn, { isLoading: manualCheckInLoading }] = useManualCheckInMutation();
  const [manualCheckOut, { isLoading: manualCheckOutLoading }] = useManualCheckOutMutation();

  // Check-In/Check-Out Handlers
  const handleBiometryCheckIn = async (data: any): Promise<boolean> => {
    try {
      await biometryCheckIn(data).unwrap();
      toast({ title: "Biometry Check-In Successful" });
      refetchAttendanceHistory();
      return true; // Return true if successful
    } catch (error: any) {
      toast({
        title: "Biometry Check-In Error",
        description: error?.message || "Failed to check-in via biometry",
        variant: "destructive",
      });
      return false; // Return false if failed
    }
  };

  const handleBiometryCheckOut = async (data: any): Promise<boolean> => {
    try {
      await biometryCheckOut(data).unwrap();
      toast({ title: "Biometry Check-Out Successful" });
      refetchAttendanceHistory();
      return true; // Return true if successful
    } catch (error: any) {
      toast({
        title: "Biometry Check-Out Error",
        description: error?.message || "Failed to check-out via biometry",
        variant: "destructive",
      });
      return false; // Return false if failed
    }
  };

  const handleManualCheckIn = async (data: any): Promise<boolean> => {
    console.log("DATAhandleManualCheckIn", data)
    dispatch(setLoading(false))
    try {
      await manualCheckIn(data).unwrap();
      toast({ title: "Manual Check-In Successful" });
      // refetchAttendanceHistory();
      return true; // Return true if successful
    } catch (error: any) {
      toast({
        title: "Manual Check-In Error",
        description: error?.message || "Failed to check-in manually",
        variant: "destructive",
      });
      return false; // Return false if failed
    }finally{
      dispatch(setLoading(false))
    }
  };

  const handleManualCheckOut = async (data: any): Promise<boolean> => {
    try {
      await manualCheckOut(data).unwrap();
      toast({ title: "Manual Check-Out Successful" });
      refetchAttendanceHistory();
      return true; // Return true if successful
    } catch (error: any) {
      toast({
        title: "Manual Check-Out Error",
        description: error?.message || "Failed to check-out manually",
        variant: "destructive",
      });
      return false; // Return false if failed
    }
  };

  // Export Excel handler (Admin only)
  const handleExportAttendance = async (): Promise<boolean> => {
    try {
      await exportedAttendanceData?.unwrap();
      toast({ title: "Attendance data exported successfully!" });
      return true; // Return true if successful
    } catch (error: any) {
      toast({
        title: "Export Error",
        description: error?.message || "Failed to export attendance data",
        variant: "destructive",
      });
      return false; // Return false if failed
    }
  };

  

  return {
    attendanceRecords,
    attendanceStats,
    companyAttendanceSummary,
    adminAttendanceReport,
    exportedAttendanceData,
    isLoading: {
      historyLoading,
      statsLoading,
      summaryLoading,
      adminReportLoading,
      exportLoading,
      biometryCheckInLoading,
      biometryCheckOutLoading,
      manualCheckInLoading,
      manualCheckOutLoading,
    },
    error: {
      historyError,
      statsError,
      summaryError,
      adminReportError,
      exportError,
    },
    handleBiometryCheckIn,
    handleBiometryCheckOut,
    handleManualCheckIn,
    handleManualCheckOut,
    handleExportAttendance,
    refetchAttendanceHistory,
    // refetchAttendanceStats,  // Add refetchAttendanceStats here
    // refetchCompanySummary,  // Add refetchCompanySummary here
  };
};
