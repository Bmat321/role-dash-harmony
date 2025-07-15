/* eslint-disable @typescript-eslint/no-explicit-any */
import { AttendanceRecord } from "@/types/attendance";
import { LeaveRequest } from "@/types/leave";

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

// utils/normalizeLeaveRequest.ts


// export const normalizeLeaveRequest = (item: any): LeaveRequest => {
//   console.log("Normalizing leave request item:", item);

//   return {
//     id: item._id,
//     employeeId: item.user?._id ?? '',
//     employeeName: `${item.user?.firstName ?? ''} ${item.user?.lastName ?? ''}`.trim(),
//     type: item.type,
//     startDate: item.startDate,
//     endDate: item.endDate,
//     days: item.daysCount,
//     reason: item.reason,
//     status: item.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
//     teamLead: item.teamLead,
//     appliedDate: item.createdAt,
//     teamLeadId: item.teamLead,
//     teamLeadName: '', // You can populate this later if needed
//   };
// };




export const normalizeLeaveRequest = (item: any): LeaveRequest => {
  const latestReview = item.reviewTrail?.[item.reviewTrail.length - 1] ?? null;

  
  const getDate = (val: any) => {
    if (!val) return '';
    const d = val?.$date ?? val;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? '' : parsed.toISOString();
  };
  return {
    id: item._id?.$oid ?? item._id ?? item.id ?? '',
    employeeId: item.user?._id?.$oid ?? item.user?._id ?? item.employeeId ?? '',
    employeeName:
      item.user?.firstName || item.user?.lastName
        ? `${item.user?.firstName ?? ''} ${item.user?.lastName ?? ''}`.trim()
        : item.employeeName ?? '',
    type: item.type,
    startDate: getDate(item.startDate),
    endDate: getDate(item.endDate),
    days: item.days ?? item.daysCount ?? 0,
    reason: item.reason,
    status: (item.status ?? 'pending').toLowerCase(),
    teamLead: item.teamLead?._id ?? item.teamLead ?? '',
    teamLeadId: item.teamLead?._id ?? item.teamLead ?? item.teamLeadId ?? '',
    teamLeadName:
      item.teamLead?.firstName || item.teamLead?.lastName
        ? `${item.teamLead?.firstName ?? ''} ${item.teamLead?.lastName ?? ''}`.trim()
        : item.teamLeadName ?? '',
    appliedDate: getDate(item.createdAt ?? item.appliedDate),

    approvedBy: latestReview?.reviewer ?? item.approvedBy ?? '',
    approvedDate: getDate(latestReview?.date ?? item.approvedDate),
    comments: latestReview?.note ?? item.comments ?? '',
    reviewTrail:
      item.reviewTrail?.map((r: any) => ({
        reviewer: r.reviewer?.$oid ?? r.reviewer,
        role: r.role,
        action: r.action?.toLowerCase(),
        date: getDate(r.date),
        note: r.note,
      })) ?? [],
  };
};
