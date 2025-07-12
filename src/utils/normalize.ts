/* eslint-disable @typescript-eslint/no-explicit-any */
import { AttendanceRecord } from "@/types/attendance";

export const normalizeAttendanceRecord = (record: any): AttendanceRecord => ({
  id: record._id,
  employeeId: record.user,
  employeeName: record.userName ?? '',
  date: record.date,
  shift: record.shift as 'day' | 'night',
  checkIn: record.checkIn,
  checkOut: record.checkOut,
  status: record.status as 'present' | 'late' | 'absent' | 'checked-in',
  hoursWorked: record.hoursWorked ?? undefined,
  biometricId: record.biometryId,
});
