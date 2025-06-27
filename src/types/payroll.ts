
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: { name: string; amount: number }[];
  bonuses: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  grossSalary: number;
  tax: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  paidDate?: string;
}

export interface SalaryStructure {
  employeeId: string;
  basicSalary: number;
  allowances: { name: string; amount: number; type: 'fixed' | 'percentage' }[];
  deductions: { name: string; amount: number; type: 'fixed' | 'percentage' }[];
}
