/* eslint-disable @typescript-eslint/no-explicit-any */

// export interface LeaveRequest {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   type: 'annual' | 'sick' | 'maternity' | 'compensation';
//   startDate: string;
//   endDate: string;
//   days: number;
//   reason: string;
//   status: 'pending' | 'approved' | 'rejected';
//   teamLead: string
//   appliedDate: string;
//   approvedBy?: string;
//   approvedDate?: string;
//   comments?: string;
//   teamLeadId?: string;
//   teamLeadName?: string;
// }
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'maternity' | 'compensation';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  teamLead: string;
  appliedDate: string;

  // Optional approval trail
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;

  teamLeadId?: string;
  teamLeadName?: string;
  reviewTrail?: {
      reviewer: string;
      role: "teamlead" | "hr" | "md";
      action: "approved" | "rejected";
      date: string;
      note?: string;
  }[];
  // reviewTrail?: {
  //   reviewer: string;
  //   role: string;
  //   action: 'approved' | 'rejected';
  //   date: string;
  //   note?: string;
  // }[];
}

export interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  compensation: { total: number; used: number; remaining: number };
  maternity: { total: number; used: number; remaining: number };
}

export interface TeamLead {
  id: string;
  name: string;
  department: string;
}

export interface TeamLeadResponse {
  success: boolean;
  data: TeamLead[];
  cached: boolean;
}


export interface UseReduxLeaveReturnType {
  leaveApprovalQueue: LeaveRequest[];
  leaveActivityFeed: LeaveRequest[];
  teamlead: TeamLeadResponse;
  isLoading: {
    approvalQueueLoading: boolean;
    activityFeedLoading: boolean;
    creatingLeave: boolean;
    approvingLeave: boolean;
    rejectingLeave: boolean;
    teamleadLoading: boolean
  };

  error: {
    approvalQueueError: any;
    activityFeedError: any;
     teamleadError:any
  };

  handleCreateLeaveRequest: (data: any) => Promise<boolean>;
  handleApproveLeaveRequest: (id: string) => Promise<boolean>;
  handleRejectLeaveRequest: (id: string, note:string) => Promise<boolean>;

  refetchApprovalQueue: () => void;
  refetchActivityFeed: () => void;
   refetchTeamlead: () => void;
}