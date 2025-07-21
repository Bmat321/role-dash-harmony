
export interface LoanRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'personal' | 'salary_advance' | 'emergency' | 'education' | 'medical';
  amount: number;
  currency: string;
  reason: string;
  repaymentPeriod: number; // in months
  monthlyDeduction: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  disbursedDate?: string;
  comments?: string;
  teamLeadId?: string;
  teamLeadName?: string;
  documents?: string[];
}

export interface LoanBalance {
  employeeId: string;
  totalLoaned: number;
  totalRepaid: number;
  outstandingBalance: number;
  monthlyDeduction: number;
  nextPaymentDate: string;
}
