
export interface AppraisalObjective {
  id: string;
  category: 'OBJECTIVES' | 'FINANCIAL' | 'CUSTOMER_SERVICE' | 'INTERNAL_PROCESS' | 'LEARNING_AND_GROWTH';
  name: string;
  marks: number;
  kpi: string;
  measurementTracker: string;
  employeeScore: number;
  teamLeadScore: number;
  finalScore: number;
  employeeComments: string;
  teamLeadComments: string;
  evidence?: string;
}

export interface Appraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  teamLeadId: string;
  teamLeadName: string;
  title: string;
  period: string;
  dueDate: string;
  status: 'draft' | 'sent_to_employee' | 'employee_completed' | 'teamlead_review' | 'approved' | 'needs_revision' | 'hr_review' | 'completed';
  objectives: AppraisalObjective[];
  createdAt: string;
  updatedAt: string;
  totalScore: {
    employee: number;
    teamLead: number;
    final: number;
  };
  revisionReason?: string;
}

export interface AppraisalTemplate {
  id: string;
  name: string;
  objectives: Omit<AppraisalObjective, 'id' | 'employeeScore' | 'teamLeadScore' | 'finalScore' | 'employeeComments' | 'teamLeadComments' | 'evidence'>[];
}
