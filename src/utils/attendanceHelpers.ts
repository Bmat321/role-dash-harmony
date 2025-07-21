import { AttendanceRecord } from "@/types/attendance";
import { Sun, Moon } from "lucide-react";


const SHIFT_KEY = 'selectedShift';

/**
 * Determines if the user has checked in or out for a given shift today.
 */
export const getShiftClockStatus = (
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

 export const getShiftInfo = (shift: 'day' | 'night') => {
    return shift === 'day' 
      ? { time: '8:30 AM - 5:00 PM', icon: Sun, color: 'bg-yellow-100 text-yellow-800' }
      : { time: '4:00 PM - 5:00 AM', icon: Moon, color: 'bg-purple-100 text-purple-800' };
  };


 export const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



export const shiftUtils = {
  set(shift: 'day' | 'night') {
    localStorage.setItem(SHIFT_KEY, shift);
  },
  get(): 'day' | 'night' {
    const stored = localStorage.getItem(SHIFT_KEY);
    return stored === 'night' ? 'night' : 'day';
  },
  clear() {
    localStorage.removeItem(SHIFT_KEY);
  },
};