// hooks/useShiftClockStatus.ts
import { AttendanceRecord } from "@/types/attendance";

export const useShiftClockStatus = (
  records: AttendanceRecord[],
  selectedShift: 'day' | 'night'
) => {
  const today = new Date().toISOString().split('T')[0];

  const hasCheckedOutToday = records.some(
    (r) => r.date === today && r.shift === selectedShift && !!r.checkOut
  );

  const hasCheckedInToday = records.some(
    (r) => r.date === today && r.shift === selectedShift && !!r.checkIn
  );

  const canClockIn = !hasCheckedInToday && !hasCheckedOutToday;

  return {
    hasCheckedInToday,
    hasCheckedOutToday,
    canClockIn,
  };
};
